const mongoose = require('mongoose');

const positionCandidateSchema = new mongoose.Schema({
  position: {
    type: mongoose.Schema.ObjectId,
    ref: 'positions',
  },
  groupId: {
    type: mongoose.Schema.ObjectId,
  },

  candidateId: {
    type: mongoose.Schema.ObjectId,
    ref: 'talent',
    autopopulate: true
  },
  positionOffer: {
    type: mongoose.Schema.ObjectId,
    ref: 'position-offer',
  },
  interviewId: {
    type: mongoose.Schema.ObjectId,
    ref: 'meeting-calender'
  },
  status: {
    type: String,
    enum: ['processed', 'long-list', 'short-list', 'interview'],
    // default: 'long-list'
  },
  shortListStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
  },
  interviewStatus: {
    type: String,
    enum: ['scheduled', 'time-passed', 'pass', 'fail', 'hired'],
  },
  offerSentDate: Date,
  interviewDate: Date,
  interviewDetails: {
    type: mongoose.Schema.ObjectId,
    ref: 'meeting-calender',
    autopopulate: {
      select: 'startTime'
    }
  },
  matchingScore: Number,
  comments: {
    text: String,
    date: Date,
    recruitmentStage: String
  }

},
  {
    timestamps: true
  });

positionCandidateSchema.plugin(require('mongoose-autopopulate'));

module.exports = PositionCandidate = mongoose.model('position-candidate', positionCandidateSchema);
