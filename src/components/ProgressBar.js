import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total, label = "questions answered" }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="progress-indicator">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="progress-text">
        {current} of {total} {label}
      </p>
    </div>
  );
};

export default ProgressBar;

