const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    office: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      required: true
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    timeSlot: {
      type: String,
      required: true
    },

    priorityCategory: {
      type: String,
      enum: ["general", "senior", "disabled", "emergency"],
      default: "general"
    },

    priorityScore: {
      type: Number,
      default: 4
    },

    counterNumber: {
      type: Number,
      required: true,
      min: 1
    },

    tokenNumber: {
      type: Number,
      required: true
    },

    queuePosition: {
      type: Number
    },

    status: {
      type: String,
      enum: ["pending", "called", "completed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

appointmentSchema.index({ office: 1, date: 1, status: 1 });
appointmentSchema.index({ user: 1, date: 1 });
appointmentSchema.index({ office: 1, date: 1, timeSlot: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);