const catchAsync = require('../../utils/catch-async.js');
const AppError = require('../../utils/app-error-handler');
const Evaluation = require('../models/evaluation-model');
const Talent = require('../models/talent-model');


exports.getTalentEvaluation = catchAsync(async (req, res, next) => {
  let evaluation = await Evaluation.findOne({talent: req.user.id});

  if (!evaluation) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: evaluation
  });
});
