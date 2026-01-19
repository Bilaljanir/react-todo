import { useEffect, useCallback, useMemo } from 'react';
import { useTodoStore } from '../store/useTodoStore';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import ErrorNotification from './ErrorNotification';
import type { Todo } from '../types';
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

  const sortedAndFilteredTodos = useMemo(() => {
    const filtered = todos.filter((todo) => {
      if (filter === 'done') return todo.done === true;
      if (filter === 'undone') return todo.done === false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'alphabetical') return a.title.localeCompare(b.title);
      if (sort === 'date') {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    });
  }, [todos, filter, sort]);

  const handleDeleteAll = useCallback(async () => {
    if (todos.length === 0) return;

    const confirmDelete = window.confirm(
      "ATTENTION : Vous allez supprimer  tous les tâches.\n\n tes sûr ?"
    );

    if (confirmDelete) {
      await deleteAllTodos();
    }
  }, [todos.length, deleteAllTodos]);

  const handleToggle = useCallback((id: number) => {
    const currentTodo = todos.find((t) => t.id === id);
    if (currentTodo) {
      updateTodo(id, { done: !currentTodo.done });
    }
  }, [todos, updateTodo]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm("Supprimer cette tâche définitivement ?")) {
      deleteTodo(id);
    }
  }, [deleteTodo]);

  const handleUpdate = useCallback((id: number, updates: Partial<Todo>) => {
    updateTodo(id, updates);
  }, [updateTodo]);


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
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
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