import mongoose from "mongoose";

const MedSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  dosageAmount: { type: Number },
  dosageUnit: { type: String, enum: ["mg", "ml", "pill"] },
  timeToTake: { type: String, required: true },
  frequency: { type: String, required: true },
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

export default mongoose.models.Med || mongoose.model("Med", MedSchema);
