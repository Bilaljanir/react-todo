import './TodoItem.css';

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: number) => void;
}

export default function TodoItem({ id, title, completed, onToggle }: TodoItemProps) {
  return (
    <div className={`todo-item ${completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      <span className={`todo-item-text ${completed ? 'completed' : ''}`}>
        {title}
      </span>
    </div>
  );
}
