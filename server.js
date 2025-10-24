/*
 * Quiz Management System - React Server
 *
 * This server serves the React application and provides API endpoints
 * for quiz management. The React app handles the frontend routing and UI.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'db.json');

// Helper to load quizzes from the JSON file
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    // If file doesn't exist or is invalid, start with an empty object
    return { quizzes: [] };
  }
}

// Helper to save quizzes to the JSON file
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Determine content type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

// Serve static files from the "dist" directory (React build)
function serveStaticFile(req, res) {
  const filePath = path.join(__dirname, 'dist', req.url.split('?')[0]);
  if (!filePath.startsWith(path.join(__dirname, 'dist'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
    res.end(content);
  });
}

// Serve the React app (SPA)
function serveReactApp(res) {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  fs.readFile(indexPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('React app not built. Run "npm run build" first.');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
}

// API endpoint to get all quizzes
function handleGetQuizzes(res) {
  const data = loadData();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// API endpoint to get a specific quiz
function handleGetQuiz(res, quizId) {
  const data = loadData();
  const quiz = data.quizzes.find(q => q.id === quizId);
  if (!quiz) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Quiz not found' }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(quiz));
}

// Parse body data from a POST request
function parseRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
    // Protect against large bodies
    if (body.length > 1e7) req.connection.destroy();
  });
  req.on('end', () => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      try {
        callback(JSON.parse(body));
      } catch (e) {
        callback(null);
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      callback(querystring.parse(body));
    } else {
      // Unsupported content type
      callback(null);
    }
  });
}

// Handle creating a quiz (admin submission)
function handleCreateQuiz(req, res) {
  parseRequestBody(req, data => {
    if (!data) {
      res.writeHead(400);
      res.end('Invalid data');
      return;
    }
    // Expect data to contain title and questions
    const { title, questions } = data;
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      res.writeHead(400);
      res.end('Invalid quiz payload');
      return;
    }
    const db = loadData();
    // Generate unique quiz ID
    const quizId = `quiz_${Date.now()}`;
    // Assign question IDs
    questions.forEach((q, idx) => {
      q.id = `q${idx + 1}`;
      // Trim values
      q.question = (q.question || '').trim();
      if (q.type === 'mcq') {
        q.options = (q.options || []).map(o => o.trim());
        q.answer = (q.answer || '').trim();
      } else if (q.type === 'tf') {
        q.answer = (q.answer || '').toLowerCase();
      } else if (q.type === 'text') {
        q.answer = (q.answer || '').trim();
      }
    });
    const newQuiz = { id: quizId, title: title.trim(), questions };
    db.quizzes.push(newQuiz);
    saveData(db);
    // Redirect to quiz page or send JSON response
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, id: quizId }));
  });
}

// Handle quiz submission and scoring
function handleQuizSubmission(req, res, quizId) {
  const db = loadData();
  const quiz = db.quizzes.find(q => q.id === quizId);
  if (!quiz) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Quiz not found' }));
    return;
  }
  parseRequestBody(req, form => {
    if (!form) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid submission' }));
      return;
    }
    // Compute score
    const total = quiz.questions.length;
    let score = 0;
    const results = [];
    quiz.questions.forEach(q => {
      const userAnswer = form[`q_${q.id}`];
      const correct = (q.answer || '').toString().trim();
      let isCorrect = false;
      if (q.type === 'mcq' || q.type === 'text') {
        // For text, case insensitive comparison
        isCorrect = typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === correct.toLowerCase();
      } else if (q.type === 'tf') {
        isCorrect = typeof userAnswer === 'string' && userAnswer.toLowerCase() === correct.toLowerCase();
      }
      if (isCorrect) score++;
      results.push({ question: q.question, userAnswer, correctAnswer: q.answer, isCorrect });
    });
    
    const percentage = Math.round((score / total) * 100);
    const performanceMessage = percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👍 Good job!' : '💪 Keep practicing!';
    
    const resultData = {
      quizTitle: quiz.title,
      score,
      total,
      percentage,
      performanceMessage,
      results
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(resultData));
  });
}

// Main HTTP server logic
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  
  // Set CORS headers for API requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Serve static files from dist directory
  if (pathname.startsWith('/static/') || pathname.includes('.')) {
    serveStaticFile(req, res);
    return;
  }
  
  // API endpoints
  if (req.method === 'GET' && pathname === '/api/quizzes') {
    handleGetQuizzes(res);
    return;
  }
  
  const quizMatch = pathname.match(/^\/api\/quiz\/([A-Za-z0-9_]+)$/);
  if (req.method === 'GET' && quizMatch) {
    const quizId = decodeURIComponent(quizMatch[1]);
    handleGetQuiz(res, quizId);
    return;
  }
  
  // API to create quiz
  if (req.method === 'POST' && pathname === '/api/create-quiz') {
    handleCreateQuiz(req, res);
    return;
  }
  
  // API to submit quiz answers
  if (req.method === 'POST' && quizMatch) {
    const quizId = decodeURIComponent(quizMatch[1]);
    handleQuizSubmission(req, res, quizId);
    return;
  }
  
  // Serve React app for all other routes (SPA)
  serveReactApp(res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});