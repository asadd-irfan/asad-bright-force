const express = require('express');
const adminRoutes = require('./admin-routes');
const companyRoutes = require('./company-routes');

const router = express.Router();

router.use('/', adminRoutes);
router.use('/', companyRoutes);

module.exports = router;