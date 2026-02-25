const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel"); // ✅ adjust if your file name differs

/**
 * protect middleware
 * ------------------
 * Checks "Authorization: Bearer <token>" header
 * Verifies token
 * Loads admin user from DB
 * Attaches admin to req.user
 */
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1) Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // 2) Extract token
    const token = authHeader.split(" ")[1];

    // 3) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) Find admin in DB (decoded must contain id)
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, admin not found",
      });
    }

    // 5) Attach to request
    req.user = admin;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }
};