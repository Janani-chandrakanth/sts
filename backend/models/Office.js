const mongoose = require("mongoose");

const OfficeSchema = new mongoose.Schema(
  {
    officeName: {
      type: String,
      required: true
    },

    officeType: {
      type: String,
      enum: ["RTO", "VAO", "Revenue"],
      required: true
    },

    pincode: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      }
    },

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
      }
    ],

    totalCounters: {
      type: Number,
      default: 1
    },

    workingHours: {
      start: {
        type: String,
        default: "10:00"
      },
      end: {
        type: String,
        default: "17:00"
      }
    },

    breaks: {
      type: [String],   // "13:00-14:00"
      default: []
    },

    maxTokensPerDay: {
      type: Number,
      default: 50
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

OfficeSchema.index({ location: "2dsphere" });

const Office = mongoose.model("Office", OfficeSchema);
Office.init();

module.exports = Office;