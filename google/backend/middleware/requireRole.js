/**
 * Middleware to restrict access based on user role
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      return next(error);
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Admin has universal override
    if (req.user.role === 'admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error('Unauthorized: Access denied for your role');
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

module.exports = requireRole;
