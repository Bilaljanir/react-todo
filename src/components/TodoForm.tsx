import { useState, type FormEvent } from 'react';
import { type CreateTodoInput } from '../types';
import { createTodoApi } from '../api/todos';

interface TodoFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const TodoForm = ({ onSuccess, onError }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);

    const todo: CreateTodoInput = {
      title: title.trim(),
      content: content.trim() || null,
      due_date: dueDate || null,
    };

    try {
      await createTodoApi(todo);
      setTitle('');
      setContent('');
      setDueDate('');
      onSuccess?.();
    } catch {
      onError?.('Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Description</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <button type="submit" disabled={isSubmitting || !title.trim()}>
        {isSubmitting ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
};
