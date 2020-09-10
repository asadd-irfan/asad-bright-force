const catchAsync = require('../../utils/catch-async');
const AppError = require('../../utils/app-error-handler');
const Notifications = require('../models/notification-messages');




exports.getAllNotifications = catchAsync(async (req, res, next) => {
  let notifications = await Notifications.find({receiverId: req.user.id});
  let unReadNotifications = await Notifications.find({receiverId: req.user.id, markAsRead: false});

  if (notifications.length == 0) {
    res.status(200).json({
      status: 'success',
      message: "No notifications found."
    });
  } else {
    res.status(200).json({
      status: 'success',
      count: unReadNotifications.length,
      result: notifications
    });
  }

});


exports.markAsReadNotification = catchAsync(async (req, res, next) => {
  let result = await Notifications.findById(req.params.id);
  if (!result) {
    return next(new AppError('No record found with that ID', 404));
  }
  if (result.receiverId.toString() == req.user.id) {

  let notification = await Notifications.findByIdAndUpdate(req.params.id, {
    "markAsRead":  true,
  }, { new: true });
  
  res.status(200).json({
    status: 'success',
    message: "Notifications read successfully."
  });
} else {
  return next(new AppError('Some error occurred', 404));
}

});

exports.getPositionNotifications = catchAsync(async (req, res, next) => {
  let notifications = await Notifications.find({receiverId: req.user.id, positionId: req.params.id});

  if (notifications.length == 0) {
    res.status(200).json({
      status: 'success',
      message: "No notifications found."
    });
  } else {
    res.status(200).json({
      status: 'success',
      result: notifications
    });
  }

});

