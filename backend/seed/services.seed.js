// seedServices.js - COMPLETE VERSION (RTO + VAO + Revenue)
const mongoose = require("mongoose");
const Service = require("../models/Service");
require("dotenv").config();

const services = [
  // 🌐 RTO SERVICES
  {
    serviceName: "Driving License Application",
    serviceCode: "RTO_DL",
    description: "Apply for new Driving License or Learner License",
    requiredDocuments: [
      "Aadhaar Card",
      "Address Proof", 
      "Age Proof",
      "Passport Size Photograph (2)"
    ],
    processingTime: "2–3 working days",
    officeType: "RTO",
    priorityAllowed: true
  },
  {
    serviceName: "RC Transfer",
    serviceCode: "RTO_RC_TRANSFER",
    description: "Transfer ownership of vehicle",
    requiredDocuments: [
      "Original RC",
      "Insurance Copy",
      "Aadhaar Card", 
      "Sale Agreement"
    ],
    processingTime: "3–5 working days",
    officeType: "RTO",
    priorityAllowed: false
  },
  {
    serviceName: "DL Renewal",
    serviceCode: "RTO_DL_RENEWAL",
    description: "Renew expired Driving License",
    requiredDocuments: [
      "Old DL",
      "Aadhaar Card",
      "Medical Certificate",
      "Passport Size Photograph"
    ],
    processingTime: "1–2 working days",
    officeType: "RTO",
    priorityAllowed: true
  },
  {
    serviceName: "Vehicle Fitness Certificate",
    serviceCode: "RTO_FITNESS",
    description: "Commercial vehicle fitness certificate renewal",
    requiredDocuments: [
      "RC Book",
      "Insurance",
      "Pollution Certificate",
      "Chassis/Engine No Declaration"
    ],
    processingTime: "Same day",
    officeType: "RTO",
    priorityAllowed: false
  },

  // 🏠 VAO SERVICES 
  {
    serviceName: "Patta Transfer",
    serviceCode: "VAO_PATTA_TRANSFER",
    description: "Transfer land patta ownership",
    requiredDocuments: [
      "Old Patta",
      "Sale Deed",
      "Encumbrance Certificate",
      "Aadhaar Card"
    ],
    processingTime: "7–15 working days",
    officeType: "VAO",
    priorityAllowed: false
  },
  {
    serviceName: "Chitta Extract",
    serviceCode: "VAO_CHITTA",
    description: "Get land revenue records (Chitta Adangal)",
    requiredDocuments: [
      "Patta Number",
      "Survey Number",
      "Aadhaar Card"
    ],
    processingTime: "Same day",
    officeType: "VAO",
    priorityAllowed: true
  },
  {
    serviceName: "Income Certificate",
    serviceCode: "VAO_INCOME_CERT",
    description: "Income certificate for government schemes",
    requiredDocuments: [
      "Ration Card",
      "Aadhaar Card",
      "Bank Passbook",
      "Affidavit"
    ],
    processingTime: "3–5 working days",
    officeType: "VAO",
    priorityAllowed: true
  },
  {
    serviceName: "Community Certificate",
    serviceCode: "VAO_COMMUNITY_CERT",
    description: "Community certificate for reservations",
    requiredDocuments: [
      "Father's Community Certificate",
      "SSLC Marksheet",
      "Aadhaar Card"
    ],
    processingTime: "5–7 working days",
    officeType: "VAO",
    priorityAllowed: false
  },
  {
    serviceName: "Nativity Certificate",
    serviceCode: "VAO_NATIVITY_CERT",
    description: "Proof of Tamil Nadu nativity",
    requiredDocuments: [
      "SSLC Marksheet",
      "Ration Card",
      "Aadhaar Card"
    ],
    processingTime: "3 working days",
    officeType: "VAO",
    priorityAllowed: true
  },

  // 💰 REVENUE SERVICES
  {
    serviceName: "Property Tax Payment",
    serviceCode: "REVENUE_PT",
    description: "Pay property tax receipt",
    requiredDocuments: [
      "Property Tax Assessment",
      "Patta"
    ],
    processingTime: "Instant",
    officeType: "Revenue",
    priorityAllowed: false
  },
  {
    serviceName: "Land Conversion Certificate",
    serviceCode: "REVENUE_LAND_CONVERSION",
    description: "Convert agricultural to non-agricultural land",
    requiredDocuments: [
      "Patta",
      "Survey Sketch",
      "Zoning Certificate"
    ],
    processingTime: "15–30 working days",
    officeType: "Revenue",
    priorityAllowed: false
  }
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB");
    
    await Service.deleteMany({});
    console.log("🗑️  Cleared existing services");
    
    const result = await Service.insertMany(services);
    console.log(`✅ ${result.length} services seeded successfully`);
    
    console.log("📋 Services by office type:");
    console.log(services.reduce((acc, s) => {
      acc[s.officeType] = (acc[s.officeType] || 0) + 1;
      return acc;
    }, {}));
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedServices();
