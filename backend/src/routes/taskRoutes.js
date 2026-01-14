const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

/**
 * Routes de gestion des tâches
 * Base path: /api/tasks
 * Toutes les routes sont protégées par le middleware d'authentification JWT
 */

// Appliquer le middleware d'authentification à toutes les routes
router.use(authenticateToken);

// POST /api/tasks - Créer une nouvelle tâche
router.post('/', taskController.createTask);

// GET /api/tasks - Récupérer toutes les tâches de l'utilisateur
router.get('/', taskController.getTasks);

// GET /api/tasks/:id - Récupérer une tâche par son ID
router.get('/:id', taskController.getTaskById);

// PUT /api/tasks/:id - Mettre à jour une tâche
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Supprimer une tâche
router.delete('/:id', taskController.deleteTask);

module.exports = router;

