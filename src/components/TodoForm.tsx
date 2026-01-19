import { useActionState } from 'react';
import './TodoForm.css';

interface FormState {
  success: boolean;
  message: string;
  key?: number;
}

interface TodoFormProps {
  onAddTodo: (title: string, content: string, due_date: string) => Promise<void>;
}

const initialState: FormState = {
  success: false,
  message: '',
  key: 0
};

export default function TodoForm({ onAddTodo }: TodoFormProps) {

  const createTodoAction = async (prevState: FormState, formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const due_date = formData.get('due_date') as string;

    if (!title || !title.trim()) {
      return { ...prevState, success: false, message: 'Le titre est obligatoire.' };
    }

    try {
      await onAddTodo(title, content, due_date);
      return { success: true, message: 'Tâche ajoutée !', key: Date.now() };
    } catch (error) {
      return { ...prevState, success: false, message: "Erreur lors de l'ajout." };
    }
  };

  const [formState, formAction, isPending] = useActionState(createTodoAction, initialState);

  return (
    <form
      className="todo-form"
      action={formAction}
      key={formState?.key}
    >
      {formState?.message && (
        <div className={formState.success ? "success-message" : "error-message"}>
          {formState.message}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">Titre *</label>
        <input type="text" name="title" id="title" disabled={isPending} />
      </div>

      <div className="form-group">
        <label htmlFor="due_date">Date d'échéance</label>
        <input type="date" name="due_date" id="due_date" disabled={isPending} />
      </div>

      <div className="form-group">
        <label htmlFor="content">Description</label>
        <textarea name="content" id="content" rows={3} disabled={isPending} />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Envoi...' : 'Ajouter la tâche'}
      </button>
    </form>
  );
}