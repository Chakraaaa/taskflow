import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  // Formater le statut pour l'affichage
  const formatStatus = (status) => {
    const statusMap = {
      pending: 'En attente',
      in_progress: 'En cours',
      done: 'Terminée'
    };
    return statusMap[status] || status || 'Non défini';
  };

  // Formater la priorité pour l'affichage
  const formatPriority = (priority) => {
    const priorityMap = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute'
    };
    return priorityMap[priority] || priority || 'Non définie';
  };

  // Classes CSS pour le statut
  const getStatusClass = (status) => {
    return `task-status task-status-${status || 'default'}`;
  };

  // Classes CSS pour la priorité
  const getPriorityClass = (priority) => {
    return `task-priority task-priority-${priority || 'default'}`;
  };

  // Classe CSS pour les tâches terminées
  const isDone = task.status === 'done';
  const cardClassName = `task-card ${isDone ? 'task-card-done' : ''}`;

  return (
    <div className={cardClassName}>
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title || 'Sans titre'}</h4>
        <span className={getPriorityClass(task.priority)}>
          {formatPriority(task.priority)}
        </span>
      </div>
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}
      <div className="task-card-footer">
        <span className={getStatusClass(task.status)}>
          {formatStatus(task.status)}
        </span>
        <div className="task-card-actions">
          <Button type="secondary" onClick={() => navigate(`/tasks/${task.id}/edit`)}>
            Éditer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
