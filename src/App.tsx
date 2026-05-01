import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ErrorBanner } from './components/ErrorBanner';
import { useTodoStore } from './store/todoStore';

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

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={clearError}>
      <div className="content">
        <h1>Todo List</h1>
        {error && <ErrorBanner message={error} onDismiss={clearError} />}
        <TodoForm />
        <TodoList />
      </div>
    </ErrorBoundary>
  );
};

export default App;
