import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
