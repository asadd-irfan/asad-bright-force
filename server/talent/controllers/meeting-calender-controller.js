
const catchAsync = require('../../utils/catch-async.js');
const AppError = require('../../utils/app-error-handler');
const Talent = require('../models/talent-model');
const MeetingCalender = require('../../admin/models/meeting-calender');
const ScheduleCalender = require('../../admin/models/schedule-calender');
const ProfessionalTester = require('../../admin/models/professional-tester');
const TalentManager = require('../../admin/models/talent-manager');

async function getEvaluationByTalentId(talentId, next) {
  let result = await Evaluation.findOne({ talent: talentId });
  if (!result) {
    return next(new AppError("No Evaluation Details Found .", 404));
  } else {
    return result;
  }
}

exports.getCalendersData = catchAsync(async (req, res, next) => {
  let queryObj = {}
  let dateQuery = {}
  if (req.query.startDate) {
    dateQuery.$gte = req.query.startDate
    queryObj['startTime'] = dateQuery
  }
  if (req.query.endDate) {
    dateQuery.$lte = req.query.endDate + 'T23:59:00'
    queryObj['startTime'] = dateQuery
  }
  if (req.query.meetingType) {
    queryObj['meetingType'] = req.query.meetingType
  }
  // console.log('::queryObj:: ', queryObj)

  if (req.query.meetingType == 'talent-manager-meeting') {
    let allTalentManagers = await TalentManager.find().select('name');

    let finalResults = [];
    for (let i = 0; i < allTalentManagers.length; i++) {
      let formattedResult = {};
      let talentManagerSchedule = await ScheduleCalender.find({
        type: 'manager',
        userId: allTalentManagers[i]._id
      });

      formattedResult.talentManager = allTalentManagers[i]
      formattedResult.schedule = talentManagerSchedule

      finalResults.push(formattedResult);
    }

    await MeetingCalender.find(queryObj).select('talentManagerId startTime endTime').then(result => {
      let formattedResponse = {};
      result.map(element => {
        if (formattedResponse[element.talentManagerId]) {
          formattedResponse[element.talentManagerId].push(element)
        } else {
          formattedResponse[element.talentManagerId] = [element]
        }
      });
      res.status(200).json({
        status: 'success',
        length: result.length,
        // result: { calendersData: formattedResponse, talentManagers: allTalentManagers }
        result: { calendersData: formattedResponse, talentManagersSchedule: finalResults }
      });

    });

  }
  if (req.query.meetingType == 'professional-interview') {
    let allInterviewers = await ProfessionalTester.find().select('name');

    let finalResults = [];
    for (let i = 0; i < allInterviewers.length; i++) {
      let formattedResult = {};
      let interviewerSchedule = await ScheduleCalender.find({
        type: 'tester',
        userId: allInterviewers[i]._id
      });

      formattedResult.professionalInterviewer = allInterviewers[i]
      formattedResult.schedule = interviewerSchedule

      finalResults.push(formattedResult);
    }

    await MeetingCalender.find(queryObj).select('professionalInterviewerId startTime endTime').then(result => {
      let formattedResponse = {};
      result.map(element => {
        if (formattedResponse[element.professionalInterviewerId]) {
          formattedResponse[element.professionalInterviewerId].push(element)
        } else {
          formattedResponse[element.professionalInterviewerId] = [element]
        }
      });
      res.status(200).json({
        status: 'success',
        length: result.length,
        result: { calendersData: formattedResponse, professionalInterviewersSchedule: finalResults }
      });

    });

  }
  else {
    return next(new AppError('Incorrect meeting type', 404));
  }
});


async function scheduleProfessionalInterview(talent, req, res, next) {

  if (talent.professionalInterview && talent.professionalInterview.dateTime) {
    return next(new AppError('Your interview is already scheduled with our Professional Interviewer.', 400));
  } else {
    let allInterviewers = await ProfessionalTester.find();
    if (allInterviewers.length == 0) {
      return next(new AppError('No Professional Interviewer Exists', 404));
    }
    let queryObject = {}
    queryObject['type'] = 'tester';
    if (req.body.startTime) {
      queryObject['startDateTime'] = { $lte: req.body.startTime, $lt: req.body.endTime }
    }
    if (req.body.endTime) {
      queryObject['endDateTime'] = { $gt: req.body.startTime, $gte: req.body.endTime }
    }

    let scheduleCalenderResults = await ScheduleCalender.find(queryObject);
    console.log('== ScheduleCalenderResults ==', scheduleCalenderResults);

    if (scheduleCalenderResults.length == 0) {
      return next(new AppError('There is no Professional Interviewer available for Interview at this time slot.', 400));
    } else {
      let count = 0;
      for (let i = 0; i < scheduleCalenderResults.length; i++) {
        // console.log(scheduleCalenderResults[i].talentManagerId);
        let result = await MeetingCalender.findOne({
          talentManagerId: scheduleCalenderResults[i].userId,
          startTime: req.body.startTime,
          // endTime: req.body.endTime
        })
        if (!result) {
          await MeetingCalender.create({
            professionalInterviewerId: scheduleCalenderResults[i].userId,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            talentId: req.user.id,
            meetingType: 'professional-interview'
          });
          break;
        } else {
          count++
        }
        if (count == scheduleCalenderResults.length) {
          return next(new AppError('No Professional Interviewer is available for Interview at this time slot', 404));
        }
      }

      await Talent.findByIdAndUpdate(req.user.id, {
        "professionalInterview.dateTime": req.body.startTime,
        "currentStatus": 'professional-interview-pending'
      });

      res.status(200).json({
        status: 'success',
        message: "Professional Interview scheduled Successfully!"
      });
    }
  }
}

exports.scheduleTmMeeting = catchAsync(async (req, res, next) => {
  let evaluation = await getEvaluationByTalentId(req.user.id, next);
  if (evaluation.codingChallenge.isCompleted == true && evaluation.codingChallenge.result == 'pass') {

    let talent = await Talent.findById(req.user.id);

    if (talent.talentManagerMeeting && talent.talentManagerMeeting.dateTime) {
      return next(new AppError('Your Meeting with our Talent Manager is already scheduled.', 400));
    } else {

      let allTalentManagers = await TalentManager.find()
      if (allTalentManagers.length == 0) {
        return next(new AppError('No Talent Manager Exists', 404));
      }
      let queryObject = {}
      queryObject['type'] = 'manager';
      if (req.body.startTime) {
        queryObject['startDateTime'] = { $lte: req.body.startTime, $lt: req.body.endTime }
      }
      if (req.body.endTime) {
        queryObject['endDateTime'] = { $gt: req.body.startTime, $gte: req.body.endTime }
      }

      let scheduleCalenderResults = await ScheduleCalender.find(queryObject);
      console.log('== ScheduleCalenderResults ==', scheduleCalenderResults);

      if (scheduleCalenderResults.length == 0) {
        return next(new AppError('There is no Talent Manager available for Meeting at this time slot.', 400));
      } else {
        let count = 0;
        for (let i = 0; i < scheduleCalenderResults.length; i++) {
          // console.log(scheduleCalenderResults[i].talentManagerId);
          let result = await MeetingCalender.findOne({
            talentManagerId: scheduleCalenderResults[i].userId,
            startTime: req.body.startTime,
            // endTime: req.body.endTime
          })
          if (!result) {
            await MeetingCalender.create({
              talentManagerId: scheduleCalenderResults[i].userId,
              startTime: req.body.startTime,
              endTime: req.body.endTime,
              talentId: req.user.id,
              meetingType: 'talent-manager-meeting'
            });
            break;
          } else {
            count++
          }
          if (count == scheduleCalenderResults.length) {
            return next(new AppError('No Talent Manager is available for Meeting at this time slot', 404));
          }
        }

        await Talent.findByIdAndUpdate(req.user.id, {
          "talentManagerMeeting.dateTime": req.body.startTime,
          "currentStatus": 'talent-manager-meeting-pending'
        });

        res.status(200).json({
          status: 'success',
          message: "Talent Manager Meeting scheduled Successfully!"
        });
      }
    }
  } else if (evaluation.codingChallenge.result == 'fail') {
    return next(new AppError("Your coding challenge result is 'Fail'. You can not schedule your meeting with Talent Manager.", 400));
  } else {
    return next(new AppError("You can not schedule your meeting with Talent Manager. Please complete your coding challenge first. ", 400));
  }

});


exports.scheduleProfessionalInterview = catchAsync(async (req, res, next) => {
  let evaluation = await getEvaluationByTalentId(req.user.id, next);
  if (evaluation.talentManagerMeeting.isCompleted == true && evaluation.talentManagerMeeting.result == 'pass') {

    let talent = await Talent.findById(req.user.id);

    if (talent.role == 'candidate') {
      if (talent.jobSearchStatus && talent.jobSearchStatus == "actively-looking") {
        scheduleProfessionalInterview(evaluation, req, res)
      } else {
        return next(new AppError("Please change your Job Search Status to 'Actively Looking' from your profile.", 400));
      }
    }
    if (talent.role == 'freelancer') {
      if (talent.freelancerProfile && talent.freelancerProfile.availableForNewContracts == true) {
        scheduleProfessionalInterview(evaluation, req, res)
      } else {
        return next(new AppError("Please change your Availability Status to 'Available' from your profile.", 400));
      }
    }

  } else if (evaluation.talentManagerMeeting.result == 'fail') {
    return next(new AppError("Your Talent Manager Meeting result is 'Fail'. You can not schedule your Professional Interview.", 400));
  } else {
    return next(new AppError("You can not schedule your Professional Interview. Please complete your meeting with our Talent Manager first. ", 400));
  }

});

