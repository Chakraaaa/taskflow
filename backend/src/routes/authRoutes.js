const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Routes d'authentification
 * Base path: /api/auth
 */

// POST /api/auth/register - Inscription
router.post('/register', authController.register);

// POST /api/auth/login - Connexion
router.post('/login', authController.login);

module.exports = router;

