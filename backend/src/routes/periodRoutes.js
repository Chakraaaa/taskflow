const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const periodController = require('../controllers/periodController');

/**
 * Routes de gestion des périodes
 * Base path: /api/periods
 * Toutes les routes sont protégées par le middleware d'authentification JWT
 */

// Appliquer le middleware d'authentification à toutes les routes
router.use(authenticateToken);

// POST /api/periods - Créer une nouvelle période
router.post('/', periodController.createPeriod);

// GET /api/periods - Récupérer toutes les périodes de l'utilisateur
router.get('/', periodController.getPeriods);

// GET /api/periods/:id - Récupérer une période par son ID
router.get('/:id', periodController.getPeriodById);

// DELETE /api/periods/:id - Supprimer une période
router.delete('/:id', periodController.deletePeriod);

module.exports = router;
