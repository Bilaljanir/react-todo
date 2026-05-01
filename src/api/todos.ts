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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
