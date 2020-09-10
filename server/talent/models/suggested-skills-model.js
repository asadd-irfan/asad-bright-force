const mongoose = require('mongoose');

const SuggestedSkillSchema = new mongoose.Schema({
  skillName: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'talent',
    required: [true, 'User Id is required']
  }
}, {
  timestamps: true
});

module.exports = SuggestedSkill = mongoose.model('suggested-skills', SuggestedSkillSchema);
