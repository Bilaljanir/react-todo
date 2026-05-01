import './App.css';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ErrorBanner } from './components/ErrorBanner';
import { useTodoStore } from './store/todoStore';

const App = () => {
  const { error, clearError } = useTodoStore();

  return (
    <div className="content">
      <h1>Todo List</h1>
      {error && <ErrorBanner message={error} onDismiss={clearError} />}
      <TodoForm />
      <TodoList />
    </div>
  );
};

export default App;
