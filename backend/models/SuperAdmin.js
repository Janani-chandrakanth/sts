const mongoose = require("mongoose");

const SuperAdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "superadmin"
  }
});

module.exports = mongoose.model("SuperAdmin", SuperAdminSchema);