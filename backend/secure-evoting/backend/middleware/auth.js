const jwt   = require('jsonwebtoken');
const Voter = require('../models/Voter');

// Protect routes — require valid JWT
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const voter   = await Voter.findById(decoded.id).select('-password -otp -otpExpiry');
    if (!voter) {
      return res.status(401).json({ success: false, message: 'Token invalid. User not found.' });
    }
    req.voter = voter;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid.' });
  }
};

// Require voter to be approved by admin
const requireApproved = (req, res, next) => {
  if (!req.voter.isApproved) {
    return res.status(403).json({ success: false, message: 'Your account is pending admin approval.' });
  }
  next();
};

module.exports = { protect, requireApproved };
