import { useEffect, useState } from "react";

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const clearNotification = () => setNotification(null);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setNotification(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification]);

  return { notification, showNotification, clearNotification };
};
