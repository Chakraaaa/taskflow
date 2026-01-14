const { pool } = require('../config/db');

/**
 * Controller de gestion des périodes
 * Limite : 4 périodes maximum par utilisateur
 */

const MAX_PERIODS = 4;

/**
 * Créer une nouvelle période
 * POST /api/periods
 */
const createPeriod = async (req, res) => {
  try {
    const { title, start_date, end_date } = req.body;
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Validation des champs requis
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le titre est requis'
      });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Les dates de début et de fin sont requises'
      });
    }

    // Vérifier que la date de fin est après la date de début
    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être postérieure à la date de début'
      });
    }

    // Vérifier la limite de 4 périodes
    const [existingPeriods] = await pool.execute(
      'SELECT COUNT(*) as count FROM periods WHERE user_id = ?',
      [userId]
    );

    if (existingPeriods[0].count >= MAX_PERIODS) {
      return res.status(400).json({
        success: false,
        message: `Limite atteinte : vous ne pouvez créer que ${MAX_PERIODS} périodes maximum`
      });
    }

    // Insérer la période en base de données
    const [result] = await pool.execute(
      'INSERT INTO periods (user_id, title, start_date, end_date) VALUES (?, ?, ?, ?)',
      [userId, title.trim(), start_date, end_date]
    );

    // Récupérer la période créée
    const [periods] = await pool.execute(
      'SELECT id, user_id, title, start_date, end_date, created_at, updated_at FROM periods WHERE id = ? AND user_id = ?',
      [result.insertId, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Période créée avec succès',
      data: periods[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création de la période:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la période',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Récupérer toutes les périodes de l'utilisateur
 * GET /api/periods
 */
const getPeriods = async (req, res) => {
  try {
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Récupérer toutes les périodes de l'utilisateur
    const [periods] = await pool.execute(
      'SELECT id, user_id, title, start_date, end_date, created_at, updated_at FROM periods WHERE user_id = ? ORDER BY start_date ASC',
      [userId]
    );

    res.status(200).json({
      success: true,
      message: 'Périodes récupérées avec succès',
      data: periods,
      count: periods.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des périodes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des périodes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Récupérer une période par son ID
 * GET /api/periods/:id
 */
const getPeriodById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Récupérer la période (vérification que l'utilisateur en est propriétaire)
    const [periods] = await pool.execute(
      'SELECT id, user_id, title, start_date, end_date, created_at, updated_at FROM periods WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    // Vérifier si la période existe et appartient à l'utilisateur
    if (periods.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Période introuvable ou vous n\'avez pas l\'autorisation d\'y accéder'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Période récupérée avec succès',
      data: periods[0]
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la période:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la période',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Supprimer une période
 * DELETE /api/periods/:id
 */
const deletePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Récupéré depuis le middleware JWT

    // Vérifier que la période existe et appartient à l'utilisateur
    const [existingPeriods] = await pool.execute(
      'SELECT id FROM periods WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingPeriods.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Période introuvable ou vous n\'avez pas l\'autorisation de la supprimer'
      });
    }

    // Vérifier s'il y a des tâches associées à cette période
    const [tasks] = await pool.execute(
      'SELECT COUNT(*) as count FROM tasks WHERE period_id = ?',
      [id]
    );

    if (tasks[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer cette période : des tâches y sont associées'
      });
    }

    // Supprimer la période
    await pool.execute(
      'DELETE FROM periods WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Période supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la période:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la période',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createPeriod,
  getPeriods,
  getPeriodById,
  deletePeriod
};
