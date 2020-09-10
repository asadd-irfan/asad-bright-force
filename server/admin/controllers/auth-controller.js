const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin-model');
const AppConfig = require('../models/app-config-model');
const catchAsync = require('./../../utils/catch-async');
const AppError = require('./../../utils/app-error-handler');
const APIFeatures = require('../../utils/api-features');

function generateJWT(admin, res) {
  const payload = {
    user: {
      id: admin.id,
      app: 'admin'
    }
  };

  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (error, token) => {
    if (error) throw error;
    return res.json({ token });
  });
}

exports.register = async (req, res, next) => {

  let { name, email, password, phone } = req.body;
  //convert email to lower case
  console.log(req.body)
  email = email.toLowerCase();

  try {
    // Check if already admin exists
    let admin = await Admin.findOne({ email });
    // if (admin) return res.status(400).json({  status: 'error', error: { msg: 'Admin already exists' } });
    if (admin) return next(new AppError('Admin already exists', 400));

    // Create admin model
    admin = new Admin({
      name,
      email,
      password,
      role: 'admin',
      phone
    });
    // Save admin
    admin.save();

    generateJWT(admin, res);
  } catch (error) {
    console.log(error.message);
    return next(new AppError('Server Error.', 500));
  }
}

exports.login = async (req, res, next) => {

  let { email, password } = req.body;
  //convert email to lower case
  email = email.toLowerCase();

  try {
    // check that admin exists
    let admin = await Admin.findOne({ email });
    // if (!admin) return res.status(400).json({ status: 'error',  error: { msg: 'Invalid Email' } });
    if (!admin) return next(new AppError('Invalid Email', 400));

    // validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    // if (!isMatch) return res.status(400).json({  status: 'error', error: { msg: 'Invalid Password' } });
    if (!isMatch) return next(new AppError('Invalid Password', 400));

    generateJWT(admin, res);

  } catch (error) {
    console.log(error.message);
    return next(new AppError('Server Error.', 500));
  }
}


exports.getMe = async (req, res, next) => {
  try {
    let admin = await Admin.findById(req.user.id).select('-password');
    return res.json(admin);
  } catch (error) {
    console.log(error.message);
    return next(new AppError('Server Error.', 500));
  }
}

exports.updatePassword = catchAsync(async (req, res, next) => {
  let admin = await Admin.findById(req.user.id).select('+password');
  if (!(await admin.correctPassword(req.body.currentPassword, admin.password))) {
    return next(new AppError('Your current password is wrong.', 400));
  }
  admin.password = req.body.password;
  admin.passwordConfirm = req.body.passwordConfirm;
  await admin.save();

  generateJWT(admin, res);

  res.status(200).json({
    status: 'success',
    message: 'Password Updated Successfully!'
  });

});

exports.updateAdminProfile = catchAsync(async (req, res, next) => {
  // if (req.user.id == req.params.id) {
  if (req.file) req.body.profileImage = req.file.filename;
  let admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!admin) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: admin,
    message: "Staff member profile updated Successfully!"
  });

  // } else {
  //   return next(new AppError('You have not permission to edit this user.', 404));
  // }

});

exports.getAllStaffMember = catchAsync(async (req, res, next) => {
  let filter = { role: 'account-manager' };
  if (req.query.city) {
    filter['location.city'] = req.query.city
    delete req.query.city;
  }
  if (req.query.country) {
    filter['location.country'] = req.query.country
    delete req.query.country;
  }

  const features = new APIFeatures(Admin.find(filter), req.query)
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

exports.createStaffMember = catchAsync(async (req, res, next) => {
  if (req.body.role == 'account-manager') {
    await Admin.create(req.body, function (err, result) {
      if (err) {
        if (err.name == 'MongoError' && err.code == 11000) {
          return next(new AppError('Email and phone must be unique. Please use another value!', 400));
        } else {
          return next(new AppError('Some Error Occurred', 500));
        }
      }
      res.status(201).json({
        status: 'success',
        result: result,
        message: "Staff Member created Successfully!"
      })
    });
  } else {
    return next(new AppError('Invalid role.', 400));
  }

});
// exports.test = catchAsync(async (req, res, next) => {
//   console.log('allCompaniesCount', allCompaniesCount)
// });

exports.updateCoefficientWeight = catchAsync(async (req, res, next) => {

  let allCoefficientConfigs = req.body.coefficientConfigs;

  let totalWeight = 0;
  allCoefficientConfigs.map(element => {
    if (element.weight) {
      totalWeight += element.weight
    }
  })
  if (totalWeight == 100) {
    let size = allCoefficientConfigs.length
    for (let i = 0; i < size; i++) {
      const result = await AppConfig.findByIdAndUpdate(allCoefficientConfigs[i].key, {
        weight: allCoefficientConfigs[i].weight
      }, {
        new: true,
        runValidators: true
      });
    }

  } else {
    return next(new AppError('Total weight of coefficient config should be equal to 100.', 400));

  }

  res.status(200).json({
    status: 'success',
    // result: result,
    message: "coefficient configs weight updated Successfully!"
  });

});