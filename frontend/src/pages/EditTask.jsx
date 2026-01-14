import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import { getTaskById, updateTask, deleteTask } from '../services/taskService';
import { getPeriods } from '../services/periodService';
import './EditTask.css';

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [periodId, setPeriodId] = useState('');
  const [periods, setPeriods] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger la tâche et les périodes en parallèle
      const [taskData, periodsData] = await Promise.all([
        getTaskById(id),
        getPeriods()
      ]);

      // Pré-remplir le formulaire
      setTitle(taskData.title || '');
      setDescription(taskData.description || '');
      setStatus(taskData.status || 'pending');
      setPriority(taskData.priority || 'medium');
      setPeriodId(taskData.period_id?.toString() || '');
      setPeriods(periodsData);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.message || 'Erreur lors du chargement de la tâche');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await updateTask(id, {
        title,
        description,
        status,
        priority,
        period_id: periodId ? parseInt(periodId) : undefined
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour de la tâche');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression de la tâche');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="page-content">
          <div className="edit-task-container">
            <div className="loading-message">Chargement de la tâche...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <div className="edit-task-container">
          <div className="edit-task-header">
            <h1 className="page-title">Éditer la tâche</h1>
            <button
              className="delete-icon-btn"
              onClick={() => setShowDeleteConfirm(true)}
              title="Supprimer la tâche"
              disabled={deleting}
            >
              🗑️
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="delete-confirm-modal">
              <div className="delete-confirm-content">
                <h3>Confirmer la suppression</h3>
                <p>Êtes-vous sûr de vouloir supprimer cette tâche ?</p>
                <p className="delete-warning">Cette action est irréversible.</p>
                <div className="delete-confirm-actions">
                  <Button
                    type="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Suppression...' : 'Supprimer'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="edit-task-form">
            <div className="form-group">
              <label className="form-label">
                Période <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
                required
                disabled={saving || status === 'done'}
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.title} ({new Date(period.start_date).toLocaleDateString('fr-FR')} - {new Date(period.end_date).toLocaleDateString('fr-FR')})
                  </option>
                ))}
              </select>
              {status === 'done' && (
                <p className="form-hint">Les tâches terminées ne peuvent pas changer de période</p>
              )}
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
                disabled={saving}
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
                disabled={saving}
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
            
            <div className="form-actions">
              <Button type="secondary" onClick={() => navigate('/tasks')} disabled={saving}>
                Annuler
              </Button>
              <Button type="primary" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
