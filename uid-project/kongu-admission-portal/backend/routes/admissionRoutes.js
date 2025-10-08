const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { sendStatusEmail } = require('../utils/mailer');

// POST - Submit admission application
router.post('/submit', auth, async (req, res) => {
  try {
    const admissionData = new Admission(req.body);
    const savedAdmission = await admissionData.save();

    // Send application received email (fire-and-forget)
    (async () => {
      try {
        await sendStatusEmail({
          to: savedAdmission.email,
          name: savedAdmission.fullName,
          course: savedAdmission.academicCourse,
          status: 'Pending',
          applicationId: savedAdmission._id,
        });
      } catch (_) {}
    })();

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully! You will be notified soon.',
      data: savedAdmission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error submitting admission application',
      error: error.message
    });
  }
});

// PATCH - Update admission status (admin only)
router.patch('/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Approved', 'Rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found' });
    }

    // Fire-and-forget email (do not block response)
    (async () => {
      try {
        await sendStatusEmail({
          to: admission.email,
          name: admission.fullName,
          course: admission.academicCourse,
          status: admission.status,
          applicationId: admission._id,
        });
      } catch (_) {}
    })();

    res.status(200).json({ success: true, data: admission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
  }
});

// POST - Resend current status email (admin only)
router.post('/:id/resend-email', auth, requireAdmin, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found' });
    }

    const result = await sendStatusEmail({
      to: admission.email,
      name: admission.fullName,
      course: admission.academicCourse,
      status: admission.status,
      applicationId: admission._id,
    });

    res.status(200).json({ success: true, data: { emailed: !!result?.sent, meta: result } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resending email', error: error.message });
  }
});

// GET - Get all admissions (admin only)
router.get('/all', auth, requireAdmin, async (req, res) => {
  try {
    const {
      page,
      limit,
      status,
      course,
      q,
      fromDate,
      toDate,
      sortKey = 'applicationDate',
      sortDir = 'desc'
    } = req.query;

    // Build filters
    const filter = {};
    if (status && ['Pending','Approved','Rejected'].includes(status)) {
      filter.status = status;
    }
    if (course) {
      filter.academicCourse = course;
    }
    if (fromDate || toDate) {
      filter.$and = filter.$and || [];
      const range = {};
      if (fromDate) range.$gte = new Date(fromDate);
      if (toDate) {
        const t = new Date(toDate);
        t.setHours(23,59,59,999);
        range.$lte = t;
      }
      filter.$and.push({ $or: [
        { applicationDate: range },
        { createdAt: range }
      ]});
    }
    if (q) {
      const rx = new RegExp(q, 'i');
      filter.$or = [
        { fullName: rx },
        { email: rx },
        { phone: rx },
        { academicCourse: rx },
        { city: rx },
        { state: rx },
        { status: rx },
      ];
    }

    // Sorting
    const sort = {};
    const allowedSort = ['applicationDate','createdAt','fullName','academicCourse','percentage','status'];
    sort[allowedSort.includes(sortKey) ? sortKey : 'applicationDate'] = sortDir === 'asc' ? 1 : -1;

    // If no pagination requested, return all (backward compatibility)
    if (!page || !limit) {
      const admissions = await Admission.find(filter).sort(sort);
      return res.status(200).json({
        success: true,
        count: admissions.length,
        data: admissions
      });
    }

    // Pagination
    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      Admission.find(filter).sort(sort).skip(skip).limit(l),
      Admission.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
      meta: {
        total,
        page: p,
        limit: l,
        totalPages: Math.max(1, Math.ceil(total / l))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
      error: error.message
    });
  }
});

// GET - Get admission by ID (admin only)
router.get('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    res.status(200).json({
      success: true,
      data: admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
      error: error.message
    });
  }
});

module.exports = router;
