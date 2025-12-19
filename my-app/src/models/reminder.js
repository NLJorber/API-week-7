import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  medId: { type: mongoose.Schema.Types.ObjectId, ref: "Med" },
  message: { type: String, required: true },
  dueAt: { type: Date, required: true },
  status: { type: String, enum: ["pending", "due", "dismissed", "sent"], default: "pending" }
}, { timestamps: true });

export default mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);
