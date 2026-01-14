import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Button from '../components/Button';
import PeriodColumn from '../components/PeriodColumn';
import { getTasks } from '../services/taskService';
import { getPeriods, deletePeriod } from '../services/periodService';
import './Tasks.css';

const Tasks = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rediriger vers /login si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, periodsData] = await Promise.all([
        getTasks(),
        getPeriods()
      ]);
      setTasks(tasksData);
      setPeriods(periodsData);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      // Si erreur 401 (non autorisé), rediriger vers login
      if (err.message && (err.message.includes('401') || err.message.includes('Token invalide') || err.message.includes('Token d\'authentification'))) {
        navigate('/login', { replace: true });
        return;
      }
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Grouper les tâches par période
  const tasksByPeriod = periods.reduce((acc, period) => {
    acc[period.id] = tasks.filter(task => task.period_id === period.id);
    return acc;
  }, {});

  // Fonction pour supprimer une période
  const handleDeletePeriod = async (periodId) => {
    try {
      await deletePeriod(periodId);
      // Rafraîchir les périodes et les tâches après suppression
      await loadData();
    } catch (err) {
      // Relancer l'erreur pour qu'elle soit gérée dans PeriodColumn
      throw err;
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <div className="tasks-page">
          <div className="tasks-header">
            <div>
              <h1 className="tasks-title">Tâches</h1>
              <p className="tasks-subtitle">Organisez vos projets efficacement</p>
            </div>
            <div className="tasks-header-actions">
              <Button type="secondary" onClick={() => navigate('/periods/new')}>
                + Nouvelle période
              </Button>
              <Button type="primary" onClick={() => navigate('/tasks/new')}>
                + Nouvelle tâche
              </Button>
            </div>
          </div>

          {loading && (
            <div className="tasks-loading">
              Chargement des tâches…
            </div>
          )}

          {error && (
            <div className="tasks-error">
              <p>{error}</p>
              <Button type="secondary" onClick={loadData}>
                Réessayer
              </Button>
            </div>
          )}

          {!loading && !error && periods.length === 0 && (
            <div className="tasks-empty">
              <p className="empty-message">Aucune période créée</p>
              <p className="empty-subtitle">Créez d'abord une période pour organiser vos tâches</p>
              <Button type="primary" onClick={() => navigate('/periods/new')}>
                Créer une période
              </Button>
            </div>
          )}

          {!loading && !error && periods.length > 0 && (
            <div className="periods-container">
              {periods.map((period) => (
                <PeriodColumn
                  key={period.id}
                  period={period}
                  tasks={tasksByPeriod[period.id] || []}
                  onDeletePeriod={handleDeletePeriod}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;

