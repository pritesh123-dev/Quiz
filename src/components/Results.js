import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from './Layout';
import Loading from './Loading';
import './Results.css';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch results from localStorage or API
    const storedResults = localStorage.getItem(`quiz_results_${id}`);
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (error) {
        console.error('Error parsing results:', error);
        navigate(`/quiz/${id}`);
      }
    } else {
      // If no stored results, redirect to quiz
      navigate(`/quiz/${id}`);
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout title="🎯 Loading Results..." showBack={true}>
        <Loading message="Loading your results..." />
      </Layout>
    );
  }

  if (!results) {
    return (
      <Layout title="🎯 Results Not Found" showBack={true}>
        <div className="error">Results not found. Please try taking the quiz again.</div>
      </Layout>
    );
  }

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 80) return '🎉 Excellent!';
    if (percentage >= 60) return '👍 Good job!';
    return '💪 Keep practicing!';
  };

  return (
    <Layout title="🎯 Quiz Results" showBack={true}>
        <div className="results-container">
          <div className="score-section">
            <h2>📊 Your Results for "{results.quizTitle}"</h2>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{results.score}</span>
                <span className="score-total">/ {results.total}</span>
              </div>
              <div className="score-details">
                <p className="percentage">{results.percentage}%</p>
                <p className="performance">{getPerformanceMessage(results.percentage)}</p>
              </div>
            </div>
          </div>
          
          <div className="results-table">
            <h3>📝 Detailed Results</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Your Answer</th>
                  <th>Correct Answer</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {results.results.map((result, index) => (
                  <tr key={index} className={result.isCorrect ? 'correct' : 'incorrect'}>
                    <td>{index + 1}</td>
                    <td>{result.question}</td>
                    <td>{result.userAnswer || 'No answer'}</td>
                    <td>{result.correctAnswer}</td>
                    <td>{result.isCorrect ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="action-buttons">
            <Link to="/" className="button primary">🏠 Back to Quiz List</Link>
            <Link to={`/quiz/${id}`} className="button">🔄 Retake Quiz</Link>
          </div>
        </div>
    </Layout>
  );
};

export default Results;
