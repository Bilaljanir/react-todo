import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
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

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      if (Array.isArray(data)) setTodos(data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (title: string, content: string, due_date: string) => {
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

      if (!response.ok) throw new Error("Erreur ajout");

      await fetchTodos();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création.");
    }
  };

  const handleToggle = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cette tâche définitivement ?")) return;

    try {
      const response = await fetch(`${API_URL}?id=eq.${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Erreur delete:", error);
      alert("Impossible de supprimer la tâche.");
    }
  };


  return (
    <div className="todo-list">
      <TodoForm onAddTodo={handleAddTodo} />

      <h2>Mes tâches</h2>
      <div className="todo-list-container">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
        {todos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#718096', marginTop: '20px' }}>
            Aucune tâche pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}