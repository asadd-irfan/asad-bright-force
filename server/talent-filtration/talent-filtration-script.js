const AppError = require('../utils/app-error-handler');
const Positions = require('../company/models/positions');
const Talent = require('../talent/models/talent-model');
const PositionCandidate = require('../admin/models/position-candidates');
const AppConfigs = require('../admin/models/app-config-model');
const Company = require('../company/models/company');
// const Notifications = require('../admin/models/notification-messages');
const NotificationSubscribers = require('../admin/models/notification-subscribers');
const notifications = require('../common/notifications');
// const moment = require('moment');
var moment = require('moment-timezone');

const getTimezoneName = async (id) => {
  let timezone = await AppConfigs.findById(id)
  return timezone.name;
}

const getPositionEntityWeight = async (array, weight) => {
  for (let i = 0; i < array.length; i++) {
    let value = await AppConfigs.findById(array[i])
    weight = weight + value.weight;
  }
  return weight;
}
const getConfigWeight = async (weight, configName) => {
  let res = await AppConfigs.findOne({ type: 'coefficient', name: configName })
  weight = res.weight;
  return weight;
}
const calculateScore = async (arr1, arr2, totalWeight, configWeight) => {
  let matchedSkills = [];
  arr1.map(element => {
    let res = arr2.find(el => el.toString() == element.toString());
    if (res) {
      matchedSkills.push(res);
      return res;
    }
  })

  if (matchedSkills.length != 0) {
    let result = 0;
    for (let i = 0; i < matchedSkills.length; i++) {
      let config = await AppConfigs.findById(matchedSkills[i])
      result = result + config.weight;
    }
    let score = ((result / totalWeight) * configWeight);
    return score;
  } else {
    return 0;
  }
}

const convertToUTC = (workingHour, timezone) => {
  let date = moment().format("YYYY-MM-DD");
  let time;
  if (0 <= parseInt(workingHour) && parseInt(workingHour) <= 9) {
    time = date + " 0" + workingHour + ":00"
  } else {
    time = date + " " + workingHour + ":00"
  }
  let momentTime = moment.tz(time, timezone).format();
  let UTCtime = moment(momentTime).utc().format('HH:mm');
  let hourValue = parseInt(UTCtime.split(":")[0]);
  return hourValue;
}

const calculateOverlapTimes = (startHour, endHour) => {

  let timeArray = [];
  if (startHour < endHour) {
    for (let i = startHour + 1; i <= endHour; i++) {
      timeArray.push(i)
    }
  } else {
    for (let i = startHour + 1; i <= 23; i++) {
      timeArray.push(i)
    }
    for (let i = 0; i <= endHour; i++) {
      timeArray.push(i)
    }
  }
  // console.log('timeArray', timeArray)
  return timeArray



}

const filterTalentsForPositions = async (positionId) => {
  try {
    let position = await Positions.findById(positionId);
    let mainRole = position.name._id;

    let paramsObj = {
      "role": mainRole,
      "groupConfigs": position.groupConfigs,
      // "jobSearchStatus": "actively-looking"
    };
    let company = await Company.findById(position.companyId._id);

    let industries = [];
    let companySize = [];
    let techStack = [];
    let companyValues = [];
    let companyFeatures = [];

    if (company.industries.length > 0) {
      company.industries.map(el => {
        industries.push(el._id)
      });
      paramsObj = {
        ...paramsObj,
        "industry": industries
      }
    }
    if (company.size) {
      let size = company.size._id;
      companySize.push(size);
      paramsObj = {
        ...paramsObj,
        "companySize": companySize
      }

    }
    // if (company.technologiesUsed.length > 0) {
    //   company.technologiesUsed.map(el => {
    //     techStack.push(el._id)
    //   });
    //   paramsObj = {
    //     ...paramsObj,
    //     "techStack": techStack
    //   }
    // }
    if (company.companyValues.length > 0) {
      company.companyValues.map(el => {
        companyValues.push(el._id)
      });
      paramsObj = {
        ...paramsObj,
        "companyValues": companyValues
      }
    }
    if (company.companyFeatures.length > 0) {
      company.companyFeatures.map(el => {
        companyFeatures.push(el._id)
      });
      paramsObj = {
        ...paramsObj,
        "companyFeatures": companyFeatures
      }
    }

    let positionSkills = [];
    let employmentType = [];
    let positionFeatures = [];
    let managementExp, salary, currency, positionRole;

    if (position.role && position.role.name) {
      positionRole = position.role.name._id;
      paramsObj = {
        ...paramsObj,
        "positionRole": positionRole,
      }
      if (position.role.yearsOfExperience) {
        paramsObj = {
          ...paramsObj,
          "roleYearOfExp": position.role.yearsOfExperience
        }
      }
    }
    if (position.managementExperience.status == true || position.managementExperience.status == false) {
      managementExp = position.managementExperience.status;
      paramsObj = {
        ...paramsObj,
        "managementExp": managementExp
      }
      if (position.managementExperience.yearsOfExperience) {
        paramsObj = {
          ...paramsObj,
          "managementYearOfExp": position.managementExperience.yearsOfExperience
        }
      }

    }
    // if (position.positionOffer.salary && position.positionOffer.currency) {
    //   salary = position.positionOffer.salary;
    //   currency = position.positionOffer.currency;
    //   paramsObj = {
    //     ...paramsObj,
    //     "salary": salary,
    //     "currency": currency,
    //   }
    // }
    if (position.positionOffer.salary) {
      salary = position.positionOffer.salary;
      paramsObj = {
        ...paramsObj,
        "salary": salary
      }
    }
    if (position.positionFeatures.length > 0) {
      position.positionFeatures.map(el => {
        positionFeatures.push(el.feature)
      });
      paramsObj = {
        ...paramsObj,
        "positionFeatures": positionFeatures
      }
    }
    if (position.skills.length > 0) {
      positionSkills = position.skills;
      paramsObj = {
        ...paramsObj,
        "positionSkills": positionSkills,
      }
    }
    if (position.employmentType) {
      let empType = position.employmentType._id.toString();
      employmentType.push(empType);
      paramsObj = {
        ...paramsObj,
        "employmentType": employmentType,
      }
    }
    // if (position.workingHours && position.workingTimeFlexibility && position.timezone) {
    if (position.workingTimeFlexibility && position.timezone) {
      paramsObj = {
        ...paramsObj,
        // "workingHours": position.workingHours,
        "workingTimeFlexibility": position.workingTimeFlexibility,
        "timezone": position.timezone,
      }
    }
    // console.log('paramsObj::::', paramsObj);
    let finalResult = await filterTalents(paramsObj, positionId)

    // console.log('finalResult',finalResult.length)
    return finalResult;

  } catch (error) {
    console.log('error', error)
    return error;
  }

};

const filterTalents = async (paramsObject, positionId, next) => {
  let position = await Positions.findById(positionId);
  if (position && position.isDeleted == false) {

    // let salaryConfigWeight = 0, employmentTypeWeight = 0, employmentConfigWeight = 0;
    let managementExpConfigWeight = 0, managementYearOfExpWeight = 0, industryWeight = 0, industryConfigWeight = 0;
    let roleWeight = 0, rolesYearOfExpWeight = 0, positionSkillsWeight = 0, skillsConfigWeight = 0;
    let companySizeWeight = 0, companySizeConfigWeight = 0, techStackConfigWeight = 0;
    let positionFeaturesWeight = 0, positionFeaturesConfigWeight = 0, companyValuesWeight = 0, companyValuesConfigWeight = 0;
    let companyFeaturesWeight = 0, companyFeaturesConfigWeight = 0, salaryRangeConfigWeight = 0, secondaryRoleConfigWeight = 0;
    let positionTimezone, workFlexibilityWeight = 0, startTimeValue = 0, endTimeValue = 0;
    let jobStartingHourUTC, jobEndingHourUTC, jobTimeArray;

    let salaryRange = await AppConfigs.findOne({ 'type': 'configs', 'name': 'salary-range' })
    salaryRangeConfigWeight = salaryRange.weight;

    let secondaryRoleConfig = await AppConfigs.findOne({ 'type': 'configs', 'name': 'secondary-role-weight' })
    secondaryRoleConfigWeight = secondaryRoleConfig.weight;

    if (paramsObject.industry) {
      industryWeight = await getPositionEntityWeight(paramsObject.industry, industryWeight)
      industryConfigWeight = await getConfigWeight(industryConfigWeight, 'industry-preference')
    }

    if (paramsObject.companySize) {
      companySizeWeight = await getPositionEntityWeight(paramsObject.companySize, companySizeWeight)
      companySizeConfigWeight = await getConfigWeight(companySizeConfigWeight, 'company-size')
    }

    // if (paramsObject.techStack) {
    //   techStackConfigWeight = await getConfigWeight(techStackConfigWeight, 'tech-stack')
    // }

    if (paramsObject.companyValues) {
      companyValuesWeight = await getPositionEntityWeight(paramsObject.companyValues, companyValuesWeight)
      companyValuesConfigWeight = await getConfigWeight(companyValuesConfigWeight, 'company-values')
    }

    if (paramsObject.companyFeatures) {
      companyFeaturesWeight = await getPositionEntityWeight(paramsObject.companyFeatures, companyFeaturesWeight)
      companyFeaturesConfigWeight = await getConfigWeight(companyFeaturesConfigWeight, 'company-features')
    }


    if (paramsObject.positionRole) {
      roleWeight = await getConfigWeight(roleWeight, 'preferred-role')
    }
    if (paramsObject.roleYearOfExp) {
      rolesYearOfExpWeight = await getConfigWeight(rolesYearOfExpWeight, 'role-year-exp')
    }
    if (paramsObject.positionSkills) {
      positionSkillsWeight = await getPositionEntityWeight(paramsObject.positionSkills, positionSkillsWeight)
      skillsConfigWeight = await getConfigWeight(skillsConfigWeight, 'skills')
    }
    if (paramsObject.managementExp == true || paramsObject.managementExp == false) {
      managementExpConfigWeight = await getConfigWeight(managementExpConfigWeight, 'management-experience')
    }
    if (paramsObject.managementYearOfExp) {
      managementYearOfExpWeight = await getConfigWeight(managementYearOfExpWeight, 'management-year-exp')
    }
    if (paramsObject.positionFeatures) {
      positionFeaturesWeight = await getPositionEntityWeight(paramsObject.positionFeatures, positionFeaturesWeight)
      positionFeaturesConfigWeight = await getConfigWeight(positionFeaturesConfigWeight, 'role-features')
    }
    if (paramsObject.workingTimeFlexibility && paramsObject.timezone) {
      positionTimezone = await getTimezoneName(paramsObject.timezone)

      let flexibilityConfig = await AppConfigs.findOne({ type: 'configs', name: paramsObject.workingTimeFlexibility })
      let startTimeConfig = await AppConfigs.findOne({ type: 'configs', name: 'job-start-time' })
      let endTimeConfig = await AppConfigs.findOne({ type: 'configs', name: 'job-end-time' })

      workFlexibilityWeight = flexibilityConfig.weight;
      startTimeValue = startTimeConfig.weight;
      endTimeValue = endTimeConfig.weight;

      jobStartingHourUTC = convertToUTC(startTimeValue, positionTimezone)
      jobEndingHourUTC = convertToUTC(endTimeValue, positionTimezone)
      jobTimeArray = calculateOverlapTimes(jobStartingHourUTC, jobEndingHourUTC)

    }

    // if (paramsObject.timezone) {
    //   positionTimezone = await getTimezoneName(paramsObject.timezone)
    // }

    // if (paramsObject.workingHours) {
    //   jobStartingHourUTC = convertToUTC(paramsObject.workingHours.startingHour, positionTimezone)
    //   jobEndingHourUTC = convertToUTC(paramsObject.workingHours.endingHour, positionTimezone)
    //   jobTimeArray = calculateOverlapTimes(jobStartingHourUTC, jobEndingHourUTC)
    // }


    const compareArray = (arr1, arr2) => {
      return arr1.some(el => arr2.includes(el.toString()))
    }

    let allTalents = await Talent.find({ currentStatus: 'talent-accepted', role: paramsObject.role, availabilityStatus: 'live' }).lean();
    // console.log('allTalents', allTalents.length);
    if (allTalents.length == 0) {
      return allTalents;
    }

    let talents = [];
    talents = allTalents;

    if (paramsObject.employmentType) {
      talents = talents.filter((element) => {
        if (compareArray(element.employmentType, paramsObject.employmentType) == true) {
          return element;
        }
      })
    }

    if (paramsObject.salary) {
      let variantSalary = paramsObject.salary + (paramsObject.salary * salaryRangeConfigWeight)

      talents = talents.filter((element) => {
        if ((element.salary && element.salary.minSalary) && (element.salary.minSalary <= variantSalary)) {
          return element;
        }
      })
    }

    // if (paramsObject.jobSearchStatus && paramsObject.jobSearchStatus != 'not-looking') {
    //   talents = talents.filter((element) => {
    //     if (element.jobSearchStatus && element.jobSearchStatus != 'not-looking') {
    //       return element;
    //     }
    //   })
    // }

    // if (paramsObject.workingTimeFlexibility && paramsObject.workingHours && paramsObject.timezone) {
    if (paramsObject.workingTimeFlexibility && paramsObject.timezone) {
      let totalTalents = talents.length;

      let talentsWithTimezone = [];
      for (let i = 0; i < totalTalents; i++) {
        let talentTimezone;
        if (talents[i].timezone) {
          talentTimezone = await getTimezoneName(talents[i].timezone);
        } else {
          talentTimezone = null;
        }
        var obj = Object.assign({}, talents[i]);
        obj.talentTimezone = talentTimezone;
        talentsWithTimezone.push(obj)

      }

      talents = talentsWithTimezone.filter((element) => {

        if (paramsObject.workingTimeFlexibility == 'very-flexible') {
          return element;
        } else {
          if (element.workingHours && element.workingHours.startingHour && element.workingHours.endingHour) {
            // console.log('element.workingHours', element.workingHours);

            let talentStartingHourUTC = convertToUTC(element.workingHours.startingHour, element.talentTimezone)
            let talentEndingHourUTC = convertToUTC(element.workingHours.endingHour, element.talentTimezone)
            let talentTimeArray = calculateOverlapTimes(talentStartingHourUTC, talentEndingHourUTC)

            let overlap;
            if (talentTimeArray.length > jobTimeArray.length) {
              overlap = talentTimeArray.filter(value => jobTimeArray.includes(value))
            } else {
              overlap = jobTimeArray.filter(value => talentTimeArray.includes(value))
            }

            if (overlap.length >= workFlexibilityWeight) {
              return element;
            }
          }

        }
      })
    }

    // let talents = talentsWithTimezone.filter((element) => {
    //   // let salaryFlag = false,employmentTypeFlag = false, jobSearchFlag = false, timezoneFlag = false;

    //   if (!paramsObject.salary && !paramsObject.employmentType && !paramsObject.jobSearchStatus
    //     && !paramsObject.workingTimeFlexibility && !paramsObject.workingHours && !paramsObject.timezone) {
    //     return element;
    //   }

    //   if (paramsObject.workingTimeFlexibility && paramsObject.workingHours && paramsObject.timezone
    //     && element.workingHours && element.talentTimezone) {

    //     if (paramsObject.workingTimeFlexibility == 'very-flexible') {
    //       return element;
    //     } else {

    //       let talentStartingHourUTC = convertToUTC(element.workingHours.startingHour, element.talentTimezone)
    //       let talentEndingHourUTC = convertToUTC(element.workingHours.endingHour, element.talentTimezone)
    //       let talentTimeArray = calculateOverlapTimes(talentStartingHourUTC, talentEndingHourUTC)

    //       let overlap;
    //       if (talentTimeArray.length > jobTimeArray.length) {
    //         overlap = talentTimeArray.filter(value => jobTimeArray.includes(value))
    //       } else {
    //         overlap = jobTimeArray.filter(value => talentTimeArray.includes(value))
    //       }

    //       if (overlap.length >= workFlexibilityWeight) {
    //         return element;
    //       }

    //     }

    //   }

    //   if (paramsObject.salary && element.salary.minSalary) {
    //     let variantSalary = paramsObject.salary + (paramsObject.salary * salaryRangeConfigWeight)
    //     if (element.salary.minSalary <= variantSalary) {
    //       return element;
    //     }
    //   }
    //   if (paramsObject.employmentType) {
    //     if (compareArray(element.employmentType, paramsObject.employmentType) == true) {
    //       return element;
    //     }
    //   }
    //   if (paramsObject.jobSearchStatus && element.jobSearchStatus) {
    //     if (element.jobSearchStatus != 'not-looking' && paramsObject.jobSearchStatus != 'not-looking') {
    //       return element;
    //     }
    //   }

    // })

    // console.log('talents', talents.length);

    // // return talents;

    if (talents.length == 0) {
      return talents;
    }

    let result = [];
    for (let i = 0; i < talents.length; i++) {

      let score = 0;
      if (paramsObject.positionRole && talents[i].preferredRoles && talents[i].preferredRoles.mainRole && talents[i].preferredRoles.mainRole.name) {
        if (talents[i].preferredRoles.mainRole.name.toString() == paramsObject.positionRole.toString()) {
          // if role is equal to main role  giving full weightage
          score = score + roleWeight;
          if (paramsObject.roleYearOfExp && talents[i].preferredRoles && talents[i].preferredRoles.mainRole && talents[i].preferredRoles.mainRole.yearsOfExperience) {
            if (parseInt(talents[i].preferredRoles.mainRole.yearsOfExperience) < parseInt(paramsObject.roleYearOfExp)) {
              score = score + ((parseInt(talents[i].preferredRoles.mainRole.yearsOfExperience) / parseInt(paramsObject.roleYearOfExp)) * rolesYearOfExpWeight)
            } else {
              // if role yearsOfExperience is equal to main role yearsOfExperience giving full weightage
              score = score + rolesYearOfExpWeight
            }
          }
        } else if (talents[i].preferredRoles.secondaryRole && talents[i].preferredRoles.secondaryRole.name.toString() == paramsObject.positionRole.toString()) {
          // if role is equal to secondary role  giving half weightage
          score = score + (roleWeight / secondaryRoleConfigWeight);
          if (paramsObject.roleYearOfExp && talents[i].preferredRoles && talents[i].preferredRoles.secondaryRole && talents[i].preferredRoles.secondaryRole.yearsOfExperience) {
            if (parseInt(talents[i].preferredRoles.secondaryRole.yearsOfExperience) < parseInt(paramsObject.roleYearOfExp)) {
              score = score + (((parseInt(talents[i].preferredRoles.secondaryRole.yearsOfExperience) / parseInt(paramsObject.roleYearOfExp)) * rolesYearOfExpWeight) / secondaryRoleConfigWeight);
            } else {
              // if role yearsOfExperience is equal to secondary role yearsOfExperience giving half weightage
              score = score + (rolesYearOfExpWeight / secondaryRoleConfigWeight)
            }
          }
        }
      }

      if (paramsObject.managementExp == false) {
        score = score + managementExpConfigWeight;
        score = score + managementYearOfExpWeight;
      } else if ((paramsObject.managementExp == true && talents[i].preferredRoles && talents[i].preferredRoles.managementExperience.status == true)) {
        score = score + managementExpConfigWeight;
        if (parseInt(talents[i].preferredRoles.managementExperience.yearsOfExperience) <= parseInt(paramsObject.managementYearOfExp)) {
          score = score + ((parseInt(talents[i].preferredRoles.managementExperience.yearsOfExperience) / parseInt(paramsObject.managementYearOfExp)) * managementYearOfExpWeight)
        }
        else {
          score = score + managementYearOfExpWeight
        }
      }

      if (paramsObject.positionSkills && talents[i].preferredRoles && talents[i].preferredRoles.mainRole && talents[i].preferredRoles.mainRole.skills) {
        let talentSkills = talents[i].preferredRoles.mainRole.skills;
        let skills = paramsObject.positionSkills;
        let ans = await calculateScore(skills, talentSkills, positionSkillsWeight, skillsConfigWeight)
        score = score + ans;
      }

      if (paramsObject.industry && talents[i].companyPreferences && talents[i].companyPreferences.industryPreference) {
        let talentInd = talents[i].companyPreferences.industryPreference;
        let industry = paramsObject.industry;
        let ans = await calculateScore(industry, talentInd, industryWeight, industryConfigWeight)
        score = score + ans;
      }

      if (paramsObject.companySize && talents[i].companyPreferences && talents[i].companyPreferences.companySize) {
        let talentCompanySize = talents[i].companyPreferences.companySize;
        let companySize = paramsObject.companySize;
        let ans = await calculateScore(companySize, talentCompanySize, companySizeWeight, companySizeConfigWeight)
        score = score + ans;
      }

      // if (paramsObject.techStack && talents[i].preferredRoles && talents[i].preferredRoles.mainRole && talents[i].preferredRoles.mainRole.name) {
      //   let talentMainRole = talents[i].preferredRoles.mainRole.name.toString();
      //   let talentSecondaryRole;
      //   if (talents[i].preferredRoles.secondaryRole && talents[i].preferredRoles.secondaryRole.name) {
      //     talentSecondaryRole = talents[i].preferredRoles.secondaryRole.name.toString();
      //   }
      //   let techStack = paramsObject.techStack;
      //   for (let i = 0; i < techStack.length; i++) {
      //     if (techStack[i].toString() == talentMainRole || techStack[i].toString() == talentSecondaryRole) {
      //       score = score + techStackConfigWeight;
      //     }
      //   }

      // }

      if (paramsObject.positionFeatures && talents[i].workplaceFeatures && talents[i].workplaceFeatures.roleFeatures) {
        let talentRoleFeatures = talents[i].workplaceFeatures.roleFeatures;
        let talentRoleFeaturesArray = [];
        if (talentRoleFeatures.length != 0) {
          talentRoleFeatures.map(el => {
            talentRoleFeaturesArray.push(el.feature)
          })
        }
        let roleFeatures = paramsObject.positionFeatures;
        let ans = await calculateScore(roleFeatures, talentRoleFeaturesArray, positionFeaturesWeight, positionFeaturesConfigWeight)
        score = score + ans;
      }

      if (paramsObject.companyValues && talents[i].workplaceFeatures && talents[i].workplaceFeatures.companyValues) {
        let talentCompanyValues = talents[i].workplaceFeatures.companyValues;
        let talentCompanyValuesArray = [];
        if (talentCompanyValues.length != 0) {
          talentCompanyValues.map(el => {
            talentCompanyValuesArray.push(el.value)
          })
        }
        let companyValues = paramsObject.companyValues;
        let ans = await calculateScore(companyValues, talentCompanyValuesArray, companyValuesWeight, companyValuesConfigWeight)
        score = score + ans;

      }

      if (paramsObject.companyFeatures && talents[i].workplaceFeatures && talents[i].workplaceFeatures.companyFeatures) {
        let talentCompanyFeatures = talents[i].workplaceFeatures.companyFeatures;
        let talentCompanyFeaturesArray = [];
        if (talentCompanyFeatures.length != 0) {
          talentCompanyFeatures.map(el => {
            talentCompanyFeaturesArray.push(el.feature)
          })
        }
        let companyFeatures = paramsObject.companyFeatures;
        let ans = await calculateScore(companyFeatures, talentCompanyFeaturesArray, companyFeaturesWeight, companyFeaturesConfigWeight)
        score = score + ans;
      }

      if (paramsObject.groupConfigs.matchingScore <= score) {
        var obj = Object.assign({}, talents[i]);
        obj.score = Math.round(score);
        result.push(obj)
      }
      // console.log('score',score)

    }

    result.sort((talent1, talent2) => talent2.score - talent1.score);
    // console.log(result.length)

    let filterTalents = [];
    let finalResult = [];

    for (let i = 0; i < result.length; i++) {
      let res = await PositionCandidate.findOne({
        'position': positionId,
        'candidateId': result[i]._id,
        // $or: [{ status: { $eq: 'long-list' } }, { status: { $eq: 'short-list' } }, { status: { $eq: 'interview' } }]
      })
      if (!res) {
        filterTalents.push(result[i])
      }
    }
    // console.log(filterTalents.length)

    if (paramsObject.groupConfigs && paramsObject.groupConfigs.candidatesPerGroup) {
      let totalCandidatesPerGroup = paramsObject.groupConfigs.candidatesPerGroup
      for (let i = 0; i < totalCandidatesPerGroup; i++) {
        if (filterTalents[i]) {
          finalResult.push(filterTalents[i])
        }
      }

    }
    // console.log(filterTalents.length)

    return finalResult;
  } else {
    return next(new AppError('This Position is deleted.', 400));
  }

};


const processedTalentsForPosition = async (filteredTalents, positionId) => {

  let position = await Positions.findById(positionId);

  if (position.groupConfigs.candidatesPerGroup > filteredTalents.length) {

    let updatedPositionGroupsStatus = await Positions.findByIdAndUpdate(position._id, {
      "lastGroupStatus": 'action-required',
    }, { new: true });

    let obj = {
      message: `After the Filtering Process, the filtered Candidates are less than Candidates required per Group.
      Hence this Position's status is action required.`,
    };
    return obj;

  } else {
    let totalProcessedCandidates = [];
    filteredTalents.map(element => {
      totalProcessedCandidates.push({
        "candidateId": element._id, "position": positionId,
        "status": 'processed', "matchingScore": element.score,
      })
    });

    let insertedProcessedCandidates = await PositionCandidate.insertMany(totalProcessedCandidates);
    let date = new Date()

    let updatedPositionStatus = await Positions.findByIdAndUpdate(positionId, {
      "lastGroupStatus": 'processed',
      "lastProcessedDate": date,
    }, { new: true });

    let obj = {
      message: "Talent List Processed Successfully for position " + positionId,
    };
    return obj;

  }

};


const dispatchTalentsForPosition = async (processedTalents, positionId) => {

  let position = await Positions.findById(positionId);

  let totalDispatchCandidates = processedTalents.length;
  let date = new Date()
  let todayDate = new Date();

  let nextDispatchDate = new Date(date.setDate(new Date().getDate() + 3))
  let result;
  let groupId;

  let totalDispatchedGroups = position.totalDispatchedGroups;

  if (position.groupConfigs.totalGroups > totalDispatchedGroups) {
    if (position.groupConfigs.totalGroups == totalDispatchedGroups + 1) {
      result = await Positions.findByIdAndUpdate({ _id: positionId },
        {
          "lastGroupStatus": 'fulfilled',
          "nextDispatchedDate": nextDispatchDate,
          "totalDispatchedGroups": totalDispatchedGroups + 1,
          $push: {
            groupsInfo: {
              dispatchDate: todayDate,
              totalDispatchCandidates: totalDispatchCandidates
            }
          }
        },
        { new: true });
      // console.log(result.groupsInfo)
      groupId = result.groupsInfo[result.groupsInfo.length - 1]._id
    } else {
      result = await Positions.findByIdAndUpdate({ _id: positionId },
        {
          "lastGroupStatus": 'un-processed',
          "nextDispatchedDate": nextDispatchDate,
          "totalDispatchedGroups": totalDispatchedGroups + 1,
          $push: {
            groupsInfo: {
              dispatchDate: todayDate,
              totalDispatchCandidates: totalDispatchCandidates
            }
          }
        },
        { new: true });
      // console.log(result.groupsInfo)
      groupId = result.groupsInfo[result.groupsInfo.length - 1]._id
    }

    let deletedProcessedCandidates = await PositionCandidate.deleteMany(
      { "position": positionId, "status": 'processed' }
    );

    let dispatchedCandidates = [];
    processedTalents.map(element => {
      dispatchedCandidates.push({
        "groupId": groupId,
        "candidateId": element.id,
        "matchingScore": element.score,
        "position": positionId,
        "status": 'long-list'
      })
    });

    let insertedDispatchedCandidates = await PositionCandidate.insertMany(dispatchedCandidates);
    console.log("Talent List dispatched To Company Successfully!");
    let notificationMsgObj = {
      referenceLink: "/company/hire/recruitment/details/" + positionId,
      title: "New Batch of Talents is Available",
      description: "A new Batch of Talents is now available.",
      positionId: positionId,
      referenceTitle: "View Candidates List",
    }

    let notificationSubscriberObj = await NotificationSubscribers.findOne({ referenceId: positionId, event: 'hiring-team' });
    if (notificationSubscriberObj) {
      let response = await notifications.sendNotifications(notificationMsgObj, notificationSubscriberObj, null);
      if (response == false) {
        let errorMsg = {
          message: 'ERROR while sending notification',
        };
        return errorMsg;
      }
    } else {
      let errorMsg = {
        message: 'ERROR while sending notification',
      };
      return errorMsg;
    }


    let successMsg = {
      message: "Talent List dispatched To Company Successfully!",
    };
    return successMsg;

  } else {
    let errorMsg = {
      message: "Can not create more groups.",
    };
    return errorMsg;
  }

};


module.exports = { dispatchTalentsForPosition, processedTalentsForPosition, filterTalentsForPositions, filterTalents };
