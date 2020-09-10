const catchAsync = require('../../utils/catch-async');
const AppError = require('../../utils/app-error-handler');
const Company = require('../../company/models/company');
const CompanyRequest = require('../../company/models/company-request');
const CompanyUser = require('../../company/models/company-user');
const jwt = require('jsonwebtoken');



exports.assignToCompany = async (req, res, next) => {

  let company = await Company.findById(req.body.companyId);
  if (!company) {
    return next(new AppError('No company found with that ID', 404));
  }
  let companyRequest = await CompanyRequest.findById(req.params.id);
  if (!companyRequest) {
    return next(new AppError('No Request found with that ID', 404));
  }
  // if (company.name == companyRequest.companyName) {
    let requests = await CompanyRequest.find({ assignedCompany: req.body.companyId });
    let request;
    if (requests.length > 0) {
      request = await CompanyRequest.findByIdAndUpdate(req.params.id, {
        status: 'handled',
        assignedCompany: req.body.companyId,
        type: 'already-exist-company'
      }, { new: true });

    } else {
      request = await CompanyRequest.findByIdAndUpdate(req.params.id, {
        status: 'handled',
        assignedCompany: req.body.companyId,
        type: 'new-company'
      }, { new: true });
    }
    if (!request) {
      return next(new AppError('No request found with that ID', 404));
    }

    res.status(201).json({
      status: 'success',
      message: `User assigned to Company: '${request.companyName}'.`
    })

  // } else {
  //   return next(new AppError('You can not assign to other company.', 404));
  // }

}

exports.sendEmailToUser = async (req, res, next) => {

  let request = await CompanyRequest.findById(req.params.id);

  if (!request) {
    return next(new AppError('No request found with that ID', 404));
  }
  const payload = {
    user: {
      id: request._id
    }
  };

  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (error, token) => {
    if (error) throw error;
    return res.status(201).json({
      status: 'success',
      URL: `http://localhost:3000/company/register-first-user?token=${token}`
    })
  });

}


exports.denyRequest = catchAsync(async (req, res, next) => {
  let companyRequest = await CompanyRequest.findById(req.params.id);
  if (!companyRequest) {
    return next(new AppError('No request found with that ID', 404));
  }
  if (companyRequest.status == 'pending') {
    var date = new Date()
    await CompanyRequest.findByIdAndUpdate(req.params.id,
      {
        "deniedReport": {
          'deniedByAdmin': req.user.id,
          'date': date,
          'rejectionReason': req.body.rejectionReason,
        },
        "status": 'denied'
      },
      { new: true, runValidators: true });

    res.status(200).json({
      status: 'success',
      message: "request denied Successfully!"
    });

  } else {
    return next(new AppError('You can not denied this request.', 400));
  }

});

exports.changeEmailOfRequest = catchAsync(async (req, res, next) => {
  let request = await CompanyRequest.findByIdAndUpdate({ _id: req.params.id }, {
    "email": req.body.email
  }, { new: true, runValidators: true });

    if (!request) {
      return next(new AppError('No request found with that ID', 404));
    }
  
  res.status(200).json({
    status: 'success',
    message: "Email Changes Successfully!!!"
  });

});

exports.restartRequest = catchAsync(async (req, res, next) => {
  let companyRequest = await CompanyRequest.findById(req.params.id);
  if (!companyRequest) {
    return next(new AppError('No request found with that ID', 404));
  }
  if (companyRequest.status == 'denied') {
  await CompanyRequest.findByIdAndUpdate({ _id: req.params.id }, {
    "status": 'pending'
  },
    { new: true });

  res.status(200).json({
    status: 'success',
    message: "Request Status Changes to Pending!"
  });
} else {
  return next(new AppError("You can't restart this request", 404));
}

});

exports.assignAccountManagerToRequest = catchAsync(async (req, res, next) => {
  let request = await CompanyRequest.findByIdAndUpdate(req.params.id,
    {
      "accountManager": req.body.accountManagerId
    },
    { new: true, runValidators: true });

  if (!request) {
    return next(new AppError('No record found with that ID', 404));
  }
  // console.log(request.assignedCompany)
  if (request.assignedCompany) {
    let company = await Company.findById(request.assignedCompany)
    if (!company) {
      return next(new AppError('No record found with that ID', 404));
    }
  if (!company.accountManager) {
      let updatedCompany = await Company.findByIdAndUpdate(request.assignedCompany,
        {
          "accountManager": req.body.accountManagerId
        },
        { new: true, runValidators: true });
    }
  }
  res.status(200).json({
    status: 'success',
    message: "Account Manager added to request Successfully!"
  });

});

