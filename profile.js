const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(

  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String }, //add other people ypes
    notes: { type: String }
  },
  { timestamps: true }
);
module.exports = mongoose.model('Profile', ProfileSchema);
