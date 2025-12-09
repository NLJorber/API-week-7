const mongoose = require("mongoose");

const MedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timeToTake: { type: String, required: true }, // e.g. "08:00 AM"
  frequency: { type: String, required: true }, // e.g. "Daily", "2x/day"
  taken: { type: Boolean, default: false },
  notes: { type: String }
});

module.exports = mongoose.model("Med", MedSchema)