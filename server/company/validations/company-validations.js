const { check } = require('express-validator');

module.exports = {
  // POST /api/company/register
  register: [
    check('name', 'Company name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('phone', 'please enter a valid phone number').isMobilePhone('any')
],

  //POST /api/company/login
  login: [
    check('email', 'Please include a valid email')
      .isEmail(),
    check('password', 'Password is required')
      .exists()
  ],

};
