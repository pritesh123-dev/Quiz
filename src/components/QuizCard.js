import React from 'react';
import { Link } from 'react-router-dom';
import './QuizCard.css';

const QuizCard = ({ quiz, onTakeQuiz }) => {
  const handleClick = () => {
    if (onTakeQuiz) {
      onTakeQuiz(quiz.id);
    }
  };

  return (
    <div className="quiz-card">
      <div className="quiz-card-content">
        <h3 className="quiz-title">{quiz.title}</h3>
        <p className="quiz-meta">
          {quiz.questions?.length || 0} questions
        </p>
        <div className="quiz-actions">
          <Link 
            to={`/quiz/${quiz.id}`} 
            className="button primary"
            onClick={handleClick}
          >
            🚀 Take Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;

