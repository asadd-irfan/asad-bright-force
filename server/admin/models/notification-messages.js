const mongoose = require('mongoose');

const NotificationMessagesSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.ObjectId,
  },
  referenceLink: {
    type: String,
  },
  referenceTitle: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  markAsRead: { type: Boolean, default: false },
  positionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'positions',
  },
  // recruitmentId: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'position-candidate',
  // },

},
  {
    timestamps: true
  });

module.exports = Notifications = mongoose.model('notifications', NotificationMessagesSchema);
