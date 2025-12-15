import './TodoItem.css';

interface TodoItemProps {
  id: number;
  title: string;
  done: boolean;
  content?: string;
  due_date?: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ id, title, done, content, due_date, onToggle, onDelete }: TodoItemProps) {

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className={`todo-item ${done ? 'completed' : ''}`} onClick={() => onToggle(id)}>

      {}
      <div className="todo-checkbox-container">
        <input
          type="checkbox"
          checked={done}
          readOnly
        />
        <span className="checkmark"></span>
      </div>

      {}
      <div className="todo-content-area">
        <h3 className="todo-title">{title}</h3>
        {content && <p className="todo-description">{content}</p>}
        {due_date && (
          <div className="todo-meta">
            <span className="date-badge">📅 {due_date}</span>
          </div>
        )}
      </div>

      {}
      <button
        className="delete-btn"
        onClick={handleDeleteClick}
        title="Supprimer la tâche"
      >
        🗑️
      </button>

    </div>
  );
}