const { check } = require('express-validator');

module.exports = {

  register: [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'please enter a password with 6 or more characters').isLength({ min: 6 })
],


login: [
    check('email', 'Please enter a valid email')
      .isEmail(),
    check('password', 'Password is required')
      .exists()
  ],

};
