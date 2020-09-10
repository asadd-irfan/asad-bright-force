const mongoose = require('mongoose');

const AppConfigSchema = new mongoose.Schema({
  type: {
    type: String,
    require: [true, 'Configuration type is required']

  },
  name: {
    type: String,
    require: [true, 'Configuration name is required']
  },
  extraConfig: {
    name: String,
    value: Boolean
  },
  weight: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  timezoneUTC: String,
  isBelongTo: { type: mongoose.Schema.ObjectId }

});

module.exports = AppConfigs = mongoose.model('app-configurations', AppConfigSchema);
