// serviceRoutes.js - COMPLETE UPDATED VERSION
const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Office = require("../models/Office"); // ✅ ADDED FOR /:id endpoint

/**
 * ===============================
 * 🧾 GET SERVICES BY OFFICE TYPE
 * ===============================
 * /api/services?officeType=RTO
 */
router.get("/", async (req, res) => {
  try {
    const { officeType } = req.query;

    if (!officeType) {
      return res.status(400).json({
        message: "officeType is required"
      });
    }

    const services = await Service.find({
      officeType,
      isActive: true
    })
      .select(
        "serviceName serviceCode description requiredDocuments processingTime priorityAllowed priorityNote"
      )
      .sort({ serviceName: 1 });

    res.json({
      count: services.length,
      services
    });

  } catch (err) {
    console.error("Service fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ===============================
 * 📋 GET SERVICE DETAILS + OFFICES
 * ===============================
 * /api/services/:id
 * Returns service details + offices offering this service type
 */
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).select(
      "serviceName serviceCode description requiredDocuments processingTime priorityAllowed priorityNote officeType"
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Get offices that offer this service type
    const offices = await Office.find({
      officeType: service.officeType,
      isActive: true
    }).select("officeName officeType pincode city");

    res.json({
      service,
      offices
    });
  } catch (err) {
    console.error("Service details error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
