const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const user = await User.findById(req.user.id).select('role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: admin only' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authorization error' });
  }
};
