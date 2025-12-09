import TodoItem from './TodoItem';
import './TodoList.css';

const staticTodos = [
  { id: 1, title: 'Apprendre React', completed: true },
  { id: 2, title: 'Créer une todo list', completed: false },
  { id: 3, title: 'Déployer sur GitHub Pages', completed: false },
];

export default function TodoList() {
  return (
    <div className="todo-list">
      <h2>Mes tâches</h2>
      <div className="todo-list-container">
        {staticTodos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </div>
    </div>
  );
}