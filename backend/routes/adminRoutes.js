const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getTodayQueue,
  callNextToken,
  completeToken
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminAuth");
const Office = require("../models/Office"); // ✅ ADD THIS
const appointmentController = require("../controllers/appointmentController");

// ---------------- AUTH & QUEUE ----------------
router.post("/login", adminLogin);
router.get("/queue", adminAuth, getTodayQueue);
router.put("/next", adminAuth, callNextToken);
router.put("/complete/:id", adminAuth, completeToken);
router.get("/admin/all", appointmentController.getAllAppointments);

// ---------------- OFFICES (PUBLIC FOR USERS) ----------------
// Fetch all offices so users can select while booking
router.get("/offices", async (req, res) => {
  try {
    const offices = await Office.find().sort({ city: 1 });
    res.json(offices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch offices" });
  }
});


module.exports = router;
