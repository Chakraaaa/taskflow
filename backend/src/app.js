const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const periodRoutes = require('./routes/periodRoutes');
const { testConnection } = require('./config/db');

const app = express();

// Middlewares
// CORS - Autoriser les requêtes depuis le frontend React (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test de la connexion MySQL au démarrage
testConnection().then((isConnected) => {
  if (isConnected) {
    console.log('✅ Connexion MySQL initialisée avec succès');
  } else {
    console.error('❌ Échec de l\'initialisation de la connexion MySQL');
  }
}).catch((error) => {
  console.error('❌ Erreur lors du test de connexion MySQL:', error.message);
});

// Routes
app.use('/', routes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/periods', periodRoutes);

module.exports = app;

