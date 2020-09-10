const catchAsync = require("../../utils/catch-async.js");
const AppError = require("../../utils/app-error-handler");
const Evaluation = require("../../talent/models/evaluation-model");
const Talent = require("../../talent/models/talent-model");

async function getEvaluationByTalentId(talentId, next) {
  let result = await Evaluation.findOne({ talent: talentId });
  if (!result) {
    return next(new AppError("No Evaluation Details Found .", 404));
  } else {
    return result;
  }
}

exports.getTalentEvaluation = catchAsync(async (req, res, next) => {
  let evaluation = await Evaluation.findOne({
    talent: req.params.talentId
  });
  if (!evaluation) {
    res.status(200).json({
      status: "success",
      message: "No evaluation record found of that Talent."
    });
  } else {
    res.status(200).json({
      status: "success",
      data: evaluation
    });
  }

});

exports.updateCodingChallengeStep = catchAsync(async (req, res, next) => {
  let talent = await Talent.findById(req.params.id);
  let evaluation = await getEvaluationByTalentId(req.params.id, next);

  if (talent.availabilityStatus == "live") {
    if (talent.isDeveloper) {
      if (evaluation.videoInterview.isCompleted == true && evaluation.videoInterview.result == 'pass') {
        let evaluation = await getEvaluationByTalentId(req.params.id, next);
        let talentEvaluationId = evaluation._id;

        let updatedCodingChallenge = new Object();
        Object.keys(req.body).forEach(key => {
          var keys = "codingChallenge." + key;
          updatedCodingChallenge[keys] = req.body[key];
        });

        let codingChallengeId = evaluation.codingChallenge._id;

        await Evaluation.findOneAndUpdate(
          { _id: talentEvaluationId, "codingChallenge._id": codingChallengeId },
          {
            lastUpdatedBy: req.user.id,
            $set: updatedCodingChallenge
          },
          { new: true }
        );
        let date = new Date()
        if (req.body.result && req.body.result == 'pass') {
          await Talent.findByIdAndUpdate(req.params.id, {
            "currentStatus": 'talent-accepted',
            "codingChallengePassedDate": date,
            "codingChallengeFailedDate": null,
            "talentAcceptedDate": date,
          });
        }
        if (req.body.result && req.body.result == 'fail') {
          await Talent.findByIdAndUpdate(req.params.id, {
            "currentStatus": 'coding-challenge-fail',
            "codingChallengeFailedDate": date,
            "codingChallengePassedDate": null,
          });
        }
        if (req.body.result && req.body.result == 'pending') {
          await Talent.findByIdAndUpdate(req.params.id, {
            "currentStatus": 'coding-challenge-pending'
          });
        }

        res.status(200).json({
          status: "success",
          message: "Coding challenge Step updated Successfully!"
        });
      } else if (evaluation.videoInterview.result == 'fail') {
        return next(new AppError("Your Video Interview result is 'Fail'. You can not perform Coding Challenge.", 400));
      } else {
        return next(new AppError("You can not perform Coding Challenge. Please make sure  you've passed your Video Interview.", 400));
      }
    } else {
      return next(new AppError("Coding Challenge is only for those talents whose role is developer", 400));
    }

  } else {
    return next(new AppError("Please change talent availability Status from 'inactive' to  'live' from talent's profile.", 400));
  }
});

async function updateVideoInterview(evaluation, talent, req, res, next) {

  let talentEvaluationId = evaluation._id;
  if (talent.availabilityStatus == "live") {

    let updatedVideoInterview = new Object();
    Object.keys(req.body).forEach(key => {
      var keys = "videoInterview." + key;
      updatedVideoInterview[keys] = req.body[key];
    });

    let videoInterviewId = evaluation.videoInterview._id;

    await Evaluation.findOneAndUpdate(
      {
        _id: talentEvaluationId,
        "videoInterview._id": videoInterviewId
      },
      {
        lastUpdatedBy: req.user.id,
        $set: updatedVideoInterview
      },
      { new: true }
    );
    let date = new Date()

    if (req.body.result && req.body.result == 'pass') {
      if (talent.isDeveloper == true) {
        await Talent.findByIdAndUpdate(req.params.id, {
          "currentStatus": 'coding-challenge-pending',
          "videoInterviewPassedDate": date,
          "videoInterviewFailedDate": null,
        });

      } else {
        await Talent.findByIdAndUpdate(req.params.id, {
          "currentStatus": 'talent-accepted',
          "videoInterviewPassedDate": date,
          "talentAcceptedDate": date,
          "videoInterviewFailedDate": null,
        });

      }
    }
    if (req.body.result && req.body.result == 'fail') {
      await Talent.findByIdAndUpdate(req.params.id, {
        "currentStatus": 'video-interview-fail',
        "videoInterviewFailedDate": date,
        "videoInterviewPassedDate": null,
      });
    }
    if (req.body.result && req.body.result == 'pending') {
      await Talent.findByIdAndUpdate(req.params.id, {
        "currentStatus": 'video-interview-pending'
      });
    }

    res.status(200).json({
      status: "success",
      message: "Video Interview Step updated Successfully!"
    });

  } else {
    return next(new AppError("Please change talent availability Status from 'inactive' to  'live' from talent's profile.", 400));
  }


}

exports.updateVideoInterviewStep = catchAsync(async (req, res, next) => {
  let evaluation = await getEvaluationByTalentId(req.params.id, next);
  let talent = await Talent.findById(req.params.id);

  // if (talent.isDeveloper == true) {
  //   if (evaluation.codingChallenge.isCompleted == true && evaluation.codingChallenge.result == 'pass') {
  //     updateVideoInterview(evaluation, talent, req, res, next)
  // } else if (evaluation.codingChallenge.result == 'fail') {
  //   return next(new AppError("Your coding challenge result is 'Fail'. You can not schedule your meeting with Talent Manager.", 400));
  // } else {
  //   return next(new AppError("You can not schedule your video interview. Please complete your coding challenge first. ", 400));
  // }
  // }
  if (talent.profileApproved.status == true) {
    updateVideoInterview(evaluation, talent, req, res, next)
  } else {
    return next(new AppError("You can not schedule video interview. Please approve talent profile first. ", 400));
  }

});




