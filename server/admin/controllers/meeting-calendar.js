
const catchAsync = require('../../utils/catch-async.js');
const AppError = require('../../utils/app-error-handler');
const MeetingCalender = require('./../models/meeting-calender');

// const Talent = require('../../talent/models/talent-model');
// const ScheduleCalender = require('./../models/schedule-calender');
// const ProfessionalTester = require('./../models/professional-tester');
// const TalentManager = require('./../models/talent-manager');

exports.getMeetingDetailsByTalentId = catchAsync(async (req, res, next) => {
  let result = await MeetingCalender.findOne({
    talentId: req.params.id,
    meetingType: 'talent-manager-meeting'
  })
  
  if (!result) {
    return next(new AppError("No record found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    result: result
  });
  
});


exports.getInterviewDetailsByTalentId = catchAsync(async (req, res, next) => {
  let result = await MeetingCalender.findOne({
    talentId: req.params.id,
    meetingType: 'professional-interview'
  })
  
  if (!result) {
    return next(new AppError("No record found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    result: result
  });
  
});