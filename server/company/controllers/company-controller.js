const Company = require('../models/company');
const CompanyUser = require('../models/company-user');
const CompanyRequest = require('../models/company-request');
const MeetingCalendar = require('../../admin/models/meeting-calender');
const Evaluation = require('../../talent/models/evaluation-model');
const AppError = require('./../../utils/app-error-handler');
const catchAsync = require('../../utils/catch-async.js');
const jwt = require('jsonwebtoken');


exports.updateUserDetails = catchAsync(async (req, res, next) => {

  if (req.file) req.body.profileImage = req.file.filename;

  let user = await CompanyUser.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: user,
    message: "User Profile details updated Successfully!"
  });

});

exports.updateCompanyDetails = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id);

  if (user.company == req.params.id) {
    if (req.file) {
      if (req.file.fieldname == 'logo') {
        req.body.logo = req.file.filename;
      }
      if (req.file.fieldname == 'bannerImage') {
        req.body.bannerImage = req.file.filename;
      }
    }
    // console.log('req.file',req.file) 

    let company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!company) {
      return next(new AppError('No record found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      result: company,
      message: "Company details updated Successfully!"
    });

  } else {
    return next(new AppError('You have not permission to edit this company.', 404));
  }

});

exports.inviteUser = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findOne({ email: req.body.email })
  if (user) {
    return next(new AppError('User already exists.', 404));
  }
  else {
    let User = await CompanyUser.findById(req.user.id);
    let companyId = User.company;
    let company = await Company.findByIdAndUpdate({ _id: companyId },
      {
        $push: {
          'inviteUser': req.body
        }
      },
      { new: true, runValidators: true });
    if (!company) {
      return next(new AppError('No Company found with that ID', 404));
    }
    const payload = {
      user: {
        email: req.body.email,
        companyId: companyId,
        authorizations: req.body.authorizations,
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (error, token) => {
      if (error) throw error;
      return res.status(201).json({
        status: 'success',
        message: 'User invited Successfully.',
        URL: `http://localhost:3000/company/register-other-user?token=${token}`
      })
    });
  }
});


exports.removeUser = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id);
  if (req.user.id == req.params.id) {
    return next(new AppError('You can not remove yourself.', 404));
  } else {

    let companyId = user.company;

    let users = await CompanyUser.find({ company: companyId });

    if (users.length == 0) {
      return next(new AppError('No User found.', 404));
    } else {
      let count = 0;
      for (let i = 0; i < users.length; i++) {
        if (users[i]._id == req.params.id) {
          // console.log(' deleted user', users[i])
          await CompanyUser.findByIdAndDelete(req.params.id);
          res.status(200).json({
            status: 'success',
            message: "User deleted Successfully!"
          });
        } else {
          count++;
        }
      }
      if (count == users.length) {
        return next(new AppError('No User found in this Company with that ID.', 404));
      }
    }
  }
});


exports.allCompanyUsers = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id);
  let companyId = user.company;

  let users = await CompanyUser.find({ company: companyId });

  if (users.length == 0) {
    return next(new AppError('No User found.', 404));
  }

  res.status(200).json({
    status: 'success',
    result: users
  });

});


exports.companyDetails = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id);
  if (!user) {
    return next(new AppError('No user found.', 404));
  }
  let companyId = user.company;

  let company = await Company.findById(companyId);

  if (!company) {
    return next(new AppError('No Company found.', 404));
  }

  res.status(200).json({
    status: 'success',
    result: company
  });

});


exports.companyBillingDetails = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id);
  if (!user) {
    return next(new AppError('No user found', 404));
  }
  let companyId = user.company;
  if (user.billingUser == true) {
    let company = await Company.findByIdAndUpdate({ _id: companyId }, {
      "billingDetails": req.body
    }, { new: true, runValidators: true });

    if (!company) {
      return next(new AppError('No record found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      result: company.billingDetails,
      message: "Company billing details updated Successfully!"
    });

  } else {
    return next(new AppError('Only Billing user can update Company billing details.', 404));
  }

});

exports.changeBillingUser = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id);
  if (!user) {
    return next(new AppError('No user found', 404));
  }
  let companyId = user.company;
  if (user.billingUser == true) {
    let users = await CompanyUser.find({ company: companyId });
    let count = 0;
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id == req.params.id) {
        await CompanyUser.findByIdAndUpdate(req.params.id, {
          "billingUser": true
        }, { new: true, runValidators: true });

        await CompanyUser.findByIdAndUpdate(req.user.id, {
          "billingUser": false
        }, { new: true, runValidators: true });

        res.status(200).json({
          status: 'success',
          message: "Company billing User Changes Successfully!"
        });
      } else {
        count++;
      }
    }
    if (count == users.length) {
      return next(new AppError('No User found with that ID in this Company.', 404));
    }

  } else {
    return next(new AppError('Only Billing user can change billing User.', 400));
  }

});

exports.getCompanyInterviews = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findById(req.user.id);
  if (!user) {
    return next(new AppError('No user found.', 404));
  }
  let companyId = user.company;

  let meetings = await MeetingCalendar.find({meetingType: 'company-interview', companyId: companyId})
  
  if (meetings.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No Interview Details Found!'
    });
  } else {
    res.status(200).json({
      status: 'success',
      result: meetings,
    });
  }
  
  
});

exports.getTalentEvaluationDetails = catchAsync(async (req, res, next) => {
  let evaluation = await Evaluation.findOne({
    talent: req.params.id
  });
  if (!evaluation) {
    res.status(200).json({
      status: "success",
      message: "No evaluation record found of that Talent."
    });
  }else{
    res.status(200).json({
      status: "success",
      result: evaluation
    });
  }
});

exports.editAuthorizations = catchAsync(async (req, res, next) => {

  let companyUser = await CompanyUser.findByIdAndUpdate(req.params.id, {
    "authorizations": req.body.authorizations
  }, { new: true, runValidators: true });

  if (!companyUser) {
    return next(new AppError('No user found.', 404));
  }

  res.status(200).json({
    status: "success",
    result: companyUser,
    message: "Authorizations updated successfully!"

  });
});

exports.appointAsAdmin = catchAsync(async (req, res, next) => {

  let companyUser = await CompanyUser.findByIdAndUpdate(req.params.id, {
    "role": 'admin'
  }, { new: true, runValidators: true });

  if (!companyUser) {
    return next(new AppError('No user found.', 404));
  }

  let updateCurrentUser = await CompanyUser.findByIdAndUpdate(req.user.id, {
    "role": 'moderator'
  }, { new: true, runValidators: true });

  res.status(200).json({
    status: "success",
    message: "User role updated successfully!"
  });
});
