import { useState } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { TodoList } from './components/TodoList';
import { fetchTodos } from './api/todos';
import { TodoForm } from './components/TodoForm';
import { ErrorBanner } from './components/ErrorBanner';
import { useTodoStore } from './store/todoStore';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="error-banner" role="alert" style={{ margin: '1rem' }}>
    <span className="error-icon">⚠</span>
    <span className="error-message">Something went wrong: {(error as Error).message}</span>
    <button className="dismiss-btn" onClick={resetErrorBoundary} aria-label="Dismiss error">✕</button>
  </div>
);

const App = () => {
  const { error, clearError } = useTodoStore();
  const [todosVersion, setTodosVersion] = useState(0);

  const refetchTodos = () => {
    setTodosVersion((v) => v + 1);
  };

  const todosPromise = fetchTodos();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={clearError}>
      <div className="content">
        <h1>Todo List</h1>
        {error && <ErrorBanner message={error} onDismiss={clearError} />}
        <TodoForm onSuccess={refetchTodos} onError={clearError} />
        <TodoList todosPromise={todosPromise} version={todosVersion} onDelete={refetchTodos} onUpdate={refetchTodos} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
