/**
 * authorizeRoles middleware
 * -------------------------
 * Usage: authorizeRoles("admin")
 * Checks req.user.role
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // if protect didn't run, req.user won't exist
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // if role field is missing, treat as forbidden
    if (!req.user.typeofrole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden, role missing",
      });
    }

    // check role allowed
    if (!roles.includes(req.user.typeofrole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden, you don't have access",
      });
    }

    next();
  };
};