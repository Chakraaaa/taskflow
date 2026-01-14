const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Service d'authentification
 * Gère les appels API pour la connexion et l'inscription
 */

/**
 * Connexion d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Réponse de l'API
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Retourner le token pour qu'il soit géré par AuthContext
      return { success: true, data, token: data.token };
    } else {
      return { success: false, message: data.message || 'Erreur de connexion' };
    }
  } catch (error) {
    console.error('Erreur login:', error);
    return { success: false, message: 'Erreur de connexion au serveur' };
  }
};

/**
 * Inscription d'un nouvel utilisateur
 * @param {string} name - Nom de l'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Réponse de l'API
 */
export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.message || 'Erreur lors de l\'inscription' };
    }
  } catch (error) {
    console.error('Erreur register:', error);
    return { success: false, message: 'Erreur de connexion au serveur' };
  }
};

/**
 * Déconnexion de l'utilisateur
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Récupère le token d'authentification
 * @returns {string|null} Token ou null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

