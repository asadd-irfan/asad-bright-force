const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
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
  phone: { type: String, unique: true },
  password: {
    type: String,
    // required: [true, 'Password is required!'],
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
  role: {
    type: String,
    required: [true, 'role is required!'],
    enum: ['admin', 'account-manager']
  },
  profileImage: { type: String },
  location: {
    country: String,
    city: String,
    address: String
  },
  github: { type: String },
  linkedIn: { type: String },
  stackOverflow: { type: String },
  personalWebsite: { type: String },

},
  {
    timestamps: true
  });

adminSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = Admin = mongoose.model('admin', adminSchema);
