const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const preferredRoleSchema = new mongoose.Schema({
  description: { type: String },
  mainRole: {
    name: {
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
    },
    yearsOfExperience: { type: String },
    skills: [{
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
    }]
  },
  secondaryRole: {
    name: {
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
    },
    yearsOfExperience: { type: String },
    skills: [{
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
    }]
  },
  managementExperience: {
    status: { type: Boolean, default: false },
    yearsOfExperience: { type: String },
  }
}, { _id: false });
// preferredRoleSchema.plugin(require('mongoose-autopopulate'));

const workExperienceSchema = new mongoose.Schema({
  companyName: { type: String, required: [true, 'Company Name is required'] },
  title: String,
  startDate: Date,
  endDate: Date,
  description: String,
  currentlyWorking: { type: Boolean, default: false }
});

const educationSchema = new mongoose.Schema({
  instituteName: String,
  graduationYear: Date,
  degreeTitle: String
});

const contactInfoSchema = new mongoose.Schema({
  date: Date,
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'admin',
    autopopulate: {
      select: 'name email'
    }
  },
  notes: String
});
contactInfoSchema.plugin(require('mongoose-autopopulate'));


const TalentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!']
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: 6,
    select: false
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  role: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
    required: [true, 'role is required.'],
    // autopopulate: {
    // select: 'name'
    // }
  },
  profileImage: { type: String },
  location: {
    country: String,
    city: String,
    address: String
  },
  phone: String,
  github: { type: String },
  linkedIn: { type: String },
  stackOverflow: { type: String },
  personalWebsite: { type: String },
  dribbble: { type: String },
  behance: { type: String },
  preferredRoles: preferredRoleSchema,
  employmentType: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
    }
  ],
  salary: {
    minSalary: Number,
  },
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
  },
  workingHours: {
    startingHour: Number,
    endingHour: Number
  },
  timezone: {
    type: mongoose.Schema.ObjectId,
    ref: 'app-configurations',
  },
  companyPreferences: {
    industryPreference: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'app-configurations',
      }
    ],
    companySize: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'app-configurations',
      }
    ]
  },
  workplaceFeatures: {
    roleFeatures: [{
      feature: {
        type: mongoose.Schema.ObjectId,
        ref: 'app-configurations',
      },
      priorityOrder: { type: Number }
    }],
    companyValues: [{
      value: {
        type: mongoose.Schema.ObjectId,
        ref: 'app-configurations',
      },
      priorityOrder: { type: Number }
    }],
    companyFeatures: [{
      feature: {
        type: mongoose.Schema.ObjectId,
        ref: 'app-configurations',
      },
      priorityOrder: { type: Number }
    }]
  },

  workExperience: [workExperienceSchema],
  education: [educationSchema],
  selfTaught: { type: Boolean, default: false },
  summary: String,
  // aboutMe: String,
  // myAchievements: String,
  // jobSearchStatus: {
  //   type: String,
  //   enum: ['actively-looking', 'exploring', 'not-looking']
  // },
  availabilityStatus: {
    type: String,
    enum: ['live', 'inactive'],
    default: 'live'
  },
  resume: String,
  dontHaveResume: { type: Boolean, default: false },
  profileApproved: {
    status: { type: Boolean, default: false },
    approveDate: Date,
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'admin',
      autopopulate: {
        select: 'name email'
      }
    }
  },
  isDeveloper: { type: Boolean, default: false },
  isDesigner: { type: Boolean, default: false },
  videoInterview: {
    dateTime: Date
  },
  blockedCompanies: [{
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'company'
    },
    companyName: String
  }],
  currentStatus: {
    type: String,
    enum: [
      'profile-not-completed', 'profile-completed', 'profile-submitted-for-approval', 'profile-approved',
      'coding-challenge-pending', 'coding-challenge-pass', 'coding-challenge-fail',
      'video-interview-pending', 'video-interview-fail', 'talent-accepted'
    ],
    default: 'profile-not-completed'
  },
  contactInfo: [contactInfoSchema],
  profileStatus: {
    type: String,
    enum: ['active', 'hold'],
    default: 'active'
  },
  languages: [{
    name: {
      type: mongoose.Schema.ObjectId,
      ref: 'app-configurations',
    },
    priorityOrder: { type: Number }
  }],
  companyOffers: [{
    offerId: {
      type: mongoose.Schema.ObjectId,
      ref: 'position-offer',
    }
  }],
  talentId: { type: Number, unique: true },
  isAutoGenerate: { type: Boolean, default: false },
  videoInterviewPassedDate: Date,
  videoInterviewFailedDate: Date,
  codingChallengePassedDate: Date,
  codingChallengeFailedDate: Date,
  talentAcceptedDate: Date,
  statusLiveDate: Date,
  statusInactiveDate: Date,

}, {
  timestamps: true
});

TalentSchema.plugin(require('mongoose-autopopulate'));

TalentSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

TalentSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = Talent = mongoose.model('talent', TalentSchema);
