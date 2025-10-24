import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import ProgressBar from './ProgressBar';
import Loading from './Loading';
import './Quiz.css';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/${id}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const updateProgress = () => {
    const totalQuestions = quiz?.questions?.length || 0;
    const answeredQuestions = Object.keys(answers).length;
    const percentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const submitBtn = document.querySelector('button[type="submit"]');
    
    if (progressFill) {
      progressFill.style.width = percentage + '%';
    }
    
    if (progressText) {
      progressText.textContent = `${answeredQuestions} of ${totalQuestions} questions answered`;
    }
    
    if (submitBtn) {
      if (answeredQuestions === totalQuestions && totalQuestions > 0) {
        submitBtn.style.background = 'linear-gradient(135deg, #4facfe, #00f2fe)';
        submitBtn.textContent = '🚀 Submit Answers (Ready!)';
      } else {
        submitBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        submitBtn.textContent = '🚀 Submit Answers';
      }
    }
  };

  useEffect(() => {
    if (quiz) {
      updateProgress();
    }
  }, [answers, quiz]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for unanswered questions
    const totalQuestions = quiz?.questions?.length || 0;
    const answeredQuestions = Object.keys(answers).length;
    
    if (answeredQuestions < totalQuestions) {
      alert(`Please answer all questions! You have ${totalQuestions - answeredQuestions} unanswered question(s).`);
      return;
    }
    
    if (!confirm('Are you sure you want to submit your answers? You cannot change them after submission.')) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Send JSON instead of FormData so the server's JSON parser can handle it
      const payload = {};
      Object.keys(answers).forEach(key => {
        payload[key] = answers[key];
      });

      const response = await fetch(`/api/quiz/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const resultData = await response.json();
        console.log('Quiz submission successful:', resultData); // Add logging
        // Store results in localStorage before navigation
        localStorage.setItem(`quiz_results_${id}`, JSON.stringify(resultData));
        // Ensure storage was successful
        const stored = localStorage.getItem(`quiz_results_${id}`);
        if (!stored) {
          throw new Error('Failed to store quiz results');
        }
        // Redirect to results page
        navigate(`/results/${id}`);
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        alert('Error submitting quiz. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="🎯 Loading Quiz..." showBack={true}>
        <Loading message="Loading quiz..." />
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout title="🎯 Quiz Not Found" showBack={true}>
        <div className="error">Quiz not found. Please check the URL and try again.</div>
      </Layout>
    );
  }

  return (
    <Layout title={`🎯 ${quiz.title}`} showBack={true}>
      <div className="quiz-intro">
        <h2>📝 Ready to Test Your Knowledge?</h2>
        <p>Answer all questions below and submit when you're ready. Good luck! 🍀</p>
        <ProgressBar 
          current={Object.keys(answers).length} 
          total={quiz.questions.length} 
        />
      </div>
        
        <form onSubmit={handleSubmit} className="quiz-form">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="question">
              <p><strong>Question {index + 1}:</strong> {question.question}</p>
              
              {question.type === 'mcq' && (
                <div className="options">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="option">
                      <label>
                        <input
                          type="radio"
                          name={`q_${question.id}`}
                          value={option}
                          checked={answers[`q_${question.id}`] === option}
                          onChange={(e) => handleAnswerChange(`q_${question.id}`, e.target.value)}
                          required
                        />
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'tf' && (
                <div className="options">
                  <div className="option">
                    <label>
                      <input
                        type="radio"
                        name={`q_${question.id}`}
                        value="true"
                        checked={answers[`q_${question.id}`] === 'true'}
                        onChange={(e) => handleAnswerChange(`q_${question.id}`, e.target.value)}
                        required
                      />
                      True
                    </label>
                  </div>
                  <div className="option">
                    <label>
                      <input
                        type="radio"
                        name={`q_${question.id}`}
                        value="false"
                        checked={answers[`q_${question.id}`] === 'false'}
                        onChange={(e) => handleAnswerChange(`q_${question.id}`, e.target.value)}
                        required
                      />
                      False
                    </label>
                  </div>
                </div>
              )}
              
              {question.type === 'text' && (
                <input
                  type="text"
                  name={`q_${question.id}`}
                  value={answers[`q_${question.id}`] || ''}
                  onChange={(e) => handleAnswerChange(`q_${question.id}`, e.target.value)}
                  required
                  placeholder="Your answer here..."
                />
              )}
            </div>
          ))}
          
          <div className="submit-section">
            <button 
              type="submit" 
              className="button primary"
              disabled={submitting}
            >
              {submitting ? '🚀 Submitting...' : '🚀 Submit Answers'}
            </button>
            <p className="submit-note">Make sure you've answered all questions before submitting!</p>
          </div>
        </form>
    </Layout>
  );
};

export default Quiz;
