import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters, { type FilterType, type SortType } from './TodoFilters';
import ErrorNotification from './ErrorNotification';
import './TodoList.css';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
  content?: string;
  due_date?: string;
}

const API_URL = "https://api.todos.in.jt-lab.ch/todos";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setTodos(data);
      } else {
        throw new Error(`Erreur serveur: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
      setError("Impossible de charger la liste des tâches.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (title: string, content: string, due_date: string) => {
    setError(null);
    const newTodoData = {
      title,
      content: content || undefined,
      due_date: due_date || undefined,
      done: false
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodoData),
      });

      if (!response.ok) throw new Error("Erreur lors de la création");
      await fetchTodos();
    } catch (err) {
      console.error(err);
      setError("Echec la creation. Vérifiez la connexion.");
      throw err;
    }
  };

  const handleUpdateTodo = async (id: number, updates: Partial<Todo>) => {
    setError(null);

    const oldTodos = [...todos];
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );

    try {
      const response = await fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Erreur sauvegarde");
    } catch (err) {
      console.error("Erreur update:", err);
      setTodos(oldTodos);
      setError("Impossible de modifier la tâche. Veuillez réessayer.");
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    if (!window.confirm("Supprimer cette tâche définitivement ?")) return;

    const oldTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const response = await fetch(`${API_URL}?id=eq.${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Erreur suppression");
    } catch (err) {
      console.error("Erreur delete:", err);
      setTodos(oldTodos);
      setError("Impossible de supprimer la tâche.");
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

      <TodoForm onAddTodo={handleAddTodo} />

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
              const todo = todos.find((t) => t.id === id);
              if (todo) handleUpdateTodo(id, { done: !todo.done });
            }}
            onDelete={handleDelete}
            onUpdate={handleUpdateTodo}
          />
        ))}
      </div>
    </div>
  );
}
