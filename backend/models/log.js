const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, index: true }, // Link to Clerk User
    transcript: { type: String },
    moodDetected: { type: String },
    protocol: [
      {
        category: {
          type: String,
          enum: ["PHYSIOLOGY", "ENVIRONMENT", "MOMENTUM"],
        },
        action: { type: String },
        isCompleted: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
