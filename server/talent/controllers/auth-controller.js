const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Talent = require('../models/talent-model');
const catchAsync = require('./../../utils/catch-async');
const AppError = require('./../../utils/app-error-handler');
const mongoose = require('mongoose');
const AppConfigsModel = require('../../admin/models/app-config-model');
const zxcvbn = require('zxcvbn');
const { promisify } = require('util');

function generateJWT(talent, res) {
  const payload = {
    user: {
      id: talent.id,
      // role: talent.role,
      app: 'talent'
    }
  };

  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (error, token) => {
    if (error) throw error;
    return res.json({ token });
  });

}

exports.register = async (req, res, next) => {

  let { name, email, password, role } = req.body;
  //convert email to lower case
  email = email.toLowerCase();
  try {
    if (zxcvbn(password).score >= 2) {
      // console.log('zxcvbn', zxcvbn(password))

      // Check if already talent exists
      let talent = await Talent.findOne({ email: email });

      // if (talent) return res.status(400).json({  status: 'error', error: { msg: 'Talent already exists' } });
      if (talent) return next(new AppError('Talent already exists', 400));
      if (!mongoose.Types.ObjectId.isValid(role)) {
        return next(new AppError('Invalid role.', 400));
      }
      let talentRole = await AppConfigsModel.findById(role)
      if (!talentRole) return next(new AppError('No role found.', 404));
      if (talentRole.extraConfig && talentRole.extraConfig.name == 'developer') {
        isDeveloper = true
        isDesigner = false
      }
      else if (talentRole.extraConfig && talentRole.extraConfig.name == 'designer') {
        isDesigner = true
        isDeveloper = false
      } else {
        isDesigner = false
        isDeveloper = false
      }
      // add english language in talent profile
      let companySizeConfigs = await AppConfigsModel.find({ type: 'company-size' });
      let companyPreferences = {
        companySize: [],
        industryPreference: []
      };
      if (companySizeConfigs && companySizeConfigs.length > 0) {
        companySizeConfigs.map(element => {
          companyPreferences.companySize.push(element._id)
        })
      }
      // console.log('companyPreferences',companyPreferences)


      let englishLanguageConfig = await AppConfigsModel.findOne({ type: 'language', name: 'English' });
      let languages = [];
      let obj = {
        name: englishLanguageConfig._id,
        priorityOrder: 0
      }
      languages.push(obj);
      let allTalentsCount = await Talent.countDocuments({});
      let talentId = allTalentsCount + 1;
      // Create talent model
      talent = new Talent({
        name,
        email,
        password,
        role,
        isDeveloper,
        isDesigner,
        languages,
        companyPreferences,
        talentId,
      });

      // Save talent
      talent.save();

      generateJWT(talent, res);
    } else {
      return next(new AppError("Please input Strong Password.", 400));
    }
  } catch (error) {
    console.log(error.message);
    // return res.status(500).json({  status: 'error', error: { msg: 'Server Error.' } });
    return next(new AppError('Server Error.', 500));
  }


}

exports.login = async (req, res, next) => {

  let { email, password } = req.body;
  //convert email to lower case
  email = email.toLowerCase();

  try {
    // check that talent exists
    let talent = await Talent.findOne({ email }).select('+password');
    // if (!talent) return res.status(400).json({  status: 'error', error: { msg: 'Invalid Email' } });
    if (!talent) return next(new AppError('Invalid Email', 400));

    // validate password

    const isMatch = await bcrypt.compare(password, talent.password);
    // if (!isMatch) return res.status(400).json({  status: 'error', error: { msg: 'Invalid Password' } });
    if (!isMatch) return next(new AppError('Invalid Password', 400));

    generateJWT(talent, res);

  } catch (error) {
    console.log(error.message);
    return next(new AppError('Server Error.', 500));
  }
}

exports.getMe = async (req, res, next) => {
  try {
    let talent = await Talent.findById(req.user.id).select('-password');
    return res.json(talent);
  } catch (error) {
    console.log(error.message);
    return next(new AppError('Server Error.', 500));
  }
}

exports.updatePassword = catchAsync(async (req, res, next) => {
  const talent = await Talent.findById(req.user.id).select('+password');
  if (!(await talent.correctPassword(req.body.currentPassword, talent.password))) {
    return next(new AppError('Your current password is wrong.', 400));
  }
  talent.password = req.body.password;
  talent.passwordConfirm = req.body.passwordConfirm;
  await talent.save();

  generateJWT(talent, res);

  res.status(200).json({
    status: 'success',
    message: 'Password Updated Successfully!'
  });

});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const talent = await Talent.findOne({ email: req.body.email });
  if (!talent) {
    return next(new AppError('There is no Talent with this email address.', 404));
  }

  try {
    const payload = {
      talentId: talent._id
    };
    let token = jwt.sign(payload, process.env.RESET_TOKEN_KEY, { expiresIn: 360000 });
    let link = `http://localhost:3000/talent/reset-password/${token}`
    const data = {
      from: 'support@brightfroce.io',
      to: talent.email,
      subject: 'Reset Your Password',
      text: `Hi ${talent.name} \n 
          Please click on the following link to reset your password: \n ${link} \n 
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };


    res.status(200).json({
      status: 'success',
      result: link,
      message: 'Password Reset Token sent to email!'
    });

  } catch (err) {
    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }

});


exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const decoded = await promisify(jwt.verify)(req.params.token, process.env.RESET_TOKEN_KEY);

  if (!decoded) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  const talent = await Talent.findById(decoded.talentId);

  if (!talent) {
    return next(new AppError('No User Found', 400));
  }

  if (zxcvbn(req.body.password).score >= 2) {
    talent.password = req.body.password;
    await talent.save();

    res.status(200).json({
      status: 'success',
      message: 'Password Changed Successfully!'
    });

  } else {
    return next(new AppError("Please input Strong Password.", 400));
  }

});
