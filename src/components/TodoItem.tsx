import './TodoItem.css';
import EditableField from './EditableField';
import type { Todo } from '../types';

interface TodoItemProps extends Todo {
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
}
export default function TodoItem({ id, title, done, content, due_date, onToggle, onDelete, onUpdate }: TodoItemProps) {

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className={`todo-item ${done ? 'completed' : ''}`} onClick={() => onToggle(id)}>

      <div className="todo-checkbox-container">
        <input
          type="checkbox"
          checked={done}
          readOnly
        />
      </div>

      <div className="todo-content-area">
        <h3 className="todo-title">
          <EditableField
            value={title}
            onSave={(newVal) => onUpdate(id, { title: newVal })}
            className="font-bold"
          />
        </h3>
        <div className="todo-description">
          <EditableField
            value={content || ''}
            type="textarea"
            placeholder="Ajouter une description..."
            onSave={(newVal) => onUpdate(id, { content: newVal })}
          />
        </div>
        <div className="todo-meta">
          <span className="date-badge">
            📅
            <EditableField
              value={due_date || ''}
              type="date"
              placeholder="Aucune date"
              onSave={(newVal) => onUpdate(id, { due_date: newVal })}
            />
          </span>
        </div>
      </div>

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