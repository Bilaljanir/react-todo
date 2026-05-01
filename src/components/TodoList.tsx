import { use, useMemo, useState, useEffect } from 'react';
import type { Todo } from '../types';
import { useTodoStore } from '../store/todoStore';

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

const TodoListContent = ({ todoPromise }: { todoPromise: Promise<Todo[]> }) => {
  const initialTodos = use(todoPromise);
  const todos = useTodoStore((s) => s.todos);
  const setTodos = useTodoStore((s) => s.setTodos);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const deleteAllTodos = useTodoStore((s) => s.deleteAllTodos);
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (todos.length === 0 && initialTodos.length > 0) {
      setTodos(initialTodos);
    }
  }, [initialTodos, setTodos, todos.length]);

  const filteredTodos = useMemo(
    () => sortTodos(filterTodos(todos, filterBy), sortBy),
    [todos, filterBy, sortBy],
  );

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
            <span className="active-indicator">
              Sorted by: {getSortLabel()}
            </span>
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
      {todos.length > 0 && (
        <div className="delete-all-section" style={{ margin: '1rem 0' }}>
          <button
            className="delete-all-btn"
            onClick={() => setShowConfirmDialog(true)}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete All
          </button>
        </div>
      )}
      {showConfirmDialog && (
        <div
          className="confirm-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="confirm-dialog"
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
            }}
          >
            <p style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to delete all todos?
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                className="confirm-btn"
                onClick={async () => {
                  await deleteAllTodos();
                  setShowConfirmDialog(false);
                }}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredTodos.length === 0 ? (
        <div className="empty-state">No tasks to complete.</div>
      ) : (
        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <div className="todo-item-content">
                <h3>
                  <EditableField
                    value={todo.title}
                    type="text"
                    onSave={(value) => updateTodo(todo.id, { title: value })}
                  />
                </h3>
                <p>
                  <EditableField
                    value={todo.content || ''}
                    type="textarea"
                    onSave={(value) =>
                      updateTodo(todo.id, { content: value || '' })
                    }
                  />
                </p>
                <EditableField
                  value={todo.due_date || ''}
                  type="date"
                  onSave={(value) =>
                    updateTodo(todo.id, { due_date: value || '' })
                  }
                />
                {todo.done && <span className="done-badge">Done</span>}
              </div>
              <button
                className={todo.done ? 'undone-btn' : 'done-btn'}
                onClick={() => updateTodo(todo.id, { done: !todo.done })}
                aria-label={`Mark ${todo.title} as ${todo.done ? 'undone' : 'done'}`}
                style={{
                  backgroundColor: todo.done ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '0.5rem',
                }}
              >
                {todo.done ? 'Mark Undone' : 'Mark Done'}
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete ${todo.title}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export const TodoList = ({ todoPromise }: { todoPromise: Promise<Todo[]> }) => {
  return <TodoListContent todoPromise={todoPromise} />;
};
