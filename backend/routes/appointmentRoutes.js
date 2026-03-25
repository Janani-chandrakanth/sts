// appointmentRoutes.js - COMPLETE CLEAN VERSION
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const Appointment = require("../models/Appointment"); // ✅ Needed for complete/skip

const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAvailableDates,
  getTimeSlots,
  getAllAppointments // ✅ NEW (for SuperAdmin dashboard)
} = require("../controllers/appointmentController");

/**
 * ===============================
 * 👤 USER APPOINTMENT ACTIONS
 * ===============================
 */

// ✅ Book appointment
router.post("/book", authMiddleware, bookAppointment);

// ✅ Get logged-in user's appointments
router.get("/my", authMiddleware, getMyAppointments);

// ✅ Cancel appointment (only if pending)
router.put("/cancel/:id", authMiddleware, cancelAppointment);

// ✅ Get available dates for an office
router.get("/available-dates/:officeId", authMiddleware, getAvailableDates);

// ✅ Get available time slots for date/office
router.get("/time-slots", authMiddleware, getTimeSlots);

// ✅ Preview assigned counter (no booking)
router.get("/counter-preview", authMiddleware, (req, res) => {
  try {
    const { priority, officeId } = req.query;

    if (!priority || !officeId) {
      return res.status(400).json({ message: "priority and officeId required" });
    }

    const PRIORITY_COUNTER_MAP = {
      general: [3, 4],
      senior: [1],
      disabled: [2],
      emergency: [1, 2]
    };

    const counters = PRIORITY_COUNTER_MAP[priority] || PRIORITY_COUNTER_MAP.general;
    const counter = counters[Math.floor(Math.random() * counters.length)];

    res.json({ counter });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * ===============================
 * 🧑‍💼 ADMIN ACTIONS
 * ===============================
 */

// ✅ Mark appointment as COMPLETED
router.put("/complete/:id", adminAuthMiddleware, async (req, res) => {
  try {

    const appt = await Appointment.findById(req.params.id);

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appt.status = "completed";
    await appt.save();

    res.json({ message: "Appointment completed" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Mark appointment as SKIPPED
router.put("/skip/:id", adminAuthMiddleware, async (req, res) => {
  try {

    const appt = await Appointment.findById(req.params.id);

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appt.status = "cancelled";
    await appt.save();

    res.json({ message: "Appointment skipped" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * ===============================
 * 👑 SUPER ADMIN ACTIONS
 * ===============================
 */

// ✅ Fetch all appointments for monitoring dashboard
router.get("/admin/all", adminAuthMiddleware, getAllAppointments);


module.exports = router;