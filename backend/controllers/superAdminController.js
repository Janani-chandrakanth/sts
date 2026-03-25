const Office = require("../models/Office");
const Appointment = require("../models/Appointment");
const Admin = require("../models/Admin");
const Service = require("../models/Service");
const mongoose = require("mongoose");


/* =========================
   CREATE OFFICE
========================= */
exports.createOffice = async (req, res) => {
  try {

    const {
      officeName,
      officeType,
      city,
      pincode,
      location,
      services,
      totalCounters,
      workingHours,
      breaks,
      maxTokensPerDay
    } = req.body;

    const office = new Office({
      officeName,
      officeType,
      city,
      pincode,
      location,
      services,
      totalCounters,
      workingHours,
      breaks,
      maxTokensPerDay
    });

    await office.save();

    res.status(201).json({
      message: "Office created successfully",
      office
    });

  } catch (error) {

    console.error("Create office error:", error);

    res.status(500).json({
      message: "Failed to create office"
    });

  }
};


/* =========================
   GET ALL OFFICES
========================= */
exports.getAllOffices = async (req, res) => {
  try {

    const offices = await Office
      .find()
      .populate("services")
      .sort({ city: 1 });

    res.json(offices);

  } catch (error) {

    console.error("Fetch offices error:", error);

    res.status(500).json({
      message: "Failed to fetch offices"
    });

  }
};


/* =========================
   CREATE OFFICER
========================= */
exports.addOfficer = async (req, res) => {
  try {

    const { username, password, officeId, counterNumber } = req.body;

    const office = await Office.findById(officeId);
    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const officer = new Admin({
      username,
      password,
      office: officeId,
      counterNumber
    });

    await officer.save();

    res.status(201).json({
      message: "Officer created successfully",
      officer
    });

  } catch (error) {

    console.error("Add officer error:", error);

    res.status(500).json({
      message: "Failed to create officer"
    });

  }
};


/* =========================
   SUPER ADMIN DASHBOARD
========================= */
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalOffices = await Office.countDocuments();
    const totalOfficers = await Admin.countDocuments({ role: "officer" });
    const totalAppointments = await Appointment.countDocuments();

    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    const pendingTokens = await Appointment.countDocuments({
      status: "pending"
    });

    const completedTokens = await Appointment.countDocuments({
      status: "completed"
    });

    res.json({
      totalOffices,
      totalOfficers,
      totalAppointments,
      todayAppointments,
      pendingTokens,
      completedTokens
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data"
    });
  }
};


/* =========================
   ADVANCED DASHBOARD ANALYTICS (NEW)
========================= */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Last 7 Days Trends
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trends = await Appointment.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 2. Office Type Distribution
    const officeDist = await Office.aggregate([
      { $group: { _id: "$officeType", count: { $sum: 1 } } }
    ]);

    // 3. Service Demand
    const serviceDemand = await Appointment.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceData"
        }
      },
      { $unwind: "$serviceData" },
      { $group: { _id: "$serviceData.serviceName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ trends, officeDist, serviceDemand });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Analytics failed" });
  }
};


/* =========================
   UPDATE OFFICE
========================= */
exports.updateOffice = async (req, res) => {
  try {

    const office = await Office.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!office) {
      return res.status(404).json({
        message: "Office not found"
      });
    }

    res.json({
      message: "Office updated successfully",
      office
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update office"
    });

  }
};


/* =========================
   TOGGLE OFFICE STATUS
========================= */
exports.toggleOfficeStatus = async (req, res) => {
  try {

    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        message: "Office not found"
      });
    }

    office.isActive = !office.isActive;

    await office.save();

    res.json({
      message: "Office status updated",
      isActive: office.isActive
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update office status"
    });

  }
};


/* =========================
   DELETE OFFICE
========================= */
exports.deleteOffice = async (req, res) => {
  try {

    const office = await Office.findByIdAndDelete(req.params.id);

    if (!office) {
      return res.status(404).json({
        message: "Office not found"
      });
    }

    res.json({
      message: "Office deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete office"
    });

  }
};


/* =========================
   GET ALL APPOINTMENTS
========================= */
exports.getAllAppointments = async (req, res) => {
  try {

    const { date, office, status } = req.query;

    const filter = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (office) filter.office = office;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate("office", "officeName city officeType")
      .populate("service", "serviceName")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(appointments);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch appointments"
    });

  }
};


/* =========================
   GET ALL OFFICERS
========================= */
exports.getAllOfficers = async (req, res) => {
  try {

    const officers = await Admin.find()
      .populate("office", "officeName city officeType")
      .sort({ createdAt: -1 });

    res.json(officers);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch officers"
    });

  }
};


/* =========================
   UPDATE OFFICER
========================= */
exports.updateOfficer = async (req, res) => {
  try {

    const officer = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Officer updated successfully",
      officer
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update officer"
    });

  }
};


/* =========================
   DELETE OFFICER
========================= */
exports.deleteOfficer = async (req, res) => {
  try {

    await Admin.findByIdAndDelete(req.params.id);

    res.json({
      message: "Officer deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete officer"
    });

  }
};


/* =========================
   LIVE TOKEN MONITORING
========================= */
exports.getLiveTokens = async (req, res) => {
  try {

    const tokens = await Appointment.find({
      status: { $in: ["pending", "called"] }
    })
      .populate("office", "officeName")
      .sort({ tokenNumber: 1 });

    const formatted = tokens.map((t) => ({
      office: t.office?.officeName || "Office",
      counter: t.counterNumber || "-",
      currentToken: t.tokenNumber,
      status: t.status
    }));

    res.json(formatted);

  } catch (error) {

    console.error("Live token error:", error);

    res.status(500).json({
      message: "Failed to fetch live tokens"
    });

  }
};


/* =========================
   GET OFFICE STATS
========================= */
exports.getOfficeStats = async (req, res) => {
  try {
    const queryDate = req.query.date || new Date().toISOString().split("T")[0];
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Using aggregation to group by office
    const stats = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: "$office",
          totalTokens: { $sum: 1 },
          pendingTokens: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          completedTokens: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          totalWaitTime: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed"] },
                { $subtract: ["$updatedAt", "$createdAt"] },
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "offices", // The collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "officeData"
        }
      },
      {
        $unwind: {
          path: "$officeData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          officeName: { $ifNull: ["$officeData.officeName", "Unknown Office"] },
          totalTokens: 1,
          pendingTokens: 1,
          completedTokens: 1,
          averageWaitingTime: {
            $cond: [
              { $gt: ["$completedTokens", 0] },
              { $divide: ["$totalWaitTime", { $multiply: ["$completedTokens", 60000] }] }, // in minutes
              0
            ]
          }
        }
      },
      {
        $sort: { officeName: 1 }
      }
    ]);

    res.json(stats);

  } catch (error) {
    console.error("Office stats error:", error);
    res.status(500).json({ message: "Failed to fetch office statistics" });
  }
};


/* =========================
   GET OFFICER PERFORMANCE
========================= */
exports.getOfficerPerformance = async (req, res) => {
  try {
    const queryDate = req.query.date || new Date().toISOString().split("T")[0];
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    // First group appointments by office and counter number
    const performance = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
          status: "completed"
        }
      },
      {
        $group: {
          _id: { office: "$office", counterNumber: "$counterNumber" },
          tokensServed: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "offices",
          localField: "_id.office",
          foreignField: "_id",
          as: "officeData"
        }
      },
      {
        $unwind: {
          path: "$officeData",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup the Admin collection (Admins collection)
      {
        $lookup: {
          from: "Admins collection",
          let: { officeId: "$_id.office", counterNum: "$_id.counterNumber" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$office", "$$officeId"] },
                    { $eq: ["$counterNumber", "$$counterNum"] }
                  ]
                }
              }
            }
          ],
          as: "officerData"
        }
      },
      {
        $unwind: {
          path: "$officerData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          officeId: "$_id.office",
          officeName: { $ifNull: ["$officeData.officeName", "Unknown Office"] },
          counterNumber: "$_id.counterNumber",
          officerName: { $ifNull: ["$officerData.username", "Unknown Officer"] },
          tokensServed: 1
        }
      },
      {
        $sort: { officeName: 1, counterNumber: 1 }
      }
    ]);

    res.json(performance);

  } catch (error) {
    console.error("Officer performance error:", error);
    res.status(500).json({ message: "Failed to fetch officer performance" });
  }
};

/* =========================
   SERVICE MANAGEMENT
========================= */
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ officeType: 1, serviceName: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services" });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ message: "Service created", service });
  } catch (error) {
    res.status(400).json({ message: error.message || "Error creating service" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting service" });
  }
};