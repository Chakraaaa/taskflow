import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import { createTask } from '../services/taskService';
import { getPeriods } from '../services/periodService';
import './CreateTask.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [periodId, setPeriodId] = useState('');
  const [periods, setPeriods] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPeriods, setLoadingPeriods] = useState(true);

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    try {
      const periodsData = await getPeriods();
      setPeriods(periodsData);
      if (periodsData.length > 0) {
        setPeriodId(periodsData[0].id.toString());
      }
    } catch (err) {
      console.error('Erreur lors du chargement des périodes:', err);
      setError('Erreur lors du chargement des périodes');
    } finally {
      setLoadingPeriods(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!periodId) {
      setError('Veuillez sélectionner une période');
      return;
    }

    setLoading(true);

    try {
      await createTask({
        title,
        description,
        status,
        priority,
        period_id: parseInt(periodId)
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la tâche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <div className="create-task-container">
          <h1 className="page-title">Créer une tâche</h1>
          
          {loadingPeriods ? (
            <div className="loading-periods">Chargement des périodes...</div>
          ) : periods.length === 0 ? (
            <div className="no-periods">
              <p className="no-periods-message">Aucune période disponible</p>
              <p className="no-periods-subtitle">Créez d'abord une période pour pouvoir créer des tâches</p>
              <Button type="primary" onClick={() => navigate('/periods/new')}>
                Créer une période
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="create-task-form">
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label className="form-label">
                  Période <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={periodId}
                  onChange={(e) => setPeriodId(e.target.value)}
                  required
                  disabled={loading}
                >
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.title} ({new Date(period.start_date).toLocaleDateString('fr-FR')} - {new Date(period.end_date).toLocaleDateString('fr-FR')})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Titre"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Réviser le code, Faire les tests..."
                required
              />
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description détaillée de la tâche..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statut</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={loading}
                >
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="done">Terminée</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priorité</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={loading}
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              
              <div className="form-actions">
                <Button type="secondary" onClick={() => navigate('/tasks')} disabled={loading}>
                  Annuler
                </Button>
                <Button type="primary" onClick={handleSubmit} disabled={loading || !periodId}>
                  {loading ? 'Création...' : 'Créer la tâche'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
