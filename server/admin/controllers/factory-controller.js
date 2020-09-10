const catchAsync = require('../../utils/catch-async');
const AppError = require('../../utils/app-error-handler');
const APIFeatures = require('../../utils/api-features');
const AppConfig = require('../models/app-config-model');

exports.delete = Model =>
  catchAsync(async (req, res, next) => {
    const result = await Model.findByIdAndDelete(req.params.id);

    if (!result) {
      return next(new AppError('No record found with that ID', 404));
    }

    res.status(202).json({
      status: 'success',
      message: "Record deleted Successfully!"
    });
  });

exports.update = Model =>
  catchAsync(async (req, res, next) => {
    const result = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!result) {
      return next(new AppError('No record found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      result: result,
      message: "Record updated Successfully!"
    });
  });


// exports.create = Model =>
//   catchAsync(async (req, res) => {
//     const result = await Model.create(req.body);

//     res.status(201).json({
//       status: 'success',
//       result: result,
//       message: "Record created Successfully!"
//     });
//   });

exports.create = Model => async (req, res, next) => {
  // const result = await Model.create(req.body);
  await Model.create(req.body, function (err, result) {
    if (err) {
      if (err.name == 'MongoError' && err.code == 11000) {
        return next(new AppError('Value must be unique. Please use another value!', 400));
        // return res.status(400).json({  status: 'error', error: { msg: 'Value must be unique. Please use another value!' } })
      } else {
        return next(new AppError('Some Error Occurred', 500));
      }
    }
    res.status(201).json({
      status: 'success',
      result: result,
      message: "Record created Successfully!"
    })
  });
};

exports.getById = Model =>
  catchAsync(async (req, res, next) => {
    let result = await Model.findById(req.params.id);

    if (!result) {
      return next(new AppError('No record found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      result: result
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res) => {
    const features = new APIFeatures(Model.find(), req.query)
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

exports.getAllConfigs = async (req, res) => {
  await AppConfig.find().then(result => {
    let formattedResponse = {};
    result.map(element => {
      if (formattedResponse[element.type]) {
        formattedResponse[element.type].push(element)
      } else {
        formattedResponse[element.type] = [element]
      }
    });

    res.status(200).json({
      status: 'success',
      length: result.length,
      result: formattedResponse
    });
  });
}