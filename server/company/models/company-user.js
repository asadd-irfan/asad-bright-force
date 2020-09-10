const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');


const CompanyUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  phone: { type: String, unique: true },
  role: {
    type: String,
    required: [true, 'role is required!'],
    enum: ['admin', 'moderator']
  },
  authorizations: [{
    type: String,
    enum: ['hire', 'manage']
  }],
  title: String,
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'company',
    // autopopulate: true
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: 6,
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
  // status: {
  //   type: String,
  //   default: 'pending',
  //   enum: ['pending', 'approved', 'rejected']
  // },
  profileImage: { type: String },
  // isDeleted: { type: Boolean, default: false },
  billingUser: { type: Boolean, default: false },
  isAutoGenerate:  { type: Boolean, default: false },

}, {
  timestamps: true
});

CompanyUserSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

CompanyUserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

CompanyUserSchema.plugin(require('mongoose-autopopulate'));

module.exports = CompanyUser = mongoose.model('company-user', CompanyUserSchema);
