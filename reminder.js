const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medId: { type: mongoose.Schema.Types.ObjectId, ref: "Med" },
  message: { type: String, required: true },
  dueAt: { type: Date, required: true },
  status: { type: String, enum: ["pending", "due", "dismissed", "sent"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Reminder", ReminderSchema);
