require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");
const Office = require("../models/Office");

async function seedAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Admin.deleteMany({});
    console.log("Old admins removed");

    const offices = await Office.find();

    const admins = [];

    for (const office of offices) {
      const counters = Math.floor(Math.random() * 3) + 2; 
      // creates 2–4 counters

      for (let i = 1; i <= counters; i++) {
        const username =
          `${office.officeType.toLowerCase()}_${office.city.toLowerCase()}_${i}@tn.gov.in`;

        const hashed = await bcrypt.hash("admin123", 10);

        admins.push({
          username,
          password: hashed,
          office: office._id,
          counterNumber: i
        });
      }
    }

    await Admin.insertMany(admins);

    console.log("Admins created:", admins.length);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmins();