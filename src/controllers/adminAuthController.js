const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

function signToken(adminId) {
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// POST /api/admin/register
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, restroname, phone, city, address } = req.body;

    if (!name || !email || !password || !restroname || !phone || !city || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email,
      password: hashed,
      restroname,
      phone,
      city,
      address,
      typeofrole: "admin",
    });

    const token = signToken(admin._id);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        restroname: admin.restroname,
        phone: admin.phone,
        city: admin.city,
        address: admin.address,
        typeofrole: admin.typeofrole,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/login
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(admin._id);

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        restroname: admin.restroname,
        phone: admin.phone,
        city: admin.city,
        address: admin.address,
        typeofrole: admin.typeofrole,
      },
    });
  } catch (err) {
    next(err);
  }
};