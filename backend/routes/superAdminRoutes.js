const express = require("express");
const router = express.Router();

const {
  createOffice,
  getAllOffices,
  addOfficer,
  getDashboardStats,
  updateOffice,
  toggleOfficeStatus,
  deleteOffice,
  getAllAppointments,
  getAllOfficers,
  updateOfficer,
  deleteOfficer,
  getLiveTokens,
  getOfficeStats,
  getOfficerPerformance,
  getDashboardAnalytics,
  getServices,
  createService,
  deleteService
} = require("../controllers/superAdminController");

/* DASHBOARD */
router.get("/dashboard", getDashboardStats);
router.get("/analytics", getDashboardAnalytics);
router.get("/office-stats", getOfficeStats);
router.get("/officer-performance", getOfficerPerformance);

/* LIVE TOKEN MONITORING */
router.get("/live-tokens", getLiveTokens);

/* OFFICE MANAGEMENT */
router.post("/office", createOffice);
router.post("/offices", createOffice); // Mobile compatibility
router.get("/offices", getAllOffices);
router.put("/office/:id", updateOffice);
router.patch("/office/:id/status", toggleOfficeStatus);
router.delete("/office/:id", deleteOffice);
router.delete("/offices/:id", deleteOffice); // Mobile compatibility

/* OFFICER MANAGEMENT */
router.post("/officer", addOfficer);
router.post("/officers", addOfficer); // Mobile compatibility
router.get("/officers", getAllOfficers);
router.put("/officer/:id", updateOfficer);
router.delete("/officer/:id", deleteOfficer);
router.delete("/officers/:id", deleteOfficer); // Mobile compatibility

/* APPOINTMENTS */
router.get("/appointments", getAllAppointments);

// 🧱 SERVICES
router.get("/services", getServices);
router.post("/service", createService);
router.post("/services", createService); // Mobile compatibility
router.delete("/service/:id", deleteService);
router.delete("/services/:id", deleteService); // Mobile compatibility

module.exports = router;