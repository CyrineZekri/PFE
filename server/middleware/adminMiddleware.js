const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    // Find the authenticated user in the database
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has admin privileges
    if (user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminMiddleware;
