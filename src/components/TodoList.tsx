import { use, useMemo, useState, Suspense } from 'react';
import type { Todo } from '../types';
import { deleteTodoApi, updateTodoApi } from '../api/todos';

type SortOption = 'due_date' | 'name' | 'none';
type FilterOption = 'all' | 'undone' | 'done';

interface EditableFieldProps {
  value: string;
  type: 'text' | 'textarea' | 'date';
  onSave: (value: string) => void | Promise<void>;
}

const EditableField = ({ value, type, onSave }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleBlur = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && type !== 'textarea') {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (type === 'textarea') {
      return (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      );
    }
    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  const handleClick = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  if (type === 'date') {
    return (
      <small onClick={handleClick} style={{ cursor: 'pointer' }}>
        Due: {value || 'Click to add'}
      </small>
    );
  }

  return (
    <span onClick={handleClick} style={{ cursor: 'pointer' }}>
      {value}
    </span>
  );
};

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

interface TodoListContentProps {
  todosPromise: Promise<Todo[]>;
  onDelete?: () => void;
  onUpdate?: () => void;
}

const TodoListContent = ({ todosPromise, onDelete, onUpdate }: TodoListContentProps) => {
  const todos = use(todosPromise);
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filteredTodos = useMemo(
    () =>
      sortTodos(filterTodos(todos, filterBy), sortBy),
    [todos, filterBy, sortBy],
  );

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTodoApi(id);
      onDelete?.();
    } catch {
      alert('Failed to delete todo');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (id: number, updates: { title?: string; content?: string; due_date?: string }) => {
    setUpdatingId(id);
    try {
      await updateTodoApi(id, updates);
      onUpdate?.();
    } catch {
      alert('Failed to update todo');
    } finally {
      setUpdatingId(null);
    }
  };

  if (filteredTodos.length === 0) {
    return <div className="empty-state">No tasks to complete.</div>;
  }

  const getSortLabel = (): string => {
    const labels: Record<SortOption, string> = {
      none: 'None',
      name: 'Name',
      due_date: 'Due Date',
    };
    return labels[sortBy];
  };

  const getFilterLabel = (): string => {
    const labels: Record<FilterOption, string> = {
      all: 'All',
      undone: 'Undone',
      done: 'Done',
    };
    return labels[filterBy];
  };

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
          {sortBy !== 'none' && (
            <span className="active-indicator">Sorted by: {getSortLabel()}</span>
          )}
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
          {filterBy !== 'all' && (
            <span className="active-indicator">Filter: {getFilterLabel()}</span>
          )}
        </div>
      </div>
      <div className="todo-list">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <div className="todo-item-content">
              <h3>
                <EditableField
                  value={todo.title}
                  type="text"
                  onSave={(value) => handleUpdate(todo.id, { title: value })}
                />
              </h3>
              <p>
                <EditableField
                  value={todo.content || ''}
                  type="textarea"
                  onSave={(value) => handleUpdate(todo.id, { content: value || '' })}
                />
              </p>
              <EditableField
                value={todo.due_date || ''}
                type="date"
                onSave={(value) => handleUpdate(todo.id, { due_date: value || '' })}
              />
              {todo.done && <span className="done-badge">Done</span>}
            </div>
            <button
              className="delete-btn"
              onClick={() => handleDelete(todo.id)}
              disabled={deletingId === todo.id || updatingId === todo.id}
              aria-label={`Delete ${todo.title}`}
            >
              {deletingId === todo.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

interface TodoListProps {
  todosPromise: Promise<Todo[]>;
  version: number;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export const TodoList = ({ todosPromise, version, onDelete, onUpdate }: TodoListProps) => {
  return (
    <Suspense
      key={version}
      fallback={
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      }
    >
      <TodoListContent todosPromise={todosPromise} onDelete={onDelete} onUpdate={onUpdate} />
    </Suspense>
  );
};
