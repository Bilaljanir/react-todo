interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoItem({ title, completed }: TodoItemProps) {
  return (
    <div className="todo-item">
      <input type="checkbox" checked={completed} readOnly />
      <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>
        {title}
      </span>
    </div>
  );
}