const catchAsync = require('../../utils/catch-async.js');
const AppError = require('../../utils/app-error-handler');
const Talent = require('../models/talent-model');
const Company = require('../../company/models/company');
const fs = require('fs')
const mongoose = require('mongoose');


exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.user.id == req.params.id) {
    if (req.file) req.body.profileImage = req.file.filename;
    const talent = await Talent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!talent) {
      return next(new AppError('No record found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: talent,
      message: "Talent Profile updated Successfully!"
    });

  } else {
    return next(new AppError('You have not permission to edit this user.', 404));
  }

});


exports.preferredRoles = catchAsync(async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, {
    "preferredRoles": req.body
  }, { new: true });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: talent.preferredRoles,
    message: "Talent Preferred roles updated Successfully!"
  });

});

exports.languages = catchAsync(async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, {
    "languages": req.body.languages
  }, { new: true });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: talent.languages,
    message: "Talent languages updated Successfully!"
  });

});


exports.updateEngagementPreferences = catchAsync(async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, {
    "salary": req.body.salary,
    "employmentType": req.body.employmentType,
    "workingHours": req.body.workingHours,
    "timezone": req.body.timezone,
    "currency": req.body.currency,
    // "contractType": req.body.contractType,

  }, { new: true });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: "Engagement Preferences of Talent updated Successfully!"
  });

});


exports.updateCompanyPreferences = async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, {
    "companyPreferences": req.body
  }, { new: true });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: talent.companyPreferences,
    message: "Company Preferences of Talent updated Successfully!"
  });

};


exports.updateWorkplaceFeatures = async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, {
    "workplaceFeatures": req.body
  }, { new: true });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: talent.workplaceFeatures,
    message: "Workplace Features of Talent updated Successfully!"
  });

};

exports.updateTimezoneAndCurrency = async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, {
    "timezone": req.body.timezone,
    "currency": req.body.currency
  }, { new: true });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: "Talent timezone and currency info updated Successfully!"
  });

};

exports.updateAvailabilityStatus = async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: "Talent status updated Successfully!"
  });

};

exports.addWorkExperience = async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate({ _id: req.user.id },
    {
      $push: {
        workExperience: req.body
      }
    },
    { new: true });
  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: talent.workExperience,
    message: "Talent Work Experience added Successfully!"
  });
};

exports.editWorkExperience = catchAsync(async (req, res, next) => {

  var updatedWorkExperience = new Object();

  Object.keys(req.body).forEach((value, key) => {
    var keys = "workExperience.$." + value;
    updatedWorkExperience[keys] = req.body[value];
  });

  let workExperience = await Talent.findOneAndUpdate(
    { "_id": req.user.id, "workExperience._id": req.params.id },
    {
      "$set": updatedWorkExperience
    }, { new: true });

  if (workExperience) {
    res.status(200).json({
      status: 'success',
      result: workExperience.workExperience,
      message: "Talent Work Experience edited Successfully!"
    });
  } else {
    return next(new AppError('No record found with that ID', 404));

  }

});

exports.getWorkExperience = async (req, res, next) => {
  await Talent.findOne({ _id: req.user.id }).select({
    workExperience: 1
  }).then(result => {
    if (result.workExperience.length == 0) {
      res.status(200).json({
        status: 'success',
        message: 'No Result Found!'
      });
    } else {
      res.status(200).json({
        status: 'success',
        result: result
      });
    }
  })
};

exports.deleteWorkExperience = async (req, res, next) => {
  let paramId = req.params.id
  let result = await Talent.findOneAndUpdate(
    {
      _id: req.user.id
    },
    {
      $pull: {
        workExperience: {
          _id: req.params.id
        }
      }
    });
  if (!result) {
    return next(new AppError('No record found with that ID', 404));
  }

  let deletedRecord = result.workExperience.find(experience => experience._id == paramId);
  if (deletedRecord) {
    res.status(202).json({
      status: 'success',
      message: "Talent Work Experience deleted Successfully!"
    });
  } else {
    return next(new AppError('Incorrect ID', 404));
  }

}

function sendResponse(res, statusCode, status, result, message) {
  if (result == null) {
    res.status(statusCode).json({
      status: status,
      message: message
    });
  } else {
    res.status(statusCode).json({
      status: status,
      result: result,
      message: message
    });
  }

}


exports.getTalentEducation = async (req, res, next) => {
  await Talent.findOne({ _id: req.user.id }).select({
    education: 1
  }).then(result => {
    if (result.education.length == 0) {
      res.status(200).json({
        status: 'success',
        message: 'No Result Found!'
      });
    } else {
      res.status(200).json({
        status: 'success',
        result: result
      });
    }
  })
};

exports.addTalentEducation = catchAsync(async (req, res, next) => {
  if (req.body.selfTaught == true) {
    let updatedTalent = await Talent.findByIdAndUpdate(req.user.id, {
      "selfTaught": req.body.selfTaught,
      "education": []
    }, { new: true });
    if (!updatedTalent) {
      return next(new AppError('No record found with that ID', 404));
    }
    sendResponse(res, 200, 'success', null, "Talent Education Details Updated Successfully!")
  } else {
    let talent = await Talent.findByIdAndUpdate({ _id: req.user.id },
      {
        $push: {
          education: req.body
        },
        "selfTaught": false
      },
      { new: true });
    if (!talent) {
      return next(new AppError('No record found with that ID', 404));
    }
    sendResponse(res, 200, 'success', talent.education, "Talent Education Details Added Successfully!")
  }

});

exports.editTalentEducation = catchAsync(async (req, res, next) => {

  var updatedTalentEducation = new Object();

  Object.keys(req.body).forEach((value, key) => {
    var keys = "education.$." + value;
    updatedTalentEducation[keys] = req.body[value];
  });

  let talentEducation = await Talent.findOneAndUpdate(
    { "_id": req.user.id, "education._id": req.params.id },
    {
      "$set": updatedTalentEducation
    }, { new: true });

  if (talentEducation) {
    sendResponse(res, 200, 'success', talentEducation.education, "Talent Education Details Edited Successfully!")
  } else {
    return next(new AppError('No record found with that ID', 404));
  }

});

exports.deleteTalentEducation = async (req, res, next) => {
  let paramId = req.params.id
  let result = await Talent.findOneAndUpdate(
    {
      _id: req.user.id
    },
    {
      $pull: {
        education: {
          _id: req.params.id
        }
      }
    });
  if (!result) {
    return next(new AppError('No record found with that ID', 404));
  }

  let deletedRecord = result.education.find(education => education._id == paramId);
  if (deletedRecord) {
    sendResponse(res, 202, 'success', null, "Talent Education Details deleted Successfully!")
  } else {
    return next(new AppError('Incorrect ID', 404));
  }

}


exports.uploadCV = catchAsync(async (req, res, next) => {
  console.log('File:', req.file)
  if (req.file) {
    req.body.resume = req.file.filename;
    req.body.dontHaveResume = false;
  }
  if (req.body.dontHaveResume == true) {
    req.body.dontHaveResume = true;
  }

  const talent = await Talent.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: talent,
    message: "Talent Profile updated Successfully!"
  });

});


exports.removeCV = async (req, res, next) => {
  if (req.body.resume == "") {
    let talent = await Talent.findById(req.user.id);
    if (!talent) {
      return next(new AppError('No record found with that ID', 404));
    }
    if (talent.resume && talent.resume != "") {
      const path = talent.resume;
      console.log('path', path);
      fs.unlink(path, (err) => {
        if (err) {
          console.log('error', err)
          return
        }
        console.log('file deleted');
      })
    }

  }
  await Talent.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(202).json({
    status: 'success',
    message: "Talent resume deleted Successfully!"
  });
};



exports.submitProfile = catchAsync(async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, {
    "currentStatus": 'profile-submitted-for-approval'
  }, { new: true });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: "You Profile has been submitted for review!"
  });

});


exports.talentProfileCompleted = catchAsync(async (req, res, next) => {

  const talent = await Talent.findByIdAndUpdate(req.user.id, {
    "currentStatus": 'profile-completed'
  }, { new: true });

  if (!talent) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    // message: "You current status is changed submitted to profile-completed!"
  });

});


exports.blockedACompany = catchAsync(async (req, res, next) => {
  let talentBlockedCompanies = await Talent.findById(req.user.id);
  if (!talentBlockedCompanies) {
    return next(new AppError('No record found with that ID', 404));
  }
  let blockCompanyFlag = false;
  if (req.body.companyId && talentBlockedCompanies.blockedCompanies.length > 0) {
    let companyID = req.body.companyId;
    talentBlockedCompanies.blockedCompanies.map(element => {
      if (element.companyId.toString() == companyID) {
        blockCompanyFlag = true;
      }
    })
  }
  if (blockCompanyFlag == true) {
    return next(new AppError('Company already exists in block list.', 404));
  }
  if (blockCompanyFlag == false) {
    const talent = await Talent.findByIdAndUpdate({ _id: req.user.id },
      {
        $push: {
          blockedCompanies: req.body
        }
      },
      { new: true });


    res.status(200).json({
      status: 'success',
      result: talent.blockedCompanies,
      message: "Company added in blocked list Successfully!"
    });

  }

});

exports.removeBlockedCompany = catchAsync(async (req, res, next) => {
  let paramId = req.params.id
  let result = await Talent.findOneAndUpdate(
    {
      _id: req.user.id
    },
    {
      $pull: {
        blockedCompanies: {
          _id: req.params.id
        }
      }
    });
  if (!result) {
    return next(new AppError('No record found with that ID', 404));
  }

  let deletedRecord = result.blockedCompanies.find(company => company._id == paramId);
  if (deletedRecord) {
    res.status(202).json({
      status: 'success',
      message: "Company removed from blocked list Successfully!"
    });
  } else {
    return next(new AppError('Incorrect ID', 404));
  }

});

exports.getAllCompanies = catchAsync(async (req, res, next) => {
  let result = await Company.find().select('name -industries -size -companyFeatures -accountManager');
  if (result.length == 0) {
    res.status(200).json({
      status: 'success',
      message: 'No company found',
    });
  } else {
    res.status(200).json({
      status: 'success',
      result: result,
    });

  }

});
