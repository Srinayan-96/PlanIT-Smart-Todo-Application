function Notification({ notification, onClose }) {
  if (!notification) {
    return null;
  }

  return (
    <div className={`toast ${notification.type === "error" ? "error" : ""}`}>
      <span>{notification.message}</span>
      <button className="action-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default Notification;
