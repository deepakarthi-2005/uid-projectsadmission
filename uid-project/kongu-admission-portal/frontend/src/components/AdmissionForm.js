import React, { useState } from 'react';
import api from '../api/axios';
import './AdmissionForm.css';
import { useToast } from '../context/ToastContext';

const AdmissionForm = ({ onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    academicCourse: '',
    previousQualification: '',
    percentage: '',
    fatherName: '',
    motherName: '',
    guardianPhone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const courses = [
    'B.E. Computer Science and Engineering',
    'B.E. Electronics and Communication Engineering',
    'B.E. Mechanical Engineering',
    'B.E. Civil Engineering',
    'B.E. Electrical and Electronics Engineering',
    'B.Tech. Information Technology',
    'B.Tech. Artificial Intelligence and Data Science',
    'M.E. Computer Science and Engineering',
    'M.E. Applied Electronics',
    'MBA - Master of Business Administration'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic client-side validation
      const required = [
        'fullName','email','phone','dateOfBirth','gender','address','city','state','pincode',
        'academicCourse','previousQualification','percentage','fatherName','motherName','guardianPhone'
      ];
      for (const key of required) {
        if (!formData[key] || String(formData[key]).trim() === '') {
          throw new Error('Please fill all required fields');
        }
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        throw new Error('Phone number must be 10 digits');
      }
      if (!/^\d{6}$/.test(formData.pincode)) {
        throw new Error('Pincode must be 6 digits');
      }
      const pct = Number(formData.percentage);
      if (Number.isNaN(pct) || pct < 0 || pct > 100) {
        throw new Error('Percentage must be a number between 0 and 100');
      }
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await api.post('/api/admissions/submit', formData);
      
      if (response.data.success) {
        toast.success('Application submitted successfully');
        onSuccess(response.data);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          academicCourse: '',
          previousQualification: '',
          percentage: '',
          fatherName: '',
          motherName: '',
          guardianPhone: ''
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error submitting application. Please try again.';
      setError(msg);
      toast.error(msg);
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admission-form-container">
      <div className="form-header">
        <h2>Academic Course Admission Application</h2>
        <p>Please fill in all the required details</p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admission-form">
        {/* Personal Information Section */}
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="form-section">
          <h3 className="section-title">Address Information</h3>
          
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your complete address"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="State"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pincode">Pincode *</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                placeholder="6-digit pincode"
                pattern="[0-9]{6}"
              />
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="form-section">
          <h3 className="section-title">Academic Information</h3>
          
          <div className="form-group">
            <label htmlFor="academicCourse">Select Academic Course *</label>
            <select
              id="academicCourse"
              name="academicCourse"
              value={formData.academicCourse}
              onChange={handleChange}
              required
            >
              <option value="">Choose a course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="previousQualification">Previous Qualification *</label>
              <input
                type="text"
                id="previousQualification"
                name="previousQualification"
                value={formData.previousQualification}
                onChange={handleChange}
                required
                placeholder="e.g., 12th Standard, Diploma"
              />
            </div>

            <div className="form-group">
              <label htmlFor="percentage">Percentage/CGPA *</label>
              <input
                type="number"
                id="percentage"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                required
                placeholder="Enter percentage"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Parent/Guardian Information Section */}
        <div className="form-section">
          <h3 className="section-title">Parent/Guardian Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fatherName">Father's Name *</label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
                placeholder="Father's full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="motherName">Mother's Name *</label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                required
                placeholder="Mother's full name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="guardianPhone">Guardian Phone Number *</label>
              <input
                type="tel"
                id="guardianPhone"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;
