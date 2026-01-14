export interface Todo {
  id: number;
  title: string;
  done: boolean;
  content?: string;
  due_date?: string;
}

export type FilterType = 'all' | 'done' | 'undone';
export type SortType = 'date' | 'alphabetical';
