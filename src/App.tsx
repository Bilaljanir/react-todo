import { useState } from 'react';
import './App.css';
import { TodoList } from './components/TodoList';
import { fetchTodos } from './api/todos';
import { TodoForm } from './components/TodoForm';
import { ErrorBanner } from './components/ErrorBanner';
import { useTodoStore } from './store/todoStore';

const App = () => {
  const { error, clearError } = useTodoStore();
  const [todosVersion, setTodosVersion] = useState(0);

  const refetchTodos = () => {
    setTodosVersion((v) => v + 1);
  };

  const todosPromise = fetchTodos();

  return (
    <div className="content">
      <h1>Todo List</h1>
      {error && <ErrorBanner message={error} onDismiss={clearError} />}
      <TodoForm onSuccess={refetchTodos} onError={clearError} />
      <TodoList todosPromise={todosPromise} version={todosVersion} onDelete={refetchTodos} onUpdate={refetchTodos} />
    </div>
  );
};

export default App;
