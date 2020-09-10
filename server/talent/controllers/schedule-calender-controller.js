const catchAsync = require("../../utils/catch-async.js");
const AppError = require("../../utils/app-error-handler");
const ScheduleCalender = require("../../admin/models/schedule-calender");
const MeetingCalender = require("../../admin/models/meeting-calender");
// const Talent = require('../models/talent-model');
// const ProfessionalTester = require('../../admin/models/professional-tester');
// const TalentManager = require('../../admin/models/talent-manager');

// exports.createScheduleCalender = catchAsync(async (req, res, next) => {
//   var date = new Date;
//   let startDateTime = new Date(req.body.startDateTime)
//   let endDateTime = new Date(req.body.endDateTime)
//   if (!req.body.startDateTime) {
//     return next(new AppError('Start Date is required', 400));
//   }
//   if (startDateTime < date) {
//     return next(new AppError('You can not enter Start Date before Today', 400));
//   }
//   if (!req.body.endDateTime) {
//     return next(new AppError('End Date is required', 400));
//   }
//   if (endDateTime < date) {
//     return next(new AppError('You can not enter End Date before Today', 400));
//   }
//   if (req.body.startDateTime > req.body.endDateTime) {
//     return next(new AppError('Start Date must be smaller than End Date', 400));
//   }
//   let result = await ScheduleCalender.create(req.body);
//   if (result.length == 0) {
//     return next(new AppError('No Schedule Found of this manager', 404));
//   } else {
//     res.status(201).json({
//       status: 'success',
//       result: result,
//       message: "Schedule created Successfully!"
//     })
//   }

// });

exports.createScheduleCalenderByType = catchAsync(async (req, res, next) => {
  let body = req.body;
  for (let i = 0; i < body.length; i++) {
    // await ScheduleCalender.create(req.body[i]);
    await ScheduleCalender.create({
      userId: req.query.id,
      type: req.query.type,
      startDateTime: body[i].startDateTime,
      endDateTime: body[i].endDateTime,
    });
  }

  res.status(201).json({
    status: "success",
    message: "Schedule's created Successfully!",
  });
});

exports.getScheduleCalenderByType = catchAsync(async (req, res, next) => {
  let schedule = await ScheduleCalender.find({
    type: req.query.type,
    userId: req.query.id,
  });
  if (schedule.length == 0) {
    return next(new AppError("No Schedule Found.", 404));
  }
  res.status(200).json({
    status: "success",
    result: schedule,
  });
});

exports.createTalentScheduleCalender = catchAsync(async (req, res, next) => {
  let body = req.body;
  for (let i = 0; i < body.length; i++) {
    await ScheduleCalender.create({
      userId: req.user.id,
      type: "talent",
      startDateTime: body[i].startDateTime,
      endDateTime: body[i].endDateTime,
    });
  }

  res.status(201).json({
    status: "success",
    message: "Schedule's created Successfully!",
  });
});

exports.getTalentScheduleCalender = catchAsync(async (req, res, next) => {
  let schedule = await ScheduleCalender.find({
    type: "talent",
    userId: req.user.id,
  });
  let meetings = await MeetingCalender.find({ talentId: req.user.id });
  if (schedule.length == 0 && meetings.length == 0) {
    return next(new AppError("No result Found.", 404));
  }
  res.status(200).json({
    status: "success",
    result: { availabilityCalender: schedule, meetingCalender: meetings },
  });
});

exports.editTalentScheduleCalender = catchAsync(async (req, res, next) => {
  let result = await ScheduleCalender.findById(req.params.id);
  if (!result) {
    return next(new AppError("No record found with that ID", 404));
  }
  if (result.userId != req.user.id) {
    return next(new AppError("You can not edit this record .", 404));
  } else {
    let schedule = await ScheduleCalender.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      result: schedule,
      message: "Record updated Successfully!",
    });
  }
});

exports.deleteTalentScheduleCalender = catchAsync(async (req, res, next) => {
  let result = await ScheduleCalender.findById(req.params.id);
  if (!result) {
    return next(new AppError("No record found with that ID", 404));
  }
  if (result.userId != req.user.id) {
    return next(new AppError("You can not delete this record .", 404));
  } else {
    await ScheduleCalender.findByIdAndDelete(req.params.id);
    res.status(202).json({
      status: "success",
      message: "Record deleted Successfully!",
    });
  }
});

exports.mergeTalentEvents = catchAsync(async (req, res, next) => {
  let firstEvent = await ScheduleCalender.findById(req.body.firstEventId);
  let secondEvent = await ScheduleCalender.findById(req.body.secondEventId);
  if (!firstEvent || !secondEvent) {
    return next(new AppError("No record found with that ID", 404));
  }
  let eventStartDateTime, eventEndDateTime;

  if (firstEvent.userId != req.user.id && secondEvent.userId != req.user.id) {
    return next(new AppError("You can not edit this record .", 404));
  } else {
    if (firstEvent.startDateTime <= secondEvent.startDateTime) {
      eventStartDateTime = firstEvent.startDateTime;
    } else {
      eventStartDateTime = secondEvent.startDateTime;
    }
    if (firstEvent.endDateTime >= secondEvent.endDateTime) {
      eventEndDateTime = firstEvent.endDateTime;
    } else {
      eventEndDateTime = secondEvent.endDateTime;
    }
    await ScheduleCalender.findByIdAndDelete(req.body.firstEventId);
    await ScheduleCalender.findByIdAndDelete(req.body.secondEventId);

    let meeting = await ScheduleCalender.create({
      userId: req.user.id,
      type: "talent",
      startDateTime: eventStartDateTime,
      endDateTime: eventEndDateTime,
    });

    res.status(200).json({
      status: "success",
      result: meeting,
      message: "Events Merge Successfully!",
    });
  }
});
