const express = require('express');
const talentRoutes = require('./talent-routes');

const router = express.Router();

router.use('/', talentRoutes);

module.exports = router;