const mongoose = require('mongoose');

const TalentManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  role: { type: String, default: 'talent-manager' },
  yearOfExperience: String,
  // dutyStartTime: Date,
  // dutyEndTime: Date,

},
  {
    timestamps: true
  });

module.exports = TalentManager = mongoose.model('talent-manager', TalentManagerSchema);
