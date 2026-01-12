import './ErrorNotification.css';

interface ErrorNotificationProps {
  message: string | null;
  onClose: () => void;
}

export default function ErrorNotification({ message, onClose }: ErrorNotificationProps) {
  if (!message) return null;
  return (
    <div className="error-notification" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
      </div>
      <button
        className="error-close-btn"
        onClick={onClose}
        aria-label="Fermer le message d'erreur"
      >
        ✕
      </button>
    </div>
  );
}