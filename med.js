const mongoose = require("mongoose");

const MedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timeToTake: { type: String, required: true }, // e.g. "08:00 AM"
  frequency: { type: String, required: true }, // e.g. "Daily", "2x/day"
  taken: { type: Boolean, default: false },
  lastSkippedAt: { type: Date },
  skipReason: { type: String },
  notes: { type: String }
});

module.exports = mongoose.model("Med", MedSchema)
