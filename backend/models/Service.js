const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true
    },

    serviceCode: {
      type: String,
      required: true,
      unique: true
    },

    description: {
      type: String,
      required: true
    },

    requiredDocuments: [
      {
        type: String,
        required: true
      }
    ],

    processingTime: {
      type: String,
      default: "As per department rules"
    },

    officeType: {
      type: String,
      enum: ["RTO", "VAO", "Revenue", "Municipality"],
      required: true
    },

    priorityAllowed: {
      type: Boolean,
      default: false
    },

    priorityNote: {
      type: String,
      default:
        "Priority will be verified physically at the office. If not eligible, token will be moved to general queue."
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
