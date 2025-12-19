import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  medication: { type: mongoose.Schema.Types.ObjectId, ref: "Med" },
  notes: { type: String },
  user: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
