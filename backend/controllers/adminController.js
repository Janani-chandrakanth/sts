const Admin = require("../models/Admin");
const Appointment = require("../models/Appointment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* ✅ SUPER ADMIN CONFIG */
const SUPER_ADMIN = {
  username: "superadmin@gov.in",
  password: "admin123"
};

/* =========================
   ADMIN LOGIN
========================= */
exports.adminLogin = async (req, res) => {
  try {
     console.log("LOGIN BODY:", req.body);
    const { username, password } = req.body;

    /* SUPER ADMIN LOGIN */
    const normalizedUsername = username.toLowerCase().trim();

    if (
      normalizedUsername === SUPER_ADMIN.username.toLowerCase() &&
      password === SUPER_ADMIN.password
    ) {
      console.log("SUPER ADMIN LOGIN SUCCESS");
      const token = jwt.sign(
        { role: "superadmin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        role: "superadmin",
        token,
        name: "Super Admin",
        email: SUPER_ADMIN.username
      });
    }

    /* OFFICER LOGIN FROM DB */
    console.log(`ATTEMPTING LOGIN FOR: "${normalizedUsername}"`);
    const admin = await Admin.findOne({ username: normalizedUsername }).populate("office");

    if (!admin) {
      console.log(`LOGIN FAILED: User "${normalizedUsername}" not found in DB`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`DB USER FOUND. PASS IN DB TYPE: ${admin.password.startsWith('$') ? 'HASHED' : 'PLAIN'}`);

    // Support both hashed and legacy plaintext passwords
    let isMatch = false;
    if (admin.password.startsWith("$2b$") || admin.password.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, admin.password);
    } else {
      isMatch = (admin.password === password);
    }

    if (!isMatch) {
      console.log(`LOGIN FAILED: Password mismatch for "${normalizedUsername}"`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`LOGIN SUCCESS: "${normalizedUsername}"`);

    // Dynamic role from database (officer or superadmin)
    const role = admin.role || "officer";

    const token = jwt.sign(
      {
        role: role,
        adminId: admin._id,
        username: admin.username,
        officeId: admin.office?._id || null,
        officeName: admin.office?.officeName || "System",
        officeType: admin.office?.officeType || "N/A",
        counterNumber: admin.counterNumber || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      role: role,
      token,
      name: admin.username.split('@')[0], // Extract name from email
      email: admin.username
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* =========================
   VIEW TODAY QUEUE
========================= */
exports.getTodayQueue = async (req, res) => {
  try {

    const { date } = req.query;

    const queue = await Appointment.find({
      office: req.admin.officeId,
      date: date,
      status: "pending"
    }).sort({
      priorityCategory: 1,
      tokenNumber: 1
    });

    res.json(queue);

  } catch (err) {
    console.error("Queue fetch error:", err);
    res.status(500).json({ message: "Failed to fetch queue" });
  }
};

/* =========================
   CALL NEXT TOKEN
========================= */
exports.callNextToken = async (req, res) => {
  try {

    const counterNumber = req.admin.counterNumber;

    const appointment = await Appointment.findOne({
      office: req.admin.officeId,
      date: req.query.date,
      status: "pending"
    }).sort({
      priorityCategory: 1,
      tokenNumber: 1
    });

    if (!appointment) {
      return res.json({ message: "No pending tokens" });
    }

    appointment.status = "called";
    appointment.counterNumber = counterNumber;

    await appointment.save();

    res.json({
      message: "Next token called",
      tokenNumber: appointment.tokenNumber,
      counter: counterNumber
    });

  } catch (err) {
    console.error("Call next token error:", err);
    res.status(500).json({ message: "Failed to call next token" });
  }
};

/* =========================
   COMPLETE TOKEN
========================= */
exports.completeToken = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "completed";

    await appointment.save();

    res.json({ message: "Token completed" });

  } catch (err) {
    console.error("Complete token error:", err);
    res.status(500).json({ message: "Failed to complete token" });
  }
};