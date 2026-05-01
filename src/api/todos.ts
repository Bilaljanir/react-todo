import type { Todo } from '../types';

export type { Todo };

const API_URL = 'https://api.todos.in.jt-lab.ch/todos';

export const fetchTodos = (): Promise<Todo[]> =>
  fetch(API_URL).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });

export const createTodoApi = (todo: {
  title: string;
  content: string | null;
  due_date: string | null;
  done?: boolean;
}): Promise<Todo> =>
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(todo),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json().then((data) => data[0]);
  });

export const deleteTodoApi = (id: number): Promise<void> =>
  fetch(`${API_URL}?id=eq.${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  });

export const deleteAllTodosApi = (): Promise<void> =>
  fetch(API_URL, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  });

export type UpdateTodoInput = Partial<Pick<Todo, 'title' | 'content' | 'due_date' | 'done'>>;

export const updateTodoApi = (id: number, updates: UpdateTodoInput): Promise<Todo> =>
  fetch(`${API_URL}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(updates),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json().then((data) => data[0]);
  });