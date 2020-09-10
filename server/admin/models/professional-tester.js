const mongoose = require('mongoose');

const ProfessionalInterviewerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  role: { type: String, default: 'professional-interviewer' },
  skills: [{
    name: String,
    yearOfExperience: String,
  }],
  // dutyStartTime: Date,
  // dutyEndTime: Date,

},
  {
    timestamps: true
  });

module.exports = Admin = mongoose.model('professional-interviewer', ProfessionalInterviewerSchema);
