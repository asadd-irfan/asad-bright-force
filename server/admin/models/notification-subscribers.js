const mongoose = require('mongoose');

const NotificationSubscriberSchema = new mongoose.Schema({

  referenceId: {
    type: mongoose.Schema.ObjectId,
  },
  notificationType: {
    type: String,
    enum: ['position', 'talent', 'billing', 'admin', 'company'],
  },
  event: {
    type: String,
    enum: ['talent', 'hiring-team'],
  },
  sendingMethod: [{
    type: String,
    enum: ['email', 'db', 'sms'],
  }],
  subscribersList: [
    {
      type: mongoose.Schema.ObjectId,
    }
  ],
},
  {
    timestamps: true
  });

module.exports = NotificationSubscriber = mongoose.model('notification-subscriber', NotificationSubscriberSchema);
