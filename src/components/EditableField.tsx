import { useState, useEffect, useRef } from 'react';
import './EditableField.css';

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  type?: 'text' | 'textarea' | 'date';
  placeholder?: string;
  className?: string;
}

export default function EditableField({
  value,
  onSave,
  type = 'text',
  placeholder = "Cliquer pour éditer",
  className
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onSave(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  if (isEditing) {
    if (type === 'textarea') {
      return (
        <textarea
          ref={inputRef as never}
          className={['editable-input', className].filter(Boolean).join(' ')}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          rows={3}
        />
      );
    }

    return (
      <input
        ref={inputRef as never}
        type={type}
        className={['editable-input', className].filter(Boolean).join(' ')}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <span
      className={['editable-view', !value ? 'empty' : '', className].filter(Boolean).join(' ')}
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Cliquez pour modifier"
    >
      {value || placeholder}
    </span>
  );
}