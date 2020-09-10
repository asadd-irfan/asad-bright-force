const mongoose = require('mongoose');

const ScheduleCalenderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId
  },
  type: {
    type: String,
    enum: ['manager', 'tester', 'company', 'talent']
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
},
  {
    timestamps: true
  });
module.exports = ScheduleCalender = mongoose.model('schedule-calender', ScheduleCalenderSchema);

