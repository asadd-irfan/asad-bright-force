const catchAsync = require("../../utils/catch-async");
const AppError = require("../../utils/app-error-handler");
const APIFeatures = require("../../utils/api-features");
const Evaluation = require("../../talent/models/evaluation-model");
const Talent = require("../../talent/models/talent-model");
const SuggestedCompany = require("../../talent/models/suggested-company");

exports.getAll = catchAsync(async (req, res) => {
  let queryObj = {};
  let talentIdQuery = {};
  let availabilityStatusQuery = {};
  let roleQuery = {};
  let mainRoleQuery = {};
  let secondaryRoleQuery = {};

  if (req.body.talentId && req.body.talentId != "") {
    talentIdQuery.$eq = req.body.talentId;
    queryObj["talentId"] = talentIdQuery;
  }
  if (req.body.availabilityStatus && req.body.availabilityStatus != "") {
    availabilityStatusQuery.$eq = req.body.availabilityStatus;
    queryObj["availabilityStatus"] = availabilityStatusQuery;
  }
  if (req.body.name && req.body.name != "") {
    // nameQuery.$eq = req.body.name;
    // queryObj["name"] = nameQuery;
    queryObj["name"] = { $regex: req.body.name, $options: 'i' };
  }
  if (req.body.country && req.body.country != "") {
    // countryQuery.$eq = req.body.country;
    // queryObj["location.country"] = countryQuery;
    queryObj["location.country"] = { $regex: req.body.country, $options: 'i' };

  }
  if (req.body.role && req.body.role != "") {
    roleQuery.$eq = req.body.role;
    queryObj["role"] = roleQuery;
  }
  if (req.body.mainRole && req.body.mainRole != "") {
    mainRoleQuery.$eq = req.body.mainRole;
    queryObj["preferredRoles.mainRole.name"] = mainRoleQuery;
  }
  if (req.body.secondaryRole && req.body.secondaryRole != "") {
    secondaryRoleQuery.$eq = req.body.secondaryRole;
    queryObj["preferredRoles.secondaryRole.name"] = secondaryRoleQuery;
  }
  console.log('queryObj', queryObj)

  let allTalents = await Talent.find(queryObj);
  // const features = new APIFeatures(Talent.find(queryObj), req.query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();
  // const allTalents = await features.query;
  res.status(200).json({
    status: "success",
    length: allTalents.length,
    result: allTalents,
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  // let talent = await Talent.findById(req.params.id).select('name email jobSearchStatus profileApproved');
  let talent = await Talent.findById(req.params.id);

  if (!talent) {
    return next(new AppError("No record found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    result: talent,
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const result = await Talent.findByIdAndDelete(req.params.id);

  if (!result) {
    return next(new AppError("No record found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    result: null,
    message: "Talent deleted Successfully!",
  });
});

exports.approveTalentProfile = catchAsync(async (req, res, next) => {
  let talent = await Talent.findByIdAndUpdate(
    req.params.id,
    {
      profileApproved: {
        status: true,
        approveDate: Date.now(),
        approvedBy: req.user.id,
      },
      currentStatus: "profile-approved",
    },
    { new: true }
  );

  if (!talent) {
    return next(new AppError("No record found with that id", 404));
  }
  if (talent.isDeveloper) {
    await Evaluation.create(
      {
        talent: req.params.id,
        codingChallenge: {
          result: "pending",
        },
        videoInterview: {
          result: "pending",
        },
      },
      function (err, result) {
        if (err) {
          if (err.name == "MongoError" && err.code == 11000) {
            return next(
              new AppError("Evaluation of this talent is already created.", 400)
            );
          } else {
            return next(new AppError("Some Error Occurred", 500));
          }
        }
        res.status(200).json({
          status: "success",
          message: "Talent profile Approved by Admin Successfully!",
        });
      }
    );
  } else {
    await Evaluation.create(
      {
        talent: req.params.id,
        videoInterview: {
          result: "pending",
        },
      },
      function (err, result) {
        if (err) {
          if (err.name == "MongoError" && err.code == 11000) {
            return next(
              new AppError("Evaluation of this talent is already created.", 400)
            );
          } else {
            return next(new AppError("Some Error Occurred", 500));
          }
        }
        res.status(200).json({
          status: "success",
          message: "Talent profile Approved by Admin Successfully!",
        });
      }
    );
  }
});

exports.getSubmittedTalentProfiles = catchAsync(async (req, res, next) => {
  const allTalents = await Talent.find({
    currentStatus: "profile-submitted-for-approval",
  });

  res.status(200).json({
    status: "success",
    length: allTalents.length,
    result: allTalents,
  });
});

exports.contactTalent = catchAsync(async (req, res, next) => {
  // if (!req.body.notes) {
  //   return next(new AppError('An Error Occurred.', 404));
  // } else {
  let talent = await Talent.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        contactInfo: {
          date: Date.now(),
          admin: req.user.id,
          notes: req.body.notes,
        },
      },
    },
    { new: true }
  );
  if (!talent) {
    return next(new AppError("No Talent found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    message: "Message sent to Talent Successfully",
  });
  // }
});

exports.removeContactInfo = catchAsync(async (req, res, next) => {
  let result = await Talent.findOneAndUpdate(
    {
      _id: req.body.talentId,
    },
    {
      $pull: {
        contactInfo: {
          _id: req.params.id,
        },
      },
    }
  );
  if (!result) {
    return next(new AppError("No record found with that ID", 404));
  }

  let deletedRecord = result.contactInfo.find(
    (contactInfo) => contactInfo._id == req.params.id
  );
  if (deletedRecord) {
    res.status(202).json({
      status: "success",
      message: "Contact Information deleted Successfully!",
    });
  } else {
    return next(new AppError("Incorrect ID", 404));
  }
});

exports.changeTalentStatus = catchAsync(async (req, res, next) => {
  let talent = await Talent.findByIdAndUpdate(
    req.params.id,
    {
      profileStatus: req.body.profileStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!talent) {
    return next(new AppError("No record found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    message: `Talent profile status changes to '${req.body.profileStatus}'.`,
  });
});

exports.getTalentCountByStatus = catchAsync(async (req, res, next) => {
  const talentStatus = [
    "profile-not-completed",
    "profile-submitted-for-approval",
    "video-interview-pending",
    "video-interview-fail",
    "coding-challenge-pending",
    "coding-challenge-fail",
    "talent-accepted",
  ];
  const availabilityStatus = [
    "live",
    "inactive"
  ];
  const results = [
    "talentRegistered",
    "talentProfileSubmitted",
    "videoInterviewPending",
    "videoInterviewFail",
    "codingChallengePending",
    "codingChallengeFail",
    "talentAccepted",
    "live",
    "inactive",
  ];
  // let finalResults = [];
  let formattedResult = new Object();
  for (let i = 0; i < talentStatus.length; i++) {
    let allTalents = await Talent.find({ currentStatus: talentStatus[i] });
    formattedResult[results[i]] = allTalents.length * 1;
  }

  for (let i = 0; i < availabilityStatus.length; i++) {
    let allTalents = await Talent.find({ availabilityStatus: availabilityStatus[i] });
    formattedResult[results[i + 7]] = allTalents.length * 1;
  }
  res.status(200).json({
    status: "success",
    result: formattedResult,
  });
});

exports.getTalentCompanySuggestions = catchAsync(async (req, res, next) => {
  let suggestions = await SuggestedCompany.find({
    talentId: req.params.id,
  });

  if (suggestions.length == 0) {
    res.status(200).json({
      status: "success",
      message: `No result found`,
    });
  } else {
    res.status(200).json({
      status: "success",
      result: suggestions,
    });
  }
});
