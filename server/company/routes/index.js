const express = require('express');
const companyRoutes = require('./company-routes');

const router = express.Router();

router.use('/', companyRoutes);

module.exports = router;
