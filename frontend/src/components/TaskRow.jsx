import Button from './Button';
import './TaskRow.css';

const TaskRow = ({ task }) => {
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

  return (
    <tr className="task-row">
      <td className="task-title">{task.title || 'Sans titre'}</td>
      <td>
        <span className={getStatusClass(task.status)}>
          {formatStatus(task.status)}
        </span>
      </td>
      <td>
        <span className={getPriorityClass(task.priority)}>
          {formatPriority(task.priority)}
        </span>
      </td>
      <td className="task-actions">
        <Button type="secondary" onClick={() => {}}>
          Voir
        </Button>
        <Button type="secondary" onClick={() => {}}>
          Éditer
        </Button>
        <Button type="secondary" onClick={() => {}}>
          Supprimer
        </Button>
      </td>
    </tr>
  );
};

export default TaskRow;

