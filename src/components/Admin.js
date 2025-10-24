import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Question from './Question';
import Message from './Message';
import './Admin.css';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'mcq',
      question: '',
      options: ['', ''],
      answer: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: [...q.options, ''] }
        : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map((opt, idx) => 
              idx === optionIndex ? value : opt
            )
          }
        : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.filter((_, idx) => idx !== optionIndex)
          }
        : q
    ));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/create-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, questions }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`🎉 Quiz created successfully! You can take it here: ${window.location.origin}/quiz/${data.id}`);
        setTitle('');
        setQuestions([]);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setMessage('❌ Error creating quiz. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Failed to create quiz. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewQuiz = () => {
    if (!title.trim()) {
      setMessage('Please enter a quiz title first');
      return;
    }
    if (questions.length === 0) {
      setMessage('Please add at least one question');
      return;
    }
    
    // Create preview window
    const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    let previewContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview: ${title}</title>
        <link rel="stylesheet" href="/src/App.css">
      </head>
      <body>
        <header class="header">
          <h1>👁️ Preview: ${title}</h1>
          <nav><button onclick="window.close()">❌ Close Preview</button></nav>
        </header>
        <main class="main">
          <div class="quiz-intro">
            <h2>📝 Quiz Preview</h2>
            <p>This is how your quiz will look to users</p>
          </div>
          <div class="quiz-form">
    `;
    
    questions.forEach((q, idx) => {
      if (!q.question.trim()) return;
      
      previewContent += `<div class="question"><p><strong>Question ${idx + 1}:</strong> ${q.question}</p>`;
      
      if (q.type === 'mcq') {
        q.options.forEach(opt => {
          if (opt.trim()) {
            previewContent += `<div class="option"><label><input type="radio" disabled> ${opt}</label></div>`;
          }
        });
      } else if (q.type === 'tf') {
        previewContent += `
          <div class="option"><label><input type="radio" disabled> True</label></div>
          <div class="option"><label><input type="radio" disabled> False</label></div>
        `;
      } else if (q.type === 'text') {
        previewContent += `<input type="text" disabled placeholder="Your answer here...">`;
      }
      
      previewContent += '</div>';
    });
    
    previewContent += `
          </div>
        </main>
      </body>
      </html>
    `;
    
    previewWindow.document.write(previewContent);
    previewWindow.document.close();
  };

  return (
    <Layout title="✏️ Create a New Quiz" showBack={true}>
      <div className="form-container">
        <div className="form-header">
          <h2>📝 Quiz Details</h2>
          <p>Fill in the details below to create your quiz</p>
        </div>
        
        <form onSubmit={handleSubmit} className={loading ? 'loading' : ''}>
          <div className="form-group">
            <label htmlFor="quiz-title">🎯 Quiz Title</label>
            <input
              type="text"
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter an engaging quiz title..."
            />
          </div>
          
          <div className="questions-section">
            <h3>❓ Questions</h3>
            {questions.map((question, index) => (
              <Question
                key={question.id}
                question={question}
                index={index}
                onUpdate={updateQuestion}
                onRemove={removeQuestion}
                onAddOption={addOption}
                onRemoveOption={removeOption}
                onUpdateOption={updateOption}
              />
            ))}
            
            <button
              type="button"
              className="button"
              onClick={addQuestion}
            >
              ➕ Add Question
            </button>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="button primary" disabled={loading}>
              {loading ? '💾 Saving...' : '💾 Save Quiz'}
            </button>
            <button
              type="button"
              className="button"
              onClick={previewQuiz}
            >
              👁️ Preview
            </button>
          </div>
        </form>
        
        <Message 
          message={message} 
          type={message.includes('❌') ? 'error' : 'success'} 
          autoHide={true}
        />
      </div>
    </Layout>
  );
};

export default Admin;
