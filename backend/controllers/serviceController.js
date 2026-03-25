const Service = require("../models/Service");

/* ===============================
   🧾 GET SERVICES BY OFFICE TYPE
   =============================== */
exports.getServicesByOfficeType = async (req, res) => {
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
    }).select(
      "serviceName serviceCode description requiredDocuments processingTime priorityAllowed priorityNote"
    );

    res.json(services);
  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
