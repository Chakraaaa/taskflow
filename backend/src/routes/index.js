const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');
const dbController = require('../controllers/db.controller');

router.get('/health', healthController.check);
router.get('/db/test', dbController.test);

module.exports = router;

