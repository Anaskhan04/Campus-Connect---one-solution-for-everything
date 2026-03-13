const jwt = require('jsonwebtoken');

const getTokenFromRequest = (req) => req.headers.authorization?.split(' ')[1];

const authMiddleware = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const optionalAuthMiddleware = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (token) {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch (error) {
    // Keep signup public: ignore invalid optional auth header.
  }

  next();
};

module.exports = authMiddleware;
module.exports.optionalAuthMiddleware = optionalAuthMiddleware;
