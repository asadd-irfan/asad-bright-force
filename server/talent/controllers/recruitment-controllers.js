const catchAsync = require('../../utils/catch-async');
const AppError = require('../../utils/app-error-handler');
const Talent = require('../models/talent-model');
const PositionCandidate = require('../../admin/models/position-candidates');
const PositionOffer = require('../../company/models/position-offer');
const Positions = require('../../company/models/positions');
// const Notifications = require('../../admin/models/notification-messages');
const notifications = require('../../common/notifications');
const NotificationSubscribers = require('../../admin/models/notification-subscribers');


exports.getCompanyOfferList = catchAsync(async (req, res, next) => {

  let talent = await Talent.findById(req.user.id);
  if (!talent) {
    return next(new AppError('No talent record found with that ID', 404));
  }
  let offers = talent.companyOffers;
  if (offers.length == 0) {
    return next(new AppError('No offers found.', 404));
  }
  let result = [];
  for (let i = 0; i < offers.length; i++) {
    let offer = await PositionOffer.findById(offers[i].offerId)
    result.push(offer);
  }

  res.status(200).json({
    status: 'success',
    result: result
  });

});

exports.acceptRejectCompanyOffer = catchAsync(async (req, res, next) => {
  let positionOffer = await PositionOffer.findById(req.params.id)
  if (!positionOffer) {
    return next(new AppError('No offer record found with that ID', 404));
  }
  let position = await Positions.findById(positionOffer.position)
  if (position && position.isDeleted == false) {

    if (positionOffer.talentId.toString() == req.user.id) {

      if (positionOffer.status == 'pending') {
        if (req.body.status == 'talent-accepted') {

          let offer = await PositionOffer.findByIdAndUpdate(req.params.id, {
            "status": 'talent-accepted',
            "candidateMessage": req.body.candidateMessage
          }, { new: true });

          let result = await PositionCandidate.findByIdAndUpdate(offer.recruitmentId, {
            "shortListStatus": 'accepted'
          }, { new: true });

          let talent = await Talent.findById(req.user.id);

          let notificationSubscriberObj = await NotificationSubscribers.findOne({ referenceId: position._id, event: 'hiring-team' });
          if (notificationSubscriberObj) {
            let notificationMsgObj = {
              referenceLink: '/company/hire/recruitment/talent-page/schedule-interview/' + positionOffer.recruitmentId,
              title: "Talent Accepted your Offer",
              description: talent.name + ", Accepted your Offer.",
              referenceTitle: "Schedule an Interview.",
              positionId: positionOffer.position,
            }
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
            message: "Offer accepted Successfully!"
          });

        }
        if (req.body.status == 'talent-rejected') {
          let offer = await PositionOffer.findByIdAndUpdate(req.params.id, {
            "status": 'talent-rejected',
            "candidateMessage": req.body.candidateMessage
          }, { new: true });

          let result = await PositionCandidate.findByIdAndUpdate(offer.recruitmentId, {
            "shortListStatus": 'rejected'
          }, { new: true });

          let position = await Positions.findById(positionOffer.position)
          let talent = await Talent.findById(req.user.id);

          let notificationSubscriberObj = await NotificationSubscribers.findOne({ referenceId: position._id, event: 'hiring-team' });
          if (notificationSubscriberObj) {
            let notificationMsgObj = {
              referenceLink: '/company/hire/recruitment/view-offer/' + positionOffer.recruitmentId,
              title: "Talent Rejected your Offer",
              description: talent.name + ", Rejected your Offer.",
              referenceTitle: "View Offer and you can resend offer.",
              positionId: positionOffer.position,
            }
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
            message: "Offer rejected Successfully!"
          });

        }

      } else if (positionOffer.status == 'talent-accepted') {
        return next(new AppError("This Offer is already accepted.", 400));
      } else {
        return next(new AppError("This Offer is already rejected.", 400));
      }
    } else {
      return next(new AppError("You don't have required permissions", 404));
    }
  } else {
    return next(new AppError('This Position is deleted.', 400));
  }



});


exports.getRecruitmentStatus = catchAsync(async (req, res, next) => {

  let result = await PositionCandidate.findById(req.params.id).select('-candidateId -groupId -__v');
  if (!result) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: result
  });

});