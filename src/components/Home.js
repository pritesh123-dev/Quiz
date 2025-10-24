import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import QuizCard from './QuizCard';
import Loading from './Loading';
import './Home.css';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="🎯 Quiz Management System">
        <Loading message="Loading quizzes..." />
      </Layout>
    );
  }

  return (
    <Layout title="🎯 Quiz Management System">
      <div className="hero-section">
        <h2>📚 Available Quizzes</h2>
        <p>Choose a quiz below to test your knowledge and challenge yourself!</p>
      </div>
      
      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No quizzes available yet</h3>
          <p>Be the first to create an amazing quiz!</p>
          <Link to="/admin" className="button primary">Create Your First Quiz</Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Home;
