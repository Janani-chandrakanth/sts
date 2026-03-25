// routes/officeRoutes.js - COMPLETE VERSION WITH DEBUG LOGS
const express = require("express");
const router = express.Router();
const Office = require("../models/Office");

router.get("/test", async (req, res) => {
  try {
    const count = await Office.countDocuments();
    const sample = await Office.findOne();
    console.log("🧪 Test endpoint - count:", count, "sample:", sample?.officeName);
    res.json({ count, sample });
  } catch (err) {
    console.error("❌ Test error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  console.log("🔍 Search called with params:", req.query); // DEBUG

  try {
    const { type, pincode } = req.query;

    console.log("📊 Query params - type:", type, "pincode:", pincode); // DEBUG

    if (!type) {
      console.log("❌ No type provided");
      return res.status(400).json({ message: "Office type required" });
    }

    // Test basic query first
    const allOffices = await Office.find({ officeType: type });
    console.log("📋 All offices for type", type, ":", allOffices.length); // DEBUG

    // No pincode = return all as others
    if (!pincode) {
      console.log("📍 No pincode - returning all as others");
      return res.json({ 
        nearby: [], 
        others: allOffices 
      });
    }

    console.log("🎯 Searching nearby for pincode:", pincode); // DEBUG

    // Find reference office by pincode
    const refOffice = await Office.findOne({
      officeType: type,
      pincode,
      isActive: true
    });

    console.log("📍 Reference office found:", !!refOffice, refOffice?.officeName); // DEBUG

    if (!refOffice || !refOffice.location?.coordinates) {
      console.log("🔄 Fallback to simple pincode filter");
      const nearby = allOffices.filter(o => o.pincode === pincode);
      const others = allOffices.filter(o => o.pincode !== pincode);
      console.log("📊 Fallback - nearby:", nearby.length, "others:", others.length);
      return res.json({ nearby, others });
    }

    const [lng, lat] = refOffice.location.coordinates;
    console.log("🗺️  Using coords:", lng, lat, "from", refOffice.officeName); // DEBUG

    // Geo query
    const nearby = await Office.find({
      officeType: type,
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 5000 // 5km
        }
      }
    });

    console.log("🌍 Geo nearby found:", nearby.length); // DEBUG

    // Others
    const nearbyIds = nearby.map(o => o._id);
    const others = await Office.find({
      officeType: type,
      isActive: true,
      _id: { $nin: nearbyIds }
    });

    console.log("✅ Final result - nearby:", nearby.length, "others:", others.length); // DEBUG

    res.json({ nearby, others });
  } catch (err) {
    console.error("❌ Office search error:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
});

// GET office by id
router.get("/:id", async (req, res) => {
  try {
    const office = await Office.findById(req.params.id).select("officeName officeType pincode city totalCounters workingHours");
    if (!office) return res.status(404).json({ message: "Office not found" });
    res.json(office);
  } catch (err) {
    console.error("Get office by id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
