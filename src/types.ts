export interface Todo {
  id: number;
  title: string;
  content: string | null;
  due_date: string | null;
  done: boolean;
}

export type CreateTodoInput = Pick<Todo, 'title' | 'content' | 'due_date'> & {
  done?: boolean;
};
