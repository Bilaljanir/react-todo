import React, { useMemo } from 'react';
import type { Todo } from '../types';
import { useTodoStore } from '../store/todoStore';

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

const pipe =
  <T,>(...fns: ((arg: T) => T)[]) =>
  (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value);

interface EditableFieldProps {
  value: string;
  type: 'text' | 'textarea' | 'date';
  onSave: (value: string) => void | Promise<void>;
}

const EditableField = ({ value, type, onSave }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);

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

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);

  const handleUpdate = (updates: Partial<Todo>) => {
    updateTodo(todo.id, updates);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <div className="todo-item">
      <div className="todo-item-content">
        <h3>
          <EditableField
            value={todo.title}
            type="text"
            onSave={(value) => handleUpdate({ title: value })}
          />
        </h3>
        <p>
          <EditableField
            value={todo.content || ''}
            type="textarea"
            onSave={(value) => handleUpdate({ content: value || null })}
          />
        </p>
        <EditableField
          value={todo.due_date || ''}
          type="date"
          onSave={(value) => handleUpdate({ due_date: value || null })}
        />
      </div>
      <button
        className="delete-btn"
        onClick={handleDelete}
        aria-label={`Delete ${todo.title}`}
      >
        Delete
      </button>
    </div>
  );
};

export const TodoList = () => {
  const todos = useTodoStore((s) => s.todos);
  const isLoading = useTodoStore((s) => s.isLoading);
  const deleteAllTodos = useTodoStore((s) => s.deleteAllTodos);
  const setError = useTodoStore((s) => s.setError);
  const [sortBy, setSortBy] = React.useState<SortOption>('none');
  const [filterBy, setFilterBy] = React.useState<FilterOption>('all');
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDeleteAll = async () => {
    try {
      await deleteAllTodos();
      setShowConfirm(false);
    } catch {
      setError('Failed to delete all todos');
    }
  };

  const filteredTodos = useMemo(
    () =>
      pipe(
        (todos: Todo[]) => filterTodos(todos, filterBy),
        (todos: Todo[]) => sortTodos(todos, sortBy),
      )(todos),
    [todos, filterBy, sortBy],
  );

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (todos.length === 0) {
    return <div className="empty-state">No tasks to complete.</div>;
  }

  return (
    <>
      {showConfirm && (
        <div className="confirm-dialog">
          <p>Are you sure you want to delete all todos?</p>
          <div className="confirm-dialog-buttons">
            <button className="confirm-yes" onClick={handleDeleteAll}>
              Yes, Delete All
            </button>
            <button
              className="confirm-no"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
        <div className="control-group">
          <button
            className="delete-all-btn"
            onClick={() => setShowConfirm(true)}
          >
            Delete All
          </button>
        </div>
      </div>
      <div className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </>
  );
};
