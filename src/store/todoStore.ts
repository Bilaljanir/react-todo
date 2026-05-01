import { create } from 'zustand';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types';
import {
  createTodoApi,
  updateTodoApi,
  deleteTodoApi,
  deleteAllTodosApi,
} from '../api/todos';

interface TodoState {
  todos: Todo[];
  error: string | null;
  setTodos: (todos: Todo[]) => void;
  createTodo: (input: CreateTodoInput) => Promise<Todo>;
  updateTodo: (id: number, updates: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  deleteAllTodos: () => Promise<void>;
  setError: (message: string | null) => void;
  clearError: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  error: null,

  setTodos: (todos) => set({ todos }),

  createTodo: async (input) => {
    set({ error: null });
    try {
      const newTodo = await createTodoApi(input);
      set({ todos: [...get().todos, newTodo] });
      return newTodo;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create todo';
      set({ error: message });
      throw error;
    }
  },

  updateTodo: async (id, updates) => {
    set({ error: null });
    try {
      const updatedTodo = await updateTodoApi(id, updates);
      set({
        todos: get().todos.map((t) => (t.id === id ? updatedTodo : t)),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update todo';
      set({ error: message });
      throw error;
    }
  },

  deleteTodo: async (id) => {
    set({ error: null });
    try {
      await deleteTodoApi(id);
      set({ todos: get().todos.filter((t) => t.id !== id) });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete todo';
      set({ error: message });
      throw error;
    }
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
