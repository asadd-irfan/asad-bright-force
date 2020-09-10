const mongoose = require('mongoose');
const validator = require('validator');

const companyRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  phone: { type: String, unique: true },
  title: String,
  companyName: { type: String, required: true },
  companyWebsite: { type: String },
  assignedCompany: {
    type: mongoose.Schema.ObjectId,
    ref: 'company'
  },
  employees: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
    autopopulate: {
      select: 'name'
    }
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'handled', 'closed', 'denied']
  },
  type: {
    type: String,
    enum: ['new-company', 'already-exist-company']
  },
  accountManager: {
    type: mongoose.Schema.ObjectId,
    ref: 'admin',
    // autopopulate: {
    //   select: 'name'
    // }
  },
  deniedReport: {
    deniedByAdmin: {
      type: mongoose.Schema.ObjectId,
      ref: 'admin',
      autopopulate: {
        select: 'name'
      }
    },
    date: String,
    rejectionReason: String,
  }

}, {
  timestamps: true
});

companyRequestSchema.plugin(require('mongoose-autopopulate'));

module.exports = CompanyRequest = mongoose.model('company-request', companyRequestSchema);
