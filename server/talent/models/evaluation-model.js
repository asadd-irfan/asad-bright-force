const mongoose = require('mongoose');

const CodingChallengeSchema = new mongoose.Schema({
  websiteLink: String,
  resultLink: String,
  name: String,
  resultDetails: String,
  instructions: String,
  submitDate: Date,
  result: {
    type: String,
    enum: ['pass', 'fail', 'pending'],
    default: 'pending'
  },
  generalScore: String,
  categoriesScores: [{
    name: String,
    percentage: Number
  }],
  isCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

const VideoInterviewSchema = new mongoose.Schema({
  instructions: String,
  startDateTime: Date,
  endDateTime: Date,
  videoLink: String,
  resultLink: String,
  result: {
    type: String,
    enum: ['pass', 'fail', 'pending'],
    default: 'pending'
  },
  resultDetails: String,
  isCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});


const EvaluationSchema = new mongoose.Schema({
  talent: {
    type: mongoose.Schema.ObjectId,
    ref: 'talent',
    unique: true,
    required: [true, 'Talent ID is required.']
  },
  codingChallenge: CodingChallengeSchema,
  videoInterview: VideoInterviewSchema,
  lastUpdatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'admin',
    autopopulate: {
      select: 'name email'
    }
  }
},
  {
    timestamps: true
  });

EvaluationSchema.plugin(require('mongoose-autopopulate'));

module.exports = Evaluation = mongoose.model('evaluation', EvaluationSchema);
