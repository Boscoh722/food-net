// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

/**
 * Protect middleware — verifies JWT and attaches user info to req.user
 */
export const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.header('Authorization') || req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};

/**
 * restrictTo middleware — limits route access to specific roles
 * @param {...string} roles - allowed roles (e.g., 'admin', 'seller')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden. Insufficient permissions.' });
    }

    next();
  };
};
