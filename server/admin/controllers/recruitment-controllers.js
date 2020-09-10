const catchAsync = require('../../utils/catch-async');
const AppError = require('../../utils/app-error-handler');
const Positions = require('../../company/models/positions');
const Talent = require('../../talent/models/talent-model');
const APIFeatures = require('../../utils/api-features');
const PositionCandidate = require('../models/position-candidates');
const PositionOffer = require('../../company/models/position-offer');
const CompanyUser = require('../../company/models/company-user');
const moment = require('moment');
const MeetingCalender = require('../models/meeting-calender');
// const Notifications = require('../models/notification-messages');
const NotificationSubscribers = require('../models/notification-subscribers');
const ScheduleCalender = require('../models/schedule-calender');
const AppConfigs = require('../models/app-config-model');
const talentFiltration = require('../../talent-filtration/talent-filtration-script')
const notifications = require('../../common/notifications');


exports.getAllCompanyPositions = catchAsync(async (req, res, next) => {
  // console.log('req.query',req.query)
  let filter = {
    sentToAccountManager: true, isDeleted: false
  };
  if (req.query.unAssignManager) {
    // filter = { assignedAccountManager: {$exists: false} }
    filter['assignedAccountManager'] = { $exists: false }
    delete req.query.unAssignManager;
  }
  if (req.query.roles && req.query.roles != "") {
    // filter = { 'role.name': req.query.roles }
    filter['role.name'] = req.query.roles
    delete req.query.roles;
  }
  if (req.query.title && req.query.title != "") {
    filter["title"] = { $regex: req.query.title, $options: 'i' };
    delete req.query.title;
  }
  // let positions = await Positions.find({ companyId: req.params.companyId });
  const features = new APIFeatures(Positions.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const result = await features.query;

  if (result.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No Result Found!'
    });
  } else {
    res.status(200).json({
      status: 'success',
      length: result.length,
      result: result
    });
  }
});

exports.getCompanyAllPositions = catchAsync(async (req, res, next) => {
  let positions = await Positions.find({ companyId: req.params.id });

  if (positions.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No Position Found!'
    });
  } else {
    res.status(200).json({
      status: 'success',
      length: positions.length,
      result: positions
    });

  }
});

exports.closeCompanyPosition = catchAsync(async (req, res, next) => {
  let pos = await Positions.findById(req.params.id);
  if (!pos) {
    return next(new AppError('No position record found with that id', 404));
  }
  if (pos.status == 'Open') {
    if (pos && pos.isDeleted == false) {

      let positions = await Positions.findByIdAndUpdate(req.params.id, {
        "status": 'Closed - Other',
        "lastGroupStatus": null,
        "closingReason": {
          closedBy: req.user.id,
          reason: req.body.reason
        }
      }, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        status: 'success',
        message: `Company position status changes to 'closed'.`
      });
    } else {
      return next(new AppError('This Position is deleted.', 400));
    }
  } else {
    return next(new AppError('Position already closed', 400));
  }
});


exports.filterTalentsList = catchAsync(async (req, res, next) => {


  let finalResponse = await talentFiltration.filterTalents(req.body, req.params.id, next)

  if (finalResponse.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No Result Found!',
      result: []
    });
  } else {
    res.status(200).json({
      status: 'success',
      length: finalResponse.length,
      result: finalResponse
    });
  }

});

exports.updateGroupConfigs = catchAsync(async (req, res, next) => {

  let position = await Positions.findByIdAndUpdate(req.params.id, {
    "groupConfigs": req.body.groupConfigs
  }, { new: true });

  if (!position) {
    return next(new AppError('No position record found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Position group Configurations updated successfully!',
  });

});

exports.moveFilteredTalentsToProcessed = catchAsync(async (req, res, next) => {
  let talents = req.body.talents;
  let totalTalents = talents.length;
  if (totalTalents == 0) {
    return next(new AppError('Please Select Candidates for shortlist', 400));
  }
  let position = await Positions.findById(req.params.id);

  if (position && position.isDeleted == false) {
    if (position.groupConfigs.candidatesPerGroup >= talents.length) {
      for (let i = 0; i < totalTalents; i++) {
        let positionCandidate = await PositionCandidate.findOne({
          'position': req.params.id,
          'candidateId': talents[i].id
        })
        if (positionCandidate) {

          return next(new AppError('Candidate already present in recruitment shortlist.', 400));
        }
      }
      let totalProcessedCandidates = [];
      talents.map(element => {
        totalProcessedCandidates.push({
          "candidateId": element.id, "position": req.params.id,
          "status": 'processed', "matchingScore": element.score,
        })
      });

      let insertedProcessedCandidates = await PositionCandidate.insertMany(totalProcessedCandidates);
      let date = new Date()

      let updatedPositionStatus = await Positions.findByIdAndUpdate(req.params.id, {
        "lastGroupStatus": 'processed',
        "lastProcessedDate": date,
      }, { new: true });


      res.status(200).json({
        status: 'success',
        message: "Talent List Processed Successfully "
      });

    } else {
      return next(new AppError('Can not move talents greater than Minimum Talents per Group to recruitment shortlist.', 404));
    }
  } else {
    return next(new AppError('This Position is deleted.', 400));
  }

});


exports.dispatchListToCompany = catchAsync(async (req, res, next) => {
  let talents = req.body.talents;
  let totalDispatchCandidates = talents.length;
  if (totalDispatchCandidates == 0) {
    return next(new AppError('No candidates found for dispatch.', 404));
  }
  let date = new Date()
  let todayDate = new Date();
  let nextDispatchDate = new Date(date.setDate(new Date().getDate() + 3))

  let result;
  let groupId;
  let position = await Positions.findById(req.params.id);
  if (!position) {
    return next(new AppError('No Position Found.', 404));
  }
  if (position && position.isDeleted == false) {

    let totalDispatchedGroups = position.totalDispatchedGroups;

    if (position.groupConfigs.totalGroups > totalDispatchedGroups) {
      if (position.groupConfigs.totalGroups == totalDispatchedGroups + 1) {
        result = await Positions.findByIdAndUpdate({ _id: req.params.id },
          {
            "lastGroupStatus": 'fulfilled',
            "nextDispatchedDate": nextDispatchDate,
            "totalDispatchedGroups": totalDispatchedGroups + 1,
            $push: {
              groupsInfo: {
                dispatchDate: todayDate,
                totalDispatchCandidates: totalDispatchCandidates
              }
            }
          },
          { new: true });
        // console.log(result.groupsInfo)
        groupId = result.groupsInfo[result.groupsInfo.length - 1]._id
      } else {
        result = await Positions.findByIdAndUpdate({ _id: req.params.id },
          {
            "lastGroupStatus": 'un-processed',
            "nextDispatchedDate": nextDispatchDate,
            "totalDispatchedGroups": totalDispatchedGroups + 1,
            $push: {
              groupsInfo: {
                dispatchDate: todayDate,
                totalDispatchCandidates: totalDispatchCandidates
              }
            }
          },
          { new: true });
        // console.log(result.groupsInfo)
        groupId = result.groupsInfo[result.groupsInfo.length - 1]._id
      }

      let processedCandidates = await PositionCandidate.find(
        { "position": position._id, "status": 'processed' }
      );
      // console.log('processedCandidates',processedCandidates.length)
      let processedTalents = [];

      if (processedCandidates.length > 0) {
        processedCandidates.map(el => {
          let obj = {
            id: el.candidateId._id,
            score: el.matchingScore
          }
          processedTalents.push(obj)
        });
        // console.log('processedTalents', processedTalents)
        let deletedProcessedCandidates = await PositionCandidate.deleteMany(
          { "position": position._id, "status": 'processed' }
        );

        let dispatchedCandidates = [];
        processedTalents.map(element => {
          dispatchedCandidates.push({
            "groupId": groupId,
            "candidateId": element.id,
            "matchingScore": element.score,
            "position": position._id,
            "status": 'long-list'
          })
        });

        let insertedDispatchedCandidates = await PositionCandidate.insertMany(dispatchedCandidates);

      } else {
        for (let i = 0; i < talents.length; i++) {
          let dispatchCandidate = await PositionCandidate.create({
            "groupId": groupId,
            "candidateId": talents[i].id,
            "matchingScore": talents[i].score,
            "position": position._id,
            "status": 'long-list'
          });
        }
      }

      let notificationMsgObj = {
        referenceLink: "/company/hire/recruitment/details/" + position._id,
        title: "New Batch of Talents is Available",
        description: "A new Batch of Talents is now available.",
        positionId: position._id,
        referenceTitle: "View Candidates List",
      }
      // let users = position.hiringTeam;
      let notificationSubscriberObj = await NotificationSubscribers.findOne({ referenceId: position._id, event: 'hiring-team' });
      if (notificationSubscriberObj) {
        let response = await notifications.sendNotifications(notificationMsgObj, notificationSubscriberObj, null);
        if (response == false) {
          return next(new AppError('ERROR while sending notification', 400));
        }
      } else {
        console.log('ERROR while sending notification')
        // return next(new AppError('ERROR while sending notification', 400));
      }

      res.status(200).json({
        status: 'success',
        message: "Talent List dispatched To Company Successfully!",
      });

    } else {
      return next(new AppError("Can't create more groups.", 400));
    }
  } else {
    return next(new AppError('This Position is deleted.', 400));
  }


});

exports.getPositionCandidateDetails = catchAsync(async (req, res, next) => {

  let recruitment = await PositionCandidate.find({ 'position': req.params.id, 'groupId': req.body.groupId })
  if (recruitment.length == 0) {
    return next(new AppError('No recruitment record found.', 404));
  }
  let date = new Date();

  for (let i = 0; i < recruitment.length; i++) {
    let res = await PositionCandidate.findById(recruitment[i]._id);

    if (res.interviewDate && res.interviewStatus == 'scheduled') {
      if (res.interviewDate < date) {
        let positionCandidate = await PositionCandidate.findByIdAndUpdate(res._id, {
          "interviewStatus": 'time-passed',
        }, { new: true });
      }
    }

  }
  // let longListCandidates = [];
  // let shortListCandidates = [];
  // let interviewedCandidates = [];

  // if (recruitment.candidates.length > 0) {
  //   let candidates = recruitment.candidates;
  //   for (let i = 0; i < candidates.length; i++) {
  //     let talent = await Talent.findById(candidates[i].talentId);
  //     longListCandidates.push(talent);
  //   }

  // }
  // if (recruitment.shortListCandidates.length > 0) {
  //   let candidates = recruitment.shortListCandidates;
  //   for (let i = 0; i < candidates.length; i++) {
  //     let obj = new Object();
  //     obj['talent'] = await Talent.findById(candidates[i].talentId);
  //     obj['recruitment'] = candidates[i];
  //     shortListCandidates.push(obj);
  //   }

  // }
  // if (recruitment.interviewedCandidates.length > 0) {
  //   let candidates = recruitment.interviewedCandidates;
  //   for (let i = 0; i < candidates.length; i++) {
  //     let obj = new Object();
  //     obj['talent'] = await Talent.findById(candidates[i].talentId);
  //     obj['recruitment'] = candidates[i];
  //     interviewedCandidates.push(obj);
  //   }

  // }

  res.status(200).json({
    status: 'success',
    // result: { candidates: longListCandidates, shortListCandidates: shortListCandidates, interviewedCandidates: interviewedCandidates }
    result: recruitment
  });

});

exports.getProcessedCandidateDetails = catchAsync(async (req, res, next) => {

  // let recruitment = await PositionCandidate.find({ 'position': req.params.id, 'status': 'processed' }).lean();
  // if (recruitment.length == 0) {
  //   return next(new AppError('No recruitment record found.', 404));
  // }
  // let processedTalents = [];
  // let allCandidates = recruitment.length;
  // for (let i = 0; i < allCandidates; i++) {
  //   // console.log(recruitment[i].candidateId)
  //   let talent = await Talent.findById(recruitment[i].candidateId).lean();
  //   let obj = Object.assign({}, talent);
  //   obj.score = recruitment[i].matchingScore;
  //   processedTalents.push(obj)

  // }

  let recruitment = await PositionCandidate.find({ 'position': req.params.id, 'status': 'processed' });
  if (recruitment.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No processed candidates found.'
    });
  } else {
    res.status(200).json({
      status: 'success',
      result: recruitment
    });
  }


});

exports.removeProcessedCandidates = catchAsync(async (req, res, next) => {
  let candidates = req.body.candidates;
  let totalCandidates = candidates.length;
  if (totalCandidates == 0) {
    return next(new AppError('Please Select Candidates for removing', 400));
  }
  let count = 0;
  for (let i = 0; i < totalCandidates; i++) {
    let deletedCandidate = await PositionCandidate.findByIdAndDelete(candidates[i]);
    if (!deletedCandidate) {
      return next(new AppError('No candidate found.', 404));
    }
    count++;
  }
  if (count == totalCandidates) {
    let recruitment = await PositionCandidate.find({ 'position': req.params.id, 'status': 'processed' });
    if (recruitment.length == 0) {
      let position = await Positions.findByIdAndUpdate(req.params.id, {
        "lastGroupStatus": 'un-processed',
      }, { new: true });
    }
    res.status(202).json({
      status: 'success',
      message: "Candidates removed Successfully!"
    });
  }

});

exports.removeShortListCandidate = async (req, res, next) => {
  let result = await PositionCandidate.findById(req.params.id);
  if (!result) {
    return next(new AppError('No candidate record found with that ID', 404));
  }

  let deletedRecord = await PositionCandidate.findByIdAndDelete(req.params.id);

  let offer = await PositionOffer.findByIdAndUpdate(result.positionOffer, {
    "status": 'company-rejected'
  }, { new: true });

  if (!offer) {
    return next(new AppError('No position-offer record found with that ID', 404));
  }


  let talent = await Talent.findOneAndUpdate(
    {
      _id: result.candidateId._id
    },
    {
      $pull: {
        companyOffers: {
          offerId: offer._id
        }
      }
    });
  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(202).json({
    status: 'success',
    message: "Talent removed Successfully!"
  });

}

exports.approachCandidateWithOffer = async (req, res, next) => {
  let candidate = await PositionCandidate.findById(req.params.id);
  let offer = await PositionOffer.create({
    salary: req.body.salary,
    currency: req.body.currency,
    equity: req.body.equity,
    performanceBonus: req.body.performanceBonus,
    signingBonus: req.body.signingBonus,
    offerLetter: req.body.offerLetter,
    talentId: candidate.candidateId,
    recruitmentId: candidate._id,
    position: candidate.position,
  })
  let date = new Date()

  let result = await PositionCandidate.findByIdAndUpdate(req.params.id, {
    "status": 'short-list',
    "shortListStatus": 'pending',
    "offerSentDate": date,
    "positionOffer": offer._id,
  }, { new: true });

  if (!result) {
    return next(new AppError('No recruitment record found with that ID', 404));
  }
  let obj = {
    offerId: offer._id
  }
  let talent = await Talent.findByIdAndUpdate(candidate.candidateId,
    {
      $push: {
        companyOffers: obj
        // companyOffers: offer._id
      }
    },
    { new: true });

  if (!talent) {
    return next(new AppError('No talent record found with that ID', 404));
  }

  let notificationMsgObj = {
    referenceLink: "/talent/invites-details/" + offer._id,
    title: "Company Send You a Job Offer",
    description: "Company send you a job offer",
    positionId: candidate.position,
    referenceTitle: "View Job Offer",
  }
  // let users = position.hiringTeam;
  let notificationSubscriberObj = await NotificationSubscribers.findOne({ referenceId: candidate.position, event: 'talent' });
  let receiverId = [];
  receiverId.push(talent._id);
  if (notificationSubscriberObj) {
    let response = await notifications.sendNotifications(notificationMsgObj, notificationSubscriberObj, receiverId);
    if (response == false) {
      return next(new AppError('ERROR while sending notification', 400));
    }
  }

  res.status(200).json({
    status: 'success',
    message: "Position Offer sent to Talent Successfully!"
  });

}

exports.scheduleInterviewWithTalent = catchAsync(async (req, res, next) => {
  let candidate = await PositionCandidate.findById(req.params.id);
  if (!candidate) {
    return next(new AppError('No candidate record found with that ID', 404));
  }
  if (candidate.status == 'short-list' && candidate.shortListStatus == 'accepted') {
    let user = await CompanyUser.findById(req.user.id);
    if (!user) {
      return next(new AppError('No record found with that ID', 404));
    }

    let interview = await MeetingCalender.create({
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      duration: req.body.duration,
      format: req.body.format,
      meetingDetails: req.body.meetingDetails,
      notes: req.body.notes,
      meetingType: 'company-interview',
      companyId: user.company,
      talentId: candidate.candidateId,
      positionId: candidate.position,
      recruitmentId: candidate._id,
      // status: 'scheduled',
    });

    let result = await PositionCandidate.findByIdAndUpdate(req.params.id, {
      "status": 'interview',
      "interviewStatus": 'scheduled',
      "interviewId": interview._id,
      "interviewDetails": interview._id,
      "interviewDate": interview.startTime
    }, { new: true });


    res.status(200).json({
      status: 'success',
      // result: interview,
      message: "Interview scheduled with Talent Successfully!"
    });
  } else {
    return next(new AppError('You can not schedule interview', 404));
  }


});
exports.rescheduleInterviewWithTalent = catchAsync(async (req, res, next) => {
  let candidate = await PositionCandidate.findById(req.params.id);
  if (!candidate) {
    return next(new AppError('No candidate record found with that ID', 404));
  }
  if (candidate.status == 'interview' && candidate.interviewStatus == 'scheduled') {
    let user = await CompanyUser.findById(req.user.id);
    if (!user) {
      return next(new AppError('No record found with that ID', 404));
    }

    let deleteOldInterview = await MeetingCalender.findOneAndDelete({
      meetingType: 'company-interview',
      companyId: user.company,
      talentId: candidate.candidateId,
      positionId: candidate.position,
      recruitmentId: candidate._id,
    })

    let interview = await MeetingCalender.create({
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      duration: req.body.duration,
      format: req.body.format,
      meetingDetails: req.body.meetingDetails,
      notes: req.body.notes,
      meetingType: 'company-interview',
      companyId: user.company,
      talentId: candidate.candidateId,
      positionId: candidate.position,
      recruitmentId: candidate._id,
    });

    let result = await PositionCandidate.findByIdAndUpdate(req.params.id, {
      "status": 'interview',
      "interviewStatus": 'scheduled',
      "interviewId": interview._id,
      "interviewDetails": interview._id,
      "interviewDate": interview.startTime
    }, { new: true });


    res.status(200).json({
      status: 'success',
      // result: interview,
      message: "Interview scheduled with Talent Successfully!"
    });
  } else {
    return next(new AppError('You can not reschedule interview', 400));
  }


});

exports.changeInterviewStatus = catchAsync(async (req, res, next) => {
  let candidate = await PositionCandidate.findById(req.params.id);
  let result;
  let pos = await Positions.findById(candidate.position);
  if (pos && pos.isDeleted == false) {

    if (req.body.status == 'hired' && candidate.interviewStatus == 'pass') {
      let position = await Positions.findByIdAndUpdate(candidate.position, {
        "status": 'Closed - Hired',
        "lastGroupStatus": null,
      }, { new: true });

      result = await PositionCandidate.findByIdAndUpdate(req.params.id, {
        "interviewStatus": req.body.status,
      }, { new: true });


    }
    if ((req.body.status == 'pass' || req.body.status == 'fail') && candidate.interviewStatus != 'hired') {
      result = await PositionCandidate.findByIdAndUpdate(req.params.id, {
        "interviewStatus": req.body.status,
      }, { new: true });
    }

    if (result) {
      res.status(200).json({
        status: 'success',
        // result: result,
        message: "Talent Interview Status updated Successfully!"
      });
    } else {
      return next(new AppError('Some Error Occurred.', 404));
    }
  } else {
    return next(new AppError('This Position is deleted.', 400));
  }


});

exports.resendOfferToCandidate = async (req, res, next) => {
  let candidate = await PositionCandidate.findById(req.params.id);
  if (!candidate) {
    return next(new AppError('No candidate record found with that ID', 404));
  }
  let offer = await PositionOffer.findByIdAndUpdate(candidate.positionOffer, {
    salary: req.body.salary,
    currency: req.body.currency,
    equity: req.body.equity,
    performanceBonus: req.body.performanceBonus,
    signingBonus: req.body.signingBonus,
    offerLetter: req.body.offerLetter,
    status: 'pending',
    candidateMessage: ""
  }, { new: true });

  const result = await PositionCandidate.findByIdAndUpdate(req.params.id, {
    "status": 'short-list',
    "shortListStatus": 'pending',
  }, { new: true });

  if (!result) {
    return next(new AppError('No recruitment record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: "Position Offer resent to Talent Successfully!"
  });

}

exports.getPositionsCount = catchAsync(async (req, res, next) => {

  const openPositionStatus = [
    {
      lastGroupStatus: 'un-processed'
    },
    {
      lastGroupStatus: 'processed'
    },
    {
      lastGroupStatus: 'action-required'
    },
    {
      lastGroupStatus: 'fulfilled'
    }
  ];

  const closePositionStatus = ['Closed - Hired', 'Closed - Other']

  const keys = [
    'allPositions', 'openUnProcessed', 'openProcessed', 'openActionRequired', 'openFulfilled', 'closedHired',
    'closedOthers',
  ]
  let formattedResult = new Object();
  let allPositions = await Positions.find({ sentToAccountManager: true, isDeleted: false });
  formattedResult[keys[0]] = allPositions.length * 1;

  for (let i = 0; i < 4; i++) {
    let positions = await Positions.find({ 'sentToAccountManager': true, isDeleted: false, 'status': "Open", 'lastGroupStatus': openPositionStatus[i].lastGroupStatus });
    formattedResult[keys[i + 1]] = positions.length * 1;
  }
  for (let i = 0; i < 2; i++) {
    let positions = await Positions.find({ 'sentToAccountManager': true, isDeleted: false, 'status': closePositionStatus[i] });
    formattedResult[keys[i + 5]] = positions.length * 1;
  }

  res.status(200).json({
    status: 'success',
    result: formattedResult
  });

});

exports.getAllTalentPositions = catchAsync(async (req, res, next) => {

  let talent = await Talent.findOne({ email: req.body.email });
  if (!talent) {
    return next(new AppError('No talent record found with that email', 404));
  }
  let talentId = talent._id;
  let allTalentPositions = [];
  let result = await PositionCandidate.find({ candidateId: talentId });
  if (result.length == 0) {
    return next(new AppError('No record found.', 404));
  }
  let talentStatus = [];
  for (let i = 0; i < result.length; i++) {
    let res = await Positions.findById(result[i].position);
    if (res && res.isDeleted == false) {
      // allTalentPositions.push(res);
      if (result[i].status == 'long-list') {
        let status = "Recruitment LongList"
        allTalentPositions.push({ position: res, talentStatus: status });
      }
      if (result[i].status == 'short-list') {
        if (result[i].shortListStatus == 'pending') {
          let status = "Company ShortList - Approached"
          allTalentPositions.push({ position: res, talentStatus: status });
        }
        if (result[i].shortListStatus == 'accepted') {
          let status = "Company ShortList - Talent Accepted Offer"
          allTalentPositions.push({ position: res, talentStatus: status });
        }
        if (result[i].shortListStatus == 'rejected') {
          let status = "Company ShortList - Talent Rejected Offer"
          allTalentPositions.push({ position: res, talentStatus: status });
        }
      }
      if (result[i].status == 'interview') {
        if (result[i].interviewStatus == 'scheduled') {
          let status = "Interview List - Interview Scheduled"
          allTalentPositions.push({ position: res, talentStatus: status });
        }
        if (result[i].interviewStatus == 'pass') {
          let status = "Interview List - Interview Passed"
          allTalentPositions.push({ position: res, talentStatus: status });
        }
        if (result[i].interviewStatus == 'fail') {
          let status = "Interview List - Interview Fail"
          allTalentPositions.push({ position: res, talentStatus: status });
        }
        if (result[i].interviewStatus == 'hired') {
          let status = "Interview List - Hired"
          allTalentPositions.push({ position: res, talentStatus: status });
        }
      }
    }
  }
  res.status(200).json({
    status: 'success',
    result: { positions: allTalentPositions, talent: talent }
  });

});

