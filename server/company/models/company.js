const mongoose = require('mongoose');
const validator = require('validator');

const InviteUserSchema = new mongoose.Schema({
  // username: { type: String, unique: true },
  // email: { type: String, unique: true },
  // phone: { type: String, unique: true },
  email: {
    type: String,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
}, {
  timestamps: true
})
const BillingSchema = new mongoose.Schema({
  formalName: String,
  address: String,
  country: String,
  legalForm: String,
  postalCode: Number,

}, {
  timestamps: true
})

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  website: { type: String },
  linkedIn: { type: String },
  logo: { type: String },
  // bannerImage: { type: String },
  companyId: { type: Number, unique: true },
  about: { type: String },
  size: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
    autopopulate: {
      select: 'name'
    }
  },
  location: String,
  industries: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
      autopopulate: {
        select: 'name'
      }
    }
  ],
  // foundationDate: Date,
  // fundingRaised: {
  //   amount: Number,
  //   currency: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'app-configurations',
  //     autopopulate: {
  //       select: 'name'
  //     }
  //   }
  // },
  // technologiesUsed: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'app-configurations',
  //     autopopulate: {
  //       select: 'name'
  //     }
  //   }
  // ],
  companyValues: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
      autopopulate: {
        select: 'name'
      }
    }
  ],
  companyFeatures: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
      autopopulate: {
        select: 'name'
      }
    }
  ],
  status: {
    type: String,
    default: 'not-registered',
    enum: ['registered', 'not-registered', 'newly-inactive']
  },
  registrationDate: Date,
  internalRecords: {
    openPositions: Number,
    keyStakeholder: String
  },
  billingDetails: BillingSchema,
  inviteUser: [InviteUserSchema],
  accountManager: {
    type: mongoose.Schema.ObjectId,
    ref: 'admin',
    autopopulate: {
      select: 'name email phone'
    }
  },
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
  },
  timezone: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
  },
  // companyAccountActivatedBy: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'company-user',
  //   autopopulate: {
  //     select: 'name'
  //   }
  // },
  isAutoGenerate: { type: Boolean, default: false },

}, {
  timestamps: true
});

companySchema.plugin(require('mongoose-autopopulate'));

module.exports = Company = mongoose.model('company', companySchema);
