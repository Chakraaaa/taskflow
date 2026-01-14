import { useState } from 'react';
import TaskCard from './TaskCard';
import Button from './Button';
import './PeriodColumn.css';

const PeriodColumn = ({ period, tasks, onDeletePeriod }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  // Séparer les tâches : non terminées en haut, terminées en bas
  const activeTasks = tasks.filter(task => task.status !== 'done');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Fonction de tri par priorité (high -> medium -> low)
  const sortByPriority = (tasksList) => {
    return [...tasksList].sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const aPriority = priorityOrder[a.priority] || 4;
      const bPriority = priorityOrder[b.priority] || 4;
      return aPriority - bPriority;
    });
  };

  // Trier chaque groupe par priorité
  const sortedActiveTasks = sortByPriority(activeTasks);
  const sortedDoneTasks = sortByPriority(doneTasks);

  // Formater les dates pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
    setError(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (!onDeletePeriod) return;

    setDeleting(true);
    setError(null);

    try {
      await onDeletePeriod(period.id);
      setShowConfirm(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression de la période');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="period-column">
      <div className="period-header">
        <div className="period-header-top">
          <div>
            <h3 className="period-title">{period.title}</h3>
            <p className="period-dates">
              {formatDate(period.start_date)} - {formatDate(period.end_date)}
            </p>
            <span className="period-task-count">{tasks.length} tâche{tasks.length > 1 ? 's' : ''}</span>
          </div>
          {onDeletePeriod && (
            <button
              className="period-delete-btn"
              onClick={handleDeleteClick}
              disabled={deleting}
              title="Supprimer la période"
            >
              🗑️
            </button>
          )}
        </div>

        {showConfirm && (
          <div className="period-delete-confirm">
            <p className="delete-confirm-message">
              Supprimer cette période ? Les périodes contenant des tâches ne peuvent pas être supprimées.
            </p>
            {error && (
              <p className="delete-error-message">{error}</p>
            )}
            <div className="delete-confirm-buttons">
              <Button type="secondary" onClick={handleCancelDelete} disabled={deleting}>
                Annuler
              </Button>
              <Button type="primary" onClick={handleConfirmDelete} disabled={deleting}>
                {deleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="period-tasks">
        {tasks.length === 0 ? (
          <div className="period-empty">Aucune tâche</div>
        ) : (
          <>
            {/* Tâches actives (non terminées) */}
            {sortedActiveTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            
            {/* Séparateur visuel si des tâches terminées existent */}
            {sortedDoneTasks.length > 0 && sortedActiveTasks.length > 0 && (
              <div className="tasks-separator">
                <span>Tâches terminées</span>
              </div>
            )}
            
            {/* Tâches terminées (toujours en bas) */}
            {sortedDoneTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PeriodColumn;
