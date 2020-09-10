const { check } = require('express-validator');

const AppConfig = require('../../admin/models/app-config-model');

validateAppConfigType = async (type, reqData) => {

  let result = await AppConfig.find({
    'type': type,
    '_id': { $in: reqData }
  });
  if (reqData.length == result.length) {
    return true
  } else {
    return false
  }

}

module.exports = {
  // POST /api/talent/register
  register: [
    check('name', 'Full name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'please enter a password with 8 or more characters').isLength({ min: 8 })
  ],

  //POST /api/talent/login
  login: [
    check('email', 'Please include a valid email')
      .isEmail(),
    check('password', 'Password is required')
    .exists()
  ],

  preferredRole: [
    check('selectedRoles', 'select preferred roles maximum 3')
      .isArray({ min: 1, max: 3 }),
    // check('roleId').custom(value => {
    //     return validateAppConfigType('roles', value).then(exist => {
    //       if (!exist) {
    //         return Promise.reject('Some values have invalid ref ID in roles');
    //       }
    //     })
    //   })
  ],

  companyPreferences: [
    check('industryPreference').custom(value => {
      return validateAppConfigType('industry-preference', value).then(exist => {
        if (!exist) {
          return Promise.reject('Some values have invalid ref ID in industry-preference');
        }
      })
    }),
    check('companySize').custom(value => {
      return validateAppConfigType('company-size', value).then(exist => {
        if (!exist) {
          return Promise.reject('Some values have invalid ref ID in company-size');
        }
      })
    }),
  ],

  engagementPreferences: [
    check('employmentType').custom(value => {
      return validateAppConfigType('employment-type', value).then(exist => {
        if (!exist) {
          return Promise.reject('Some values have invalid ref ID in employment-type');
        }
      })
    }),
  ],


  


};