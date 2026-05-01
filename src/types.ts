type TodoCreateBase = {
  title: string;
  content: string | null;
  due_date: string | null;
};

export interface Todo extends TodoCreateBase {
  id: number;
  done: boolean;
}

export type CreateTodoInput = TodoCreateBase & { done?: boolean };

export type UpdateTodoInput = Partial<TodoCreateBase & { done: boolean }>;

export interface TodoListResponse {
  todos: Todo[];
}
