import { create } from 'zustand';
import type { Todo, FilterType, SortType } from '../types';

interface TodoState {
  todos: Todo[];
  filter: FilterType;
  sort: SortType;
  error: string | null;
  isLoading: boolean;

  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
  setError: (error: string | null) => void;

  fetchTodos: () => Promise<void>;
  addTodo: (title: string, content: string, due_date: string) => Promise<void>;
  updateTodo: (id: number, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  deleteAllTodos: () => Promise<void>; // <--- 1. AJOUTER CECI
}

const API_URL = "https://api.todos.in.jt-lab.ch/todos";

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  filter: 'all',
  sort: 'date',
  error: null,
  isLoading: false,

  setFilter: (filter) => set({ filter }),
  setSort: (sort) => set({ sort }),
  setError: (error) => set({ error }),

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) set({ todos: data });
      } else {
        throw new Error(`Erreur serveur: ${response.status}`);
      }
    } catch (error) {
      set({ error: "Impossible de charger la liste." });
    } finally {
      set({ isLoading: false });
    }
  },

  addTodo: async (title, content, due_date) => {
    set({ error: null });
    const newTodoData = { title, content: content || undefined, due_date: due_date || undefined, done: false };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodoData),
      });
      if (!response.ok) throw new Error("Erreur création");
      await get().fetchTodos();
    } catch (err) {
      set({ error: "Echec la creation." });
      throw err;
    }
  },

  updateTodo: async (id, updates) => {
    set({ error: null });
    const oldTodos = get().todos;
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }));
    try {
      const response = await fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Erreur sauvegarde");
    } catch (err) {
      set({ todos: oldTodos, error: "Impossible de modifier la tâche." });
    }
  },

  deleteTodo: async (id) => {
    set({ error: null });
    const oldTodos = get().todos;
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));

    try {
      const response = await fetch(`${API_URL}?id=eq.${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Erreur suppression");
    } catch (err) {
      set({ todos: oldTodos, error: "Impossible de supprimer la tâche." });
    }
  },

  // 2. AJOUTER CETTE FONCTION À LA FIN
  deleteAllTodos: async () => {
    const currentTodos = get().todos;
    if (currentTodos.length === 0) return;

    // On prévient l'utilisateur que ça charge
    set({ isLoading: true, error: null });

    try {
      // On lance toutes les suppressions en parallèle
      const deletePromises = currentTodos.map((todo) =>
        fetch(`${API_URL}?id=eq.${todo.id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);

      // Si tout s'est bien passé, on vide la liste locale
      set({ todos: [] });
    } catch (err) {
      // En cas d'erreur, on recharge la liste depuis le serveur pour être sûr de ce qui reste
      await get().fetchTodos();
      set({ error: "Impossible de tout supprimer." });
    } finally {
      set({ isLoading: false });
    }
  },
}));