const { pool } = require('../config/db');

/**
 * Controller pour tester la connexion à la base de données
 * Route: GET /api/test-db
 */
const testDb = async (req, res) => {
  try {
    // Exécuter une requête simple pour tester la connexion
    const [rows] = await pool.execute('SELECT 1 AS test');
    
    res.status(200).json({
      success: true,
      message: 'DB connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      error: error.message
    });
  }
};

module.exports = {
  testDb
};

