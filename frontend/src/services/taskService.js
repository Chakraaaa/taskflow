import { getToken } from './authService';

/**
 * Service API pour la gestion des tâches
 * Gère uniquement les appels HTTP vers l'API backend
 * Aucune logique UI, aucun JSX
 */

// URL de base de l'API (centralisée)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const TASKS_ENDPOINT = `${API_BASE_URL}/api/tasks`;

/**
 * Récupère les headers avec authentification JWT
 * Le token est automatiquement ajouté depuis localStorage
 * @returns {Object} Headers pour les requêtes HTTP
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Récupérer le token depuis localStorage
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('Aucun token trouvé dans localStorage');
  }

  return headers;
};

/**
 * Gère les erreurs HTTP et lance une exception si la réponse n'est pas OK
 * @param {Response} response - Réponse fetch
 * @returns {Promise<Object>} Données JSON de la réponse
 * @throws {Error} Si la réponse n'est pas OK
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Si erreur 401, le token est invalide ou expiré
    if (response.status === 401) {
      // Supprimer le token invalide
      localStorage.removeItem('token');
      throw new Error(data.message || 'Token invalide ou expiré. Veuillez vous reconnecter.');
    }
    throw new Error(data.message || `Erreur HTTP ${response.status}: ${response.statusText}`);
  }

  return data;
};

/**
 * Récupère toutes les tâches de l'utilisateur connecté
 * @returns {Promise<Array>} Liste des tâches
 * @throws {Error} Si la requête échoue
 */
export const getTasks = async () => {
  try {
    const response = await fetch(TASKS_ENDPOINT, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await handleResponse(response);
    return data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    throw error;
  }
};

/**
 * Récupère une tâche par son ID
 * @param {number|string} id - ID de la tâche
 * @returns {Promise<Object>} Tâche récupérée
 * @throws {Error} Si la requête échoue ou si la tâche n'existe pas
 */
export const getTaskById = async (id) => {
  try {
    const response = await fetch(`${TASKS_ENDPOINT}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la tâche ${id}:`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle tâche
 * @param {Object} taskData - Données de la tâche { title, description?, status?, priority?, period_id }
 * @returns {Promise<Object>} Tâche créée
 * @throws {Error} Si la requête échoue
 */
export const createTask = async (taskData) => {
  try {
    const response = await fetch(TASKS_ENDPOINT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    throw error;
  }
};

/**
 * Met à jour une tâche existante
 * @param {number|string} id - ID de la tâche
 * @param {Object} taskData - Données à mettre à jour { title?, description?, status?, priority? }
 * @returns {Promise<Object>} Tâche mise à jour
 * @throws {Error} Si la requête échoue
 */
export const updateTask = async (id, taskData) => {
  try {
    const response = await fetch(`${TASKS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la tâche ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime une tâche
 * @param {number|string} id - ID de la tâche
 * @returns {Promise<void>} Résolu si la suppression réussit
 * @throws {Error} Si la requête échoue
 */
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${TASKS_ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    await handleResponse(response);
    // Pas de données à retourner pour une suppression
  } catch (error) {
    console.error(`Erreur lors de la suppression de la tâche ${id}:`, error);
    throw error;
  }
};
