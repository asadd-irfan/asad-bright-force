const CompanyUser = require('../models/company-user')
const Company = require('../models/company')
const Positions = require('../models/positions')
const PositionOffer = require('../models/position-offer')
const Talent = require('../../talent/models/talent-model')
const ScheduleCalender = require('../../admin/models/schedule-calender')
const MeetingCalender = require('../../admin/models/meeting-calender')
const NotificationSubscribers = require('../../admin/models/notification-subscribers')
const AppError = require('./../../utils/app-error-handler')
const catchAsync = require('../../utils/catch-async.js')
const mongoose = require('mongoose')

// exports.createPosition = catchAsync(async (req, res, next) => {
//   if (!mongoose.Types.ObjectId.isValid(req.body.name)) {
//     return next(new AppError('Invalid Position name.', 400))
//   }

//   let user = await CompanyUser.findById(req.user.id)
//   if (!user) {
//     return next(new AppError('No User Found!', 400))
//   }

//   let company = await Company.findById(user.company)
//   let position
//   let team = []
//   team.push(req.user.id)
//   // console.log(team)
//   let allPositionsCount = await Positions.countDocuments({});
//   let positionId = allPositionsCount + 1;

//   position = await Positions.create({
//     name: req.body.name,
//     companyId: user.company,
//     hiringTeam: team,
//     positionId: positionId,
//     positionCreatedBy: req.user.id,
//     assignedAccountManager: company.accountManager
//       ? company.accountManager
//       : null,
//     timezone: company.timezone
//       ? company.timezone
//       : null,
//   })
//   console.log('position', position)

//   if (position && position._id) {
//     let notificationEvents = [{ 'key': 'talent', 'value': [] }, { 'key': 'hiring-team', 'value': team }];
//     notificationEvents.forEach(async (element) => {
//       let subscriber = await NotificationSubscribers.create({
//         referenceId: position._id,
//         notificationType: 'position',
//         event: element.key,
//         sendingMethod: ['db'],
//         subscribersList: element.value,
//       })
//     });
//   }

//   res.status(201).json({
//     status: 'success',
//     data: position,
//     message: 'Company Position created Successfully!',
//   })
// })

exports.createPosition = catchAsync(async (req, res, next) => {
  let allPositionsCount = await Positions.countDocuments({});
  let positionId = allPositionsCount + 1;

  let user = await CompanyUser.findById(req.user.id)
  if (!user) {
    return next(new AppError('No User Found!', 404))
  }

  let company = await Company.findById(user.company)
  if (!company) {
    return next(new AppError('No company Found!', 404))
  }

  let position = {
    ...req.body,
    companyId: user.company,
    positionId: positionId,
    positionCreatedBy: req.user.id,
    assignedAccountManager: company.accountManager
      ? company.accountManager
      : null,
  }

  await Positions.create(position, function (err, result) {
    if (err) {
      return next(new AppError('Some Error Occurred', 500));
    }
    res.status(201).json({
      status: 'success',
      data: result,
      message: 'Company Position created Successfully!',
    })

  });


})

exports.getAllCompanyPositions = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id)
  if (!user) {
    return next(new AppError('No User Found!', 400))
  }

  let positions = await Positions.find({
    companyId: user.company,
    hiringTeam: { $elemMatch: { $eq: req.user.id } },
  }).sort('-updatedAt')
  if (positions.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No Positions found.',
    })
  } else {
    res.status(200).json({
      status: 'success',
      result: positions,
    })
  }
})

exports.getActiveCompanyPositionsOfUser = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id)
  if (!user) {
    return next(new AppError('No User Found!', 400))
  }

  let positions = await Positions.find({
    status: 'Open', isDeleted: false,
    companyId: user.company,
    hiringTeam: { $elemMatch: { $eq: req.user.id } },
    isDeleted: false,
  }).sort('-updatedAt')
  if (positions.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No Positions found.',
    })
  } else {
    res.status(200).json({
      status: 'success',
      result: positions,
    })
  }
})

exports.getAllCompanyPositionsOfUser = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id)
  if (!user) {
    return next(new AppError('No User Found!', 400))
  }

  let activePositions = await Positions.find({
    status: 'Open',
    companyId: user.company,
    sentToAccountManager: true,
    hiringTeam: { $elemMatch: { $eq: req.user.id } },
    isDeleted: false,
  }).sort('-updatedAt');

  let hiredPositions = await Positions.find({
    status: 'Closed - Hired',
    companyId: user.company,
    isDeleted: false,
    hiringTeam: { $elemMatch: { $eq: req.user.id } },
  }).sort('-updatedAt');

  let deletedPositions = await Positions.find({
    isDeleted: true,
    companyId: user.company,
    hiringTeam: { $elemMatch: { $eq: req.user.id } },
  }).sort('-updatedAt');

  if (activePositions.length == 0 && hiredPositions.length == 0 && deletedPositions.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No Positions found.',
    })
  } else {
    res.status(200).json({
      status: 'success',
      result: {
        activePositions: activePositions,
        hiredPositions: hiredPositions,
        deletedPositions: deletedPositions
      }
    })
  }
})

exports.getCompanyPositionDetails = catchAsync(async (req, res, next) => {
  let position = await Positions.findById(req.params.id)
  if (!position) {
    return next(new AppError('No Position found with that ID', 404))
  }

  res.status(201).json({
    status: 'success',
    result: position,
  })
})

exports.updatePositionDetails = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id)
  // console.log('position.user', user.company)
  if (!user) {
    return next(new AppError('No User Found!', 400))
  }
  let position = await Positions.findById(req.params.id)
  if (position && position.isDeleted == false) {

    if (user.company.equals(position.companyId._id)) {
      const found = position.hiringTeam.find((element) => element == req.user.id)
      if (found) {
        let updatedPosition
        if (req.body.sentToAccountManager) {
          let todayDate = new Date()
          let nextDispatchDate = new Date(
            todayDate.setDate(new Date().getDate() + 3)
          )

          let obj = {}
          obj = { ...req.body, nextDispatchedDate: nextDispatchDate }
          // console.log('obj',obj)
          updatedPosition = await Positions.findByIdAndUpdate(
            req.params.id,
            obj,
            {
              new: true,
              runValidators: true,
            }
          )
        } else {
          updatedPosition = await Positions.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
              new: true,
              runValidators: true,
            }
          )
        }

        if (!updatedPosition) {
          return next(new AppError('No Position found with that ID', 404))
        }
        if (req.body.hiringTeam) {
          let notificationSubscriber = await NotificationSubscribers.findOne({
            referenceId: position._id,
            notificationType: 'position',
            event: 'hiring-team',
          })
          if (notificationSubscriber) {
            let subscriber = await NotificationSubscribers.findByIdAndUpdate(
              notificationSubscriber._id,
              {
                subscribersList: req.body.hiringTeam,
              },
              {
                new: true,
                runValidators: true,
              }
            )
          } else {
          }
        }

        res.status(200).json({
          status: 'success',
          result: updatedPosition,
          message: 'Position details updated Successfully!',
        })
      } else {
        return next(new AppError('You can not update this position.', 400))
      }
    } else {
      return next(new AppError('You can update only yours company position.', 400));
    }
  } else {
    return next(new AppError('This Position is deleted.', 400));
  }

})

exports.restoreCompanyPosition = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id)

  if (!user) {
    return next(new AppError('No User Found!', 400))
  }
  let position = await Positions.findById(req.params.id)
  if (!position) {
    return next(new AppError('No Position found with that ID', 404))
  }
  if (position && position.isDeleted == true) {

    if (user.company.equals(position.companyId._id)) {
      const found = position.hiringTeam.find((element) => element == req.user.id)
      if (found) {
        let obj = {
          isDeleted: false
        };
        let updatedPosition = await Positions.findByIdAndUpdate(req.params.id,
          obj,
          { new: true, runValidators: true }
        )

        res.status(200).json({
          status: 'success',
          result: updatedPosition,
          message: 'Position restored Successfully!',
        })
      } else {
        return next(new AppError('You can not update this position.', 400))
      }
    } else {
      return next(new AppError('You can update only yours company position.', 400));
    }
  } else {
    return next(new AppError('This Position is already active.', 400));
  }

})

exports.getTalentScheduleCalender = catchAsync(async (req, res, next) => {
  let schedule = await ScheduleCalender.find({
    type: 'talent',
    userId: req.params.id,
  })
  let meetings = await MeetingCalender.find({ talentId: req.params.id })
  if (schedule.length == 0 && meetings.length == 0) {
    // return next(new AppError('No result Found.', 404))
    res.status(200).json({
      status: 'success',
      message: 'No result Found.',
    })
  }
  res.status(200).json({
    status: 'success',
    result: { availabilityCalender: schedule, meetingCalender: meetings },
  })
})

exports.getTalentOffersList = catchAsync(async (req, res, next) => {
  let talent = await Talent.findById(req.params.id)
  if (!talent) {
    return next(new AppError('No talent record found with that ID', 404))
  }
  let offers = talent.companyOffers
  if (offers.length == 0) {
    return next(new AppError('No offers found.', 404))
  }
  let result = []
  for (let i = 0; i < offers.length; i++) {
    let offer = await PositionOffer.findById(offers[i].offerId)

    let pos
    if (offer && offer.position) {
      pos = await Positions.findById(offer.position)
      if (pos && pos.isDeleted == false) {
        if (pos.companyId.name) {
          result.push({ offerDetails: offer, companyName: pos.companyId.name })
        }
      }
    }
  }

  res.status(200).json({
    status: 'success',
    result: result,
  })
})
