const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(

  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String }, //add other people ypes
    notes: { type: String }
  },
  { timestamps: true }
);
module.exports = mongoose.model('Profile', ProfileSchema);