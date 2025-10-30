import React from 'react';
import './Question.css';

const Question = ({ 
  question, 
  index, 
  onUpdate, 
  onRemove, 
  onAddOption, 
  onRemoveOption, 
  onUpdateOption 
}) => {
  const handleTypeChange = (e) => {
    onUpdate(question.id, 'type', e.target.value);
  };

  const handleQuestionChange = (e) => {
    onUpdate(question.id, 'question', e.target.value);
  };

  const handleAnswerChange = (e) => {
    onUpdate(question.id, 'answer', e.target.value);
  };

  const handleOptionChange = (optionIndex, value) => {
    onUpdateOption(question.id, optionIndex, value);
  };

  const handleCorrectAnswerChange = (option) => {
    onUpdate(question.id, 'answer', option);
  };

  return (
    <div className="question-block">
      <h4>Question {index + 1}</h4>
      
      <div className="form-group">
        <label>Type</label>
        <select
          value={question.type}
          onChange={handleTypeChange}
        >
          <option value="mcq">Multiple Choice</option>
          <option value="tf">True/False</option>
          <option value="text">Short Text</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Question Text</label>
        <input
          type="text"
          value={question.question}
          onChange={handleQuestionChange}
          required
          placeholder="Enter your question..."
        />
      </div>
      
      {question.type === 'mcq' && (
        <div className="options-container">
          <label>Options</label>
          {question.options.map((option, optIndex) => (
            <div key={optIndex} className="option-input">
              <input
                type="radio"
                name={`correct_${question.id}`}
                onChange={() => handleCorrectAnswerChange(option)}
                checked={question.answer === option}
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                placeholder="Option text..."
                required
              />
              <button
                type="button"
                className="button remove"
                onClick={() => onRemoveOption(question.id, optIndex)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="button"
            onClick={() => onAddOption(question.id)}
          >
            Add Option
          </button>
        </div>
      )}
      
      {question.type === 'tf' && (
        <div className="form-group">
          <label>Correct Answer</label>
          <select
            value={question.answer}
            onChange={handleAnswerChange}
            required
          >
            <option value="">Select answer...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      )}
      
      {question.type === 'text' && (
        <div className="form-group">
          <label>Expected Answer</label>
          <input
            type="text"
            value={question.answer}
            onChange={handleAnswerChange}
            required
            placeholder="Enter the correct answer..."
          />
        </div>
      )}
      
      <div className="button-group">
        <button
          type="button"
          className="button remove"
          onClick={() => onRemove(question.id)}
        >
          Remove Question
        </button>
      </div>
    </div>
  );
};

export default Question;

