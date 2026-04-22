require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const admins = await Admin.find().limit(5);
  console.log("--- VALID CREDENTIALS ---");
  admins.forEach(a => {
    console.log(`Username: ${a.username} | Password: (Look at seed logic, likely admin123)`);
  });
  process.exit();
}
check();
