import { use, useMemo, useState, Suspense } from 'react';
import type { Todo } from '../types';

const API_URL = 'https://api.todos.in.jt-lab.ch/todos';

const fetchTodos = (): Promise<Todo[]> =>
  fetch(API_URL).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });

type SortOption = 'due_date' | 'name' | 'none';
type FilterOption = 'all' | 'undone' | 'done';

const filterTodos = (todos: Todo[], filterBy: FilterOption): Todo[] => {
  const filters: Record<FilterOption, (todo: Todo) => boolean> = {
    all: () => true,
    undone: (todo) => !todo.done,
    done: (todo) => todo.done,
  };
  return todos.filter(filters[filterBy]);
};

const sortTodos = (todos: Todo[], sortBy: SortOption): Todo[] => {
  const sorters: Record<SortOption, (a: Todo, b: Todo) => number> = {
    none: () => 0,
    name: (a, b) => a.title.localeCompare(b.title),
    due_date: (a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return a.due_date.localeCompare(b.due_date);
    },
  };
  return [...todos].sort(sorters[sortBy]);
};

const TodoListContent = ({ todosPromise }: { todosPromise: Promise<Todo[]> }) => {
  const todos = use(todosPromise);
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const filteredTodos = useMemo(
    () =>
      sortTodos(filterTodos(todos, filterBy), sortBy),
    [todos, filterBy, sortBy],
  );

  if (filteredTodos.length === 0) {
    return <div className="empty-state">No tasks to complete.</div>;
  }

  return (
    <>
      <div className="controls">
        <div className="control-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="none">None</option>
            <option value="name">Name</option>
            <option value="due_date">Due Date</option>
          </select>
        </div>
        <div className="control-group">
          <label>Filter:</label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
          >
            <option value="all">All</option>
            <option value="undone">Undone</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div className="todo-list">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <div className="todo-item-content">
              <h3>{todo.title}</h3>
              {todo.content && <p>{todo.content}</p>}
              {todo.due_date && (
                <small>Due: {todo.due_date}</small>
              )}
              {todo.done && <span className="done-badge">Done</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const TodoList = () => {
  const [todosPromise] = useState<Promise<Todo[]>>(() => fetchTodos());

  return (
    <Suspense
      fallback={
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      }
    >
      <TodoListContent todosPromise={todosPromise} />
    </Suspense>
  );
};
