const { pool } = require('../config/db');

/**
 * Controller de gestion des tâches
 * Toutes les opérations sont filtrées par user_id depuis le token JWT
 */

/**
 * Créer une nouvelle tâche
 * POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, period_id } = req.body;
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Validation des champs requis
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le titre est requis'
      });
    }

    if (!period_id) {
      return res.status(400).json({
        success: false,
        message: 'La période (period_id) est requise'
      });
    }

    // Vérifier que la période existe et appartient à l'utilisateur
    const [periods] = await pool.execute(
      'SELECT id FROM periods WHERE id = ? AND user_id = ?',
      [period_id, userId]
    );

    if (periods.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Période introuvable ou vous n\'avez pas l\'autorisation de l\'utiliser'
      });
    }

    // Validation du statut (optionnel, avec valeur par défaut)
    const validStatuses = ['pending', 'in_progress', 'done'];
    const taskStatus = status && validStatuses.includes(status) ? status : 'pending';

    // Validation de la priorité (optionnel, avec valeur par défaut)
    const validPriorities = ['low', 'medium', 'high'];
    const taskPriority = priority && validPriorities.includes(priority) ? priority : 'medium';

    // Insérer la tâche en base de données
    const [result] = await pool.execute(
      'INSERT INTO tasks (user_id, period_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, period_id, title.trim(), description?.trim() || null, taskStatus, taskPriority]
    );

    // Récupérer la tâche créée
    const [tasks] = await pool.execute(
      'SELECT id, user_id, period_id, title, description, status, priority, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?',
      [result.insertId, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      data: tasks[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la tâche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Récupérer toutes les tâches de l'utilisateur
 * GET /api/tasks
 */
const getTasks = async (req, res) => {
  try {
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Récupérer toutes les tâches de l'utilisateur avec tri par priorité (high -> low)
    // Ordre de priorité : high = 3, medium = 2, low = 1
    const [tasks] = await pool.execute(
      `SELECT id, user_id, period_id, title, description, status, priority, created_at, updated_at 
       FROM tasks 
       WHERE user_id = ? 
       ORDER BY 
         CASE priority 
           WHEN 'high' THEN 1 
           WHEN 'medium' THEN 2 
           WHEN 'low' THEN 3 
           ELSE 4 
         END ASC, 
         created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: 'Tâches récupérées avec succès',
      data: tasks,
      count: tasks.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des tâches',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Récupérer une tâche par son ID
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Récupérer la tâche (vérification que l'utilisateur en est propriétaire)
    const [tasks] = await pool.execute(
      'SELECT id, user_id, period_id, title, description, status, priority, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    // Vérifier si la tâche existe et appartient à l'utilisateur
    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable ou vous n\'avez pas l\'autorisation d\'y accéder'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tâche récupérée avec succès',
      data: tasks[0]
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la tâche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Mettre à jour une tâche
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, period_id } = req.body;
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const [existingTasks] = await pool.execute(
      'SELECT id, status FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable ou vous n\'avez pas l\'autorisation de la modifier'
      });
    }

    const currentTask = existingTasks[0];

    // Si la tâche est terminée, on ne peut pas changer de période
    if (period_id !== undefined && currentTask.status === 'done') {
      return res.status(400).json({
        success: false,
        message: 'Les tâches terminées ne peuvent pas changer de période'
      });
    }

    // Si period_id est fourni, vérifier qu'il appartient à l'utilisateur
    if (period_id !== undefined) {
      const [periods] = await pool.execute(
        'SELECT id FROM periods WHERE id = ? AND user_id = ?',
        [period_id, userId]
      );

      if (periods.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Période introuvable ou vous n\'avez pas l\'autorisation de l\'utiliser'
        });
      }
    }

    // Construire la requête de mise à jour dynamiquement
    const updates = [];
    const values = [];

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Le titre ne peut pas être vide'
        });
      }
      updates.push('title = ?');
      values.push(title.trim());
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description?.trim() || null);
    }

    if (status !== undefined) {
      const validStatuses = ['pending', 'in_progress', 'done'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide. Valeurs acceptées: pending, in_progress, done'
        });
      }
      updates.push('status = ?');
      values.push(status);
    }

    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'Priorité invalide. Valeurs acceptées: low, medium, high'
        });
      }
      updates.push('priority = ?');
      values.push(priority);
    }

    if (period_id !== undefined) {
      updates.push('period_id = ?');
      values.push(period_id);
    }

    // Vérifier qu'au moins un champ est à mettre à jour
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun champ à mettre à jour'
      });
    }

    // Ajouter updated_at et l'ID pour la clause WHERE
    updates.push('updated_at = NOW()');
    values.push(id, userId);

    // Exécuter la mise à jour
    await pool.execute(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    // Récupérer la tâche mise à jour
    const [tasks] = await pool.execute(
      'SELECT id, user_id, period_id, title, description, status, priority, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Tâche mise à jour avec succès',
      data: tasks[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la tâche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Supprimer une tâche
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const [existingTasks] = await pool.execute(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable ou vous n\'avez pas l\'autorisation de la supprimer'
      });
    }

    // Supprimer la tâche
    await pool.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Tâche supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la tâche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};

