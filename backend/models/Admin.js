const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },      // officer login (email)

  password: {
    type: String,
    required: true
  },      // hashed password

  // ⭐ NEW — Role for future system hierarchy
  role: {
    type: String,
    enum: ["officer", "superadmin"],
    default: "officer"
  },

  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office"
  },

  // ⭐ Counter number for this officer
  counterNumber: {
    type: Number,
    required: true
  }
});

// ✅ Correct collection name (no spaces)
module.exports = mongoose.model("Admin", AdminSchema, "admins");