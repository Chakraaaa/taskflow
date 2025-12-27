const { pool, testConnection } = require('../config/db');

// Test de connexion simple
const test = async (req, res) => {
  try {
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Impossible de se connecter à la base de données' 
      });
    }

    // Test d'une requête simple
    const [rows] = await pool.execute('SELECT 1 + 1 AS result, NOW() AS server_time, DATABASE() AS db_name');
    
    res.status(200).json({
      status: 'ok',
      message: 'Connexion MySQL réussie',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  test
};

