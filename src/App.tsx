import { useRef, Suspense } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ErrorBanner } from './components/ErrorBanner';
import { useTodoStore } from './store/todoStore';
import { fetchTodos } from './api/todos';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="error-banner" role="alert" style={{ margin: '1rem' }}>
    <span className="error-icon">⚠</span>
    <span className="error-message">
      Something went wrong: {(error as Error).message}
    </span>
    <button
      className="dismiss-btn"
      onClick={resetErrorBoundary}
      aria-label="Dismiss error"
    >
      ✕
    </button>
  </div>
);

const App = () => {
  const { error, clearError } = useTodoStore();
  const todoPromise = useRef(fetchTodos()).current;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={clearError}>
      <div className="content">
        <h1>Todo List</h1>
        {error && <ErrorBanner message={error} onDismiss={clearError} />}
        <TodoForm />
        <Suspense fallback={
          <div className="loading">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        }>
          <TodoList todoPromise={todoPromise} />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App;
