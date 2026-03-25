const Appointment = require("../models/Appointment");
const Office = require("../models/Office");
const Service = require("../models/Service");

// Priority → Counter mapping (for new flow)
const PRIORITY_COUNTER_MAP = {
  general: [3, 4],
  senior: [1],
  disabled: [2],
  emergency: [1, 2]
};

const counterIndex = {};

const assignCounter = (priority) => {
  const counters = PRIORITY_COUNTER_MAP[priority] || PRIORITY_COUNTER_MAP.general;

  if (!counterIndex[priority]) {
    counterIndex[priority] = 0;
  }

  const counter = counters[counterIndex[priority] % counters.length];
  counterIndex[priority]++;

  return counter;
};

/* ===============================
   🟢 BOOK APPOINTMENT (UPDATED FOR USER-CONTROLLED SLOTS)
   ============================== */
exports.bookAppointment = async (req, res) => {
  try {
    const { officeId, service: serviceId, date, timeSlot, priorityCategory } = req.body;
    const userId = req.user.id;

    /* 1️⃣ Validate office */
    const office = await Office.findById(officeId);
    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    /* 2️⃣ Validate service */
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not available" });
    }

    /* 3️⃣ Ensure service belongs to office type */
    if (service.officeType !== office.officeType) {
      return res.status(400).json({
        message: "Selected service is not supported by this office"
      });
    }

    /* 4️⃣ Normalize date WITHOUT timezone shifts: if date is already YYYY-MM-DD, keep it as-is */
    let normalizedDate = date;
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(date)) {
      // fallback to parsing when a full datetime was provided
      normalizedDate = new Date(date).toISOString().split("T")[0];
    }

    /* 5️⃣ Prevent multiple bookings same day */
    const alreadyBooked = await Appointment.findOne({
      user: userId,
      date: normalizedDate,
      status: { $ne: "cancelled" }
    });

    if (alreadyBooked) {
      return res.status(400).json({
        message: "You already have an appointment on this date"
      });
    }

    /* 6️⃣ ✅ NEW: Check if selected time slot is available */
    const slotTaken = await Appointment.countDocuments({
      office: officeId,
      date: normalizedDate,
      timeSlot: timeSlot,
      status: { $ne: "cancelled" }
    });

    if (slotTaken > 0) {
      return res.status(400).json({
        message: "Selected time slot is no longer available"
      });
    }

    /* 7️⃣ ✅ NEW: Assign counter based on priority */
    const counterNumber = assignCounter(priorityCategory || "general");

    /* 8️⃣ Generate token number (sequential per day, not per slot) */
    const countForDay = await Appointment.countDocuments({
      office: officeId,
      date: normalizedDate,
      status: { $ne: "cancelled" }
    });
    const nextToken = countForDay + 1;

    /* 9️⃣ Create appointment with counter */
    const appointment = new Appointment({
      user: userId,
      office: office._id,
      service: service._id,
      date: normalizedDate,
      timeSlot: timeSlot, // ✅ User-selected slot
      priorityCategory: priorityCategory || "general",
      counterNumber, // ✅ Auto-assigned
      tokenNumber: nextToken,
      status: "pending"
    });

    await appointment.save();

    // Populate for receipt
    await appointment.populate([
      { path: "office", select: "officeName city" },
      { path: "service", select: "serviceName requiredDocuments" }
    ]);

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: {
        _id: appointment._id,
        office: appointment.office.officeName,
        service: appointment.service.serviceName,
        date: normalizedDate,
        timeSlot: timeSlot,
        tokenNumber: nextToken,
        counterNumber,
        priorityCategory: priorityCategory || "general",
        documents: appointment.service.requiredDocuments || [],
        verificationUrl: `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/verify?appt=${appointment._id}`
      }
    });

  } catch (err) {
    console.error("Book appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   📅 GET AVAILABLE DATES (UPDATED - returns token counts)
   ============================== */
exports.getAvailableDates = async (req, res) => {
  try {
    const { officeId } = req.params;

    const office = await Office.findById(officeId);
    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    const MAX_APPOINTMENTS_PER_DAY = office.maxTokensPerDay || 25;
    const DAYS_TO_SHOW = 14;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = [];

    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + i);

      // Sunday closed 🏛️
      if (dateObj.getDay() === 0) continue;

      const dateStr = dateObj.toISOString().split("T")[0];

      const bookedCount = await Appointment.countDocuments({
        office: officeId,
        date: dateStr,
        status: { $ne: "cancelled" }
      });

      const availableTokens = Math.max(MAX_APPOINTMENTS_PER_DAY - bookedCount, 0);
      result.push({ date: dateStr, availableTokens });
    }

    res.json(result);
  } catch (err) {
    console.error("Available dates error:", err);
    res.status(500).json({ message: "Failed to fetch available dates" });
  }
};

/* ===============================
   ⏰ GET TIME SLOTS (NEW - smart generation)
   ============================== */
exports.getTimeSlots = async (req, res) => {
  try {
    const { officeId, date, serviceId } = req.query;

    if (!officeId || !date) {
      return res.status(400).json({ message: "officeId and date required" });
    }

    const office = await Office.findById(officeId);
    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    // Office timings
    const startTime = office.workingHours?.start || "10:00";
    const endTime = office.workingHours?.end || "17:00";
    const breaks = office.breaks || ["13:00-14:00"];
    const duration = 20; // 20 min slots

    // Generate slots
    const slots = [];
    let currentTime = new Date(`2026-01-01T${startTime}:00`);
    const end = new Date(`2026-01-01T${endTime}:00`);

    while (currentTime < end) {
      const slotStart = currentTime.toTimeString().slice(0, 5);
      const slotEnd = new Date(currentTime.getTime() + duration * 60000)
        .toTimeString()
        .slice(0, 5);
      
      const slotLabel = `${slotStart} - ${slotEnd}`;

      // Skip lunch break
      const inBreak = breaks.some(breakRange => {
        const [breakStart, breakEnd] = breakRange.split("-");
        return slotStart >= breakStart && slotStart < breakEnd;
      });

      if (!inBreak) {
        slots.push(slotLabel);
      }

      currentTime = new Date(currentTime.getTime() + duration * 60000);
    }

    // Remove already booked slots
    const bookedSlots = await Appointment.find({
      office: officeId,
      date,
      status: { $ne: "cancelled" }
    }).select("timeSlot");

    const availableSlots = slots.filter(slot => 
      !bookedSlots.some(b => b.timeSlot === slot)
    );

    // Same day: only future slots
    if (date === new Date().toISOString().slice(0, 10)) {
      const now = new Date().toTimeString().slice(0, 5);
      const futureSlots = availableSlots.filter(slot => {
        const slotStart = slot.split(" - ")[0];
        return slotStart > now;
      });
      res.json(futureSlots);
    } else {
      res.json(availableSlots.slice(0, 20)); // Max 20 slots per day
    }
  } catch (err) {
    console.error("Time slots error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   👤 VIEW MY APPOINTMENTS (UNCHANGED)
   ============================== */
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.user.id
    })
      .populate("office", "officeName city officeType")
      .populate("service", "serviceName serviceCode")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ❌ CANCEL APPOINTMENT (UNCHANGED)
   ============================== */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (["completed", "cancelled"].includes(appointment.status)) {
      return res.status(400).json({
        message: "This appointment cannot be cancelled"
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ===============================
   🧑‍💼 GET ALL APPOINTMENTS (SUPER ADMIN)
   ============================== */

exports.getAllAppointments = async (req,res)=>{
  try{

    const appointments = await Appointment.find()
      .populate("user","name email")
      .populate("service","serviceName")
      .populate("office","officeName city")
      .sort({createdAt:-1});

    res.json(appointments);

  }catch(err){
    res.status(500).json({message:"Server error"});
  }
};