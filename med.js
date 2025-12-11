const mongoose = require("mongoose");

const MedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  dosageAmount: { type: Number },
  dosageUnit: { type: String, enum: ["mg", "ml", "pill"] },
  timeToTake: { type: String, required: true }, // e.g. "08:00 AM"
  frequency: { type: String, required: true }, // e.g. "Daily", "2x/day"
  taken: { type: Boolean, default: false },
  lastTakenAt: { type: Date },
  lastSkippedAt: { type: Date },
  skipReason: { type: String },
  notes: { type: String },
  quantity: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 0 },
  takenCount: { type: Number, default: 0 },
  skippedCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Med", MedSchema)
