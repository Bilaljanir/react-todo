import { create } from 'zustand';
import type { Todo, CreateTodoInput } from '../types';

const API_URL = 'https://api.todos.in.jt-lab.ch/todos';

const fetchTodosFromApi = (): Promise<Todo[]> =>
  fetch(API_URL).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });

const createTodoApi = (todo: CreateTodoInput): Promise<Todo> =>
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });

const deleteAllTodosApi = (): Promise<void> =>
  fetch(API_URL, { method: 'DELETE' }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  });

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  createTodo: (input: CreateTodoInput) => Promise<void>;
  updateTodo: (id: number, updates: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  deleteAllTodos: () => Promise<void>;
  setError: (message: string | null) => void;
  clearError: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await fetchTodosFromApi();
      set({ todos, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch todos';
      set({ error: message, isLoading: false });
    }
  },

  createTodo: async (input) => {
    set({ error: null });
    try {
      const newTodo = await createTodoApi(input);
      set({ todos: [...get().todos, newTodo] });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create todo';
      set({ error: message });
      throw error;
    }
  },

  updateTodo: (id, updates) => {
    set({
      error: null,
      todos: get().todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    });
  },

  deleteTodo: (id) => {
    set({ error: null, todos: get().todos.filter((t) => t.id !== id) });
  },

  deleteAllTodos: async () => {
    set({ error: null });
    try {
      await deleteAllTodosApi();
      set({ todos: [] });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete all todos';
      set({ error: message });
      throw error;
    }
  },

  setError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),
}));
