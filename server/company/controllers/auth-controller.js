const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/company');
const CompanyRequest = require('../models/company-request');
const CompanyUser = require('../models/company-user');
// const Notifications = require('../../admin/models/notification-messages');
const AppError = require('./../../utils/app-error-handler');
const catchAsync = require('../../utils/catch-async.js');
const notifications = require('../../common/notifications');
const zxcvbn = require('zxcvbn');


function generateJWT(companyUser, res) {
  const payload = {
    user: {
      id: companyUser.id,
      role: companyUser.role,
      app: 'company'
    }
  };

  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (error, token) => {
    if (error) throw error;
    return res.json({ token });
  });

}

// function CheckPassword(password) {
//   //  at least 8 characters,
//   // at least 1 upper case alphabetic character
//   //  at least 1 special character.
//   let regex = /^((?=.*\d)(?=.*[A-Z])(?=.*\W).{8,})$/;

//   if (password.match(regex)) {
//     // console.log('Correct..')
//     return true;
//   }
//   else {
//     // console.log('Wrong...!')
//     return false;
//   }
// }

exports.companyRequest = async (req, res, next) => {

  let { requesterName, email, phone, title, companyName, companyWebsite, employees } = req.body;

  email = email.toLowerCase();

  let result = await CompanyRequest.findOne({ email });
  if (result) return next(new AppError('Company Request already exists', 400));
  // Create a new Company
  await CompanyRequest.create(req.body, function (err, result) {
    if (err) {
      if (err.name == 'MongoError' && err.code == 11000) {
        return next(new AppError('Email and Phone must be unique. Please use another value!', 400));
        // return res.status(400).json({  status: 'error', error: { msg: 'Value must be unique. Please use another value!' } })
      } else {
        return next(new AppError('Some Error Occurred', 500));
      }
    }
    res.status(201).json({
      status: 'success',
      result: result,
      message: "Company Request created Successfully!"
    })
  });;

}

exports.login = async (req, res, next) => {

  let { email, password } = req.body;
  //convert email to lower case
  email = email.toLowerCase();

  try {
    // Check if the company exists
    let user = await CompanyUser.findOne({ email });
    if (!user) return next(new AppError('Invalid Email', 400));

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError('Invalid Password', 400));

    generateJWT(user, res);

  } catch (error) {
    return next(new AppError('Server Error.', 500));
  }
}

exports.getMe = async (req, res, next) => {
  try {
    let user = await CompanyUser.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    console.log(error.message);
    return next(new AppError('Server Error.', 500));
  }
}

exports.createFirstUser = async (req, res, next) => {

  try {

    let request = await CompanyRequest.findById(req.params.id);

    if (!request) {
      return next(new AppError('No request found with that ID', 404));
    }
    if (request.status == 'handled') {
      if (zxcvbn(req.body.password).score >= 2) {

        var companyUser;
        if (request.type == 'new-company') {
          let companyNewUser = new CompanyUser({
            fullName: request.requesterName,
            email: request.email,
            phone: request.phone,
            role: 'admin',
            title: request.title,
            company: request.assignedCompany,
            password: req.body.password,
            billingUser: true,
            authorizations: ['hire', 'manage'],
          });
          companyNewUser.save();
          companyUser = companyNewUser;

          var date = new Date()
          await Company.findByIdAndUpdate(request.assignedCompany, {
            status: 'registered',
            registrationDate: date
          }, { new: true });

          let notificationObj = {
            referenceLink: "/company/hire/profile",
            title: "Complete Your Company Profile",
            description: "Welcome to BrightForce,",
            referenceTitle: "Complete Your Company Profile.",
          }
          let receiver = [];
          receiver.push(companyNewUser._id);

          let response = await notifications.createNotifications(notificationObj, receiver);
          if (response == false) {
            return next(new AppError('ERROR while sending notification', 400));
          }

        }

        if (request.type == 'already-exist-company') {
          let companyOtherUser = new CompanyUser({
            fullName: request.requesterName,
            email: request.email,
            phone: request.phone,
            role: 'moderator',
            title: request.title,
            company: request.assignedCompany,
            password: req.body.password,
          });
          companyOtherUser.save();
          companyUser = companyOtherUser;
        }


        await CompanyRequest.findByIdAndUpdate(req.params.id, {
          status: 'closed',
        }, { new: true });

        generateJWT(companyUser, res);
      }
      else {
        return next(new AppError("Please input Strong Password.", 400));
      }
    } else {
      return next(new AppError('Your Company Request status is not handled yet.', 400));
    }

  } catch (error) {
    return next(new AppError('Some Error Occurred.', 500));
  }

}

exports.createOtherUser = async (req, res, next) => {
  if (zxcvbn(req.body.password).score >= 2) {

    await CompanyUser.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      role: 'moderator',
      title: req.body.title,
      company: req.body.company,
      password: req.body.password,
      authorizations: req.body.authorizations,
    }, function (err, result) {
      if (err) {
        if (err.name == 'MongoError' && err.code == 11000) {
          return next(new AppError('Phone Number must be unique. Please use another value!', 400));
        } else {
          return next(new AppError('Some Error Occurred', 500));
        }
      }

      generateJWT(result, res);

    });
  } else {
    return next(new AppError("Please input Strong Password.", 400));
  }
}

exports.updatePassword = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  generateJWT(user, res);

  res.status(200).json({
    status: 'success',
    message: 'Password Updated Successfully!'
  });

});
