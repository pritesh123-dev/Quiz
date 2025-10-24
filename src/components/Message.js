import React, { useEffect, useState } from 'react';
import './Message.css';

const Message = ({ message, type = 'info', autoHide = false, duration = 5000 }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      if (autoHide && type === 'success') {
        const timer = setTimeout(() => {
          setVisible(false);
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [message, type, autoHide, duration]);

  if (!visible || !message) return null;

  return (
    <div className={`message ${type}`}>
      {message}
    </div>
  );
};

export default Message;
