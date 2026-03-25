const mongoose = require("mongoose");
const Office = require("../models/Office");
const rawOffices = require("./offices.json");
require("dotenv").config();

const offices = rawOffices.map(o => ({
  officeName: o.officeName,
  officeType: o.officeType,
  pincode: o.pincode,
  city: o.city,
  location: {
    type: "Point",
    coordinates: [o.location.lng, o.location.lat]
  }
}));

async function seedOffices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Office.deleteMany({});
    console.log("Old offices removed");

    await Office.insertMany(offices);
    console.log("Offices inserted successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedOffices();