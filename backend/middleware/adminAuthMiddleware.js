const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async function adminAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Admin token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch admin
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Admin not authorized" });
    }

    // Attach admin info
    req.admin = admin;

    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(401).json({ message: "Invalid or expired admin token" });
  }
};
