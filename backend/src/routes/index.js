const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');
const dbController = require('../controllers/db.controller');
const testDbController = require('../controllers/testDb.controller');

router.get('/health', healthController.check);
router.get('/db/test', dbController.test);
router.get('/api/test-db', testDbController.testDb);

module.exports = router;

