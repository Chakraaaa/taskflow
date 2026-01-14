import { getToken } from './authService';

/**
 * Service API pour la gestion des périodes
 * Gère uniquement les appels HTTP vers l'API backend
 * Aucune logique UI, aucun JSX
 */

// URL de base de l'API (centralisée)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const PERIODS_ENDPOINT = `${API_BASE_URL}/api/periods`;

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
 * Récupère toutes les périodes de l'utilisateur connecté
 * @returns {Promise<Array>} Liste des périodes
 * @throws {Error} Si la requête échoue
 */
export const getPeriods = async () => {
  try {
    const response = await fetch(PERIODS_ENDPOINT, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await handleResponse(response);
    return data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des périodes:', error);
    throw error;
  }
};

/**
 * Récupère une période par son ID
 * @param {number|string} id - ID de la période
 * @returns {Promise<Object>} Période récupérée
 * @throws {Error} Si la requête échoue ou si la période n'existe pas
 */
export const getPeriodById = async (id) => {
  try {
    const response = await fetch(`${PERIODS_ENDPOINT}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la période ${id}:`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle période
 * @param {Object} periodData - Données de la période { title, start_date, end_date }
 * @returns {Promise<Object>} Période créée
 * @throws {Error} Si la requête échoue
 */
export const createPeriod = async (periodData) => {
  try {
    const response = await fetch(PERIODS_ENDPOINT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(periodData),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error('Erreur lors de la création de la période:', error);
    throw error;
  }
};

/**
 * Supprime une période
 * @param {number|string} id - ID de la période
 * @returns {Promise<void>} Résolu si la suppression réussit
 * @throws {Error} Si la requête échoue
 */
export const deletePeriod = async (id) => {
  try {
    const response = await fetch(`${PERIODS_ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    await handleResponse(response);
    // Pas de données à retourner pour une suppression
  } catch (error) {
    console.error(`Erreur lors de la suppression de la période ${id}:`, error);
    throw error;
  }
};
