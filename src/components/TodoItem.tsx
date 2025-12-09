import './TodoItem.css';

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoItem({ title, completed }: TodoItemProps) {
  return (
    <div className={`todo-item ${completed ? 'completed' : ''}`}>
      <input type="checkbox" checked={completed} readOnly />
      <span className={`todo-item-text ${completed ? 'completed' : ''}`}>
        {title}
      </span>
    </div>
  );
}