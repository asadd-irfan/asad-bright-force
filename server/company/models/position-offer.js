const mongoose = require('mongoose');

const PositionOfferSchema = new mongoose.Schema({

  salary: Number,
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
  },
  equity: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
  },
  performanceBonus: Number,
  signingBonus: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
  },
  offerLetter: String,

  position: {
    type: mongoose.Schema.ObjectId,
    ref: 'positions',
  },
  talentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'talent',
  },
  candidateMessage: String,
  recruitmentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'position-candidate',
  },
  status: {
    type: String,
    enum: ['pending', 'talent-accepted', 'talent-rejected', 'company-rejected'],
    default: 'pending'
  },


}, {
  timestamps: true
});


module.exports = PositionOffer = mongoose.model('position-offer', PositionOfferSchema);
