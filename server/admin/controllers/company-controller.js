const catchAsync = require('../../utils/catch-async');
const AppError = require('../../utils/app-error-handler');
const Company = require('../../company/models/company');
const Positions = require('../../company/models/positions');
const CompanyRequest = require('../../company/models/company-request');
const CompanyUser = require('../../company/models/company-user');
const jwt = require('jsonwebtoken');
const APIFeatures = require('../../utils/api-features');


exports.createNewCompany = catchAsync(async (req, res, next) => {
  if (req.body.companyName) {
    let allCompaniesCount = await Company.countDocuments({});
    let companyId = allCompaniesCount + 1;
    await Company.create({
      companyId: companyId,
      name: req.body.companyName,
      website: req.body.companyURL ? req.body.companyURL : '',
    }, function (err, result) {
      if (err) {
        if (err.name == 'MongoError' && err.code == 11000) {
          return next(new AppError('Company Name must be unique. Please use another value!', 400));
        } else {
          return next(new AppError('Some Error Occurred', 500));
        }
      }
      res.status(201).json({
        status: 'success',
        message: "Company created Successfully!"
      })
    });

  } else {
    return next(new AppError('companyName is required.', 400));
  }
});

exports.createCompany = catchAsync(async (req, res, next) => {

  let company = await Company.findOne({ name: req.body.companyName });
  // console.log('company',company)

  if (company) {
    return next(new AppError('Company already exists.', 400));
  } else {
    let request = await CompanyRequest.findOne({ companyName: req.body.companyName });
    if (!request) {
      return next(new AppError('Incorrect Company Name', 400));
    } else {
      let allCompaniesCount = await Company.countDocuments({});
      let companyId = allCompaniesCount + 1;
      let newCompany = await Company.create({
        companyId: companyId,
        name: request.companyName,
        website: request.companyWebsite,
        size: request.employees,
      })

      // console.log('newCompany',newCompany)

      res.status(201).json({
        status: 'success',
        message: "Company created Successfully!"
      })
    }

  }

});

exports.getAllCompanies = catchAsync(async (req, res) => {
  let queryObj = {};
  if (req.query.name && req.query.name != "") {
    queryObj["name"] = { $regex: req.query.name, $options: 'i' };
    delete req.query.name;
  }
  if (req.query.country && req.query.country != "") {
    queryObj["location"] = { $regex: req.query.country, $options: 'i' };
    delete req.query.country;
  }
  if (req.query.unAssignManager) {
    queryObj['accountManager'] = { $exists: false }
    delete req.query.unAssignManager;
  }
  // console.log('queryObj', queryObj)

  const features = new APIFeatures(Company.find(queryObj), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const result = await features.query;
  if (result.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No Result Found!'
    });
  } else {
    res.status(200).json({
      status: 'success',
      length: result.length,
      result: result
    });
  }
});


exports.getCompanyById = catchAsync(async (req, res, next) => {
  let company = await Company.findById(req.params.id);
  // console.log(company)
  if (!company) {
    return next(new AppError('No record found with that ID', 404));
  }

  let positions = await Positions.find({ companyId: req.params.id, sentToAccountManager: true, status: 'Open', isDeleted: false });

  res.status(200).json({
    status: 'success',
    result: { result: company, openPositions: positions.length }
  });
});


exports.getCompanyAndRequestsCount = catchAsync(async (req, res, next) => {

  const companyStatus = ['registered', 'not-registered', 'newly-inactive'];
  const companyRequestStatus = ['pending', 'handled', 'closed', 'denied'];
  const results = [
    'registeredCompanies', 'notRegisteredCompanies', 'newlyInactiveCompanies',
    'pendingRequests', 'handledRequests', 'closedRequests',
    'deniedRequests'
  ]

  let formattedResult = new Object();
  for (let i = 0; i < companyStatus.length; i++) {
    let allCompanies = await Company.find({ 'status': companyStatus[i] });
    formattedResult[results[i]] = allCompanies.length * 1;
  }
  for (let i = 0; i < companyRequestStatus.length; i++) {
    let allCompanyRequests = await CompanyRequest.find({ 'status': companyRequestStatus[i] });
    formattedResult[results[i + 3]] = allCompanyRequests.length * 1;
  }

  res.status(200).json({
    status: 'success',
    result: formattedResult
  });

});

exports.getAllCompanyUsers = catchAsync(async (req, res, next) => {

  let users = await CompanyUser.find({ company: req.params.id });

  if (users.length == 0) {
    return next(new AppError('No User found.', 404));
  }

  res.status(200).json({
    status: 'success',
    result: users
  });

});

exports.inviteUser = catchAsync(async (req, res, next) => {
  let user = await CompanyUser.findOne({ email: req.body.email })
  if (user) {
    return next(new AppError('User already exists.', 404));
  }
  else {
    let company = await Company.findByIdAndUpdate({ _id: req.params.id },
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
        companyId: req.params.id,
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

  const result = await CompanyUser.findByIdAndDelete(req.params.userId);

  if (!result) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: "User deleted Successfully!"
  });

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

  let updateCurrentUser = await CompanyUser.findByIdAndUpdate(req.body.adminId, {
    "role": 'moderator'
  }, { new: true, runValidators: true });

  res.status(200).json({
    status: "success",
    message: "User role updated successfully!"
  });
});


exports.updateCompanyDetails = catchAsync(async (req, res, next) => {

  if (req.file) {
    if (req.file.fieldname == 'logo') {
      req.body.logo = req.file.filename;
    }
    if (req.file.fieldname == 'bannerImage') {
      req.body.bannerImage = req.file.filename;
    }
  }

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

});

exports.companyInternalRecords = catchAsync(async (req, res, next) => {
  let company = await Company.findByIdAndUpdate({ _id: req.params.id }, {
    "internalRecords": req.body
  }, { new: true, runValidators: true });

  if (!company) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: company.internalRecords,
    message: "Company Internal Records updated Successfully!"
  });

});

exports.assignAccountManager = catchAsync(async (req, res, next) => {

  let updatedCompany = await Company.findByIdAndUpdate(req.params.id,
    {
      "accountManager": req.body.accountManagerId
    },
    { new: true, runValidators: true });
  if (!updatedCompany) {
    return next(new AppError('No company found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: "Account Manager added to company Successfully!"
  });

});


exports.updateBillingDetails = catchAsync(async (req, res, next) => {

  let company = await Company.findByIdAndUpdate({ _id: req.params.id }, {
    "billingDetails": req.body
  }, { new: true, runValidators: true });

  if (!company) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: "Company billing details updated Successfully!"
  });


});
