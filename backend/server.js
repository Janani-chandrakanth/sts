const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

/* ROUTES */
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const officeRoutes = require("./routes/officeRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

// GLOBAL REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* =========================
   DEBUG LOGS (SAFE)
========================= */

console.log("authRoutes:", typeof authRoutes);
console.log("appointmentRoutes:", typeof appointmentRoutes);
console.log("officeRoutes:", typeof officeRoutes);
console.log("superAdminRoutes:", typeof superAdminRoutes);

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/offices", officeRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/superadmin", superAdminRoutes);

/* =========================
   HEALTH CHECK (NEW SAFE ROUTE)
   Does NOT affect existing APIs
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Queue Management API running (ANTIGRAVITY_V2)",
    serverTime: new Date()
  });
});

/* =========================
   DATABASE CONNECTION
========================= */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected...");
    console.log("Connected DB:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });