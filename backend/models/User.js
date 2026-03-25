const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  priorityCategory: {
    type: String,
    enum: ["general", "senior", "disabled", "emergency"],
    default: "general"
  },
  role: {
    type: String,
    enum: ["citizen", "officer", "admin"],
    default: "citizen"
  },
  pincode: String
});

module.exports = mongoose.model("User", UserSchema);
