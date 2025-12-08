import TodoItem from './TodoItem';

const staticTodos = [
  { id: 1, title: 'todo 1', completed: false },
  { id: 2, title: 'Todo 2', completed: false },
  { id: 3, title: 'Todo 3', completed: false },
];

export default function TodoList() {
  return (
    <div className="todo-list">
      <h2>Ma Todo List</h2>
      {staticTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
        />
      ))}
    </div>
  );
}