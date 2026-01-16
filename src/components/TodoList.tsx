import { useEffect } from 'react';
import { useTodoStore } from '../store/useTodoStore';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import ErrorNotification from './ErrorNotification';
import './TodoList.css';

export default function TodoList() {
  const {
    todos,
    filter,
    sort,
    error,
    isLoading,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    deleteAllTodos,
    setFilter,
    setSort,
    setError
  } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleDeleteAll = async () => {
    if (todos.length === 0) return;

    const confirmDelete = window.confirm(
      "ATTENTION : Vous allez supprimer définitivement TOUTES les tâches.\n\nÊtes-vous sûr de vouloir continuer ?"
    );

    if (confirmDelete) {
      await deleteAllTodos();
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'done') return todo.done === true;
    if (filter === 'undone') return todo.done === false;
    return true;
  });

  const sortedAndFilteredTodos = [...filteredTodos].sort((a, b) => {
    if (sort === 'alphabetical') return a.title.localeCompare(b.title);
    if (sort === 'date') {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return 0;
  });

  return (
    <div className="todo-list">
      <ErrorNotification
        message={error}
        onClose={() => setError(null)}
      />

      <TodoForm onAddTodo={addTodo} />

      <h2>Mes tâches</h2>

      <TodoFilters
        currentFilter={filter}
        currentSort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      <div className="todo-list-container">
        {sortedAndFilteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            onToggle={(id) => {
              const currentTodo = todos.find((t) => t.id === id);
              if (currentTodo) updateTodo(id, { done: !currentTodo.done });
            }}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        ))}
        {sortedAndFilteredTodos.length === 0 && (
          <p className="empty-message">Aucune tâche à afficher.</p>
        )}
      </div>

      {todos.length > 0 && (
        <div className="delete-all-container" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
          <button
            onClick={handleDeleteAll}
            disabled={isLoading}
            className="delete-all-btn"
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Suppression en cours...' : 'Tout supprimer'}
          </button>
        </div>
      )}
    </div>
  );
}