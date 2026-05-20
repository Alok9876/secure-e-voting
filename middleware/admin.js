// Must be used AFTER protect middleware
const adminOnly = (req, res, next) => {
  if (req.voter && req.voter.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
};

module.exports = { adminOnly };
