/*
 * Simple Quiz Management System server
 *
 * This server uses only built‑in Node.js modules to serve static assets,
 * handle form submissions and maintain quiz data in a JSON file.  See
 * `PLAN.md` for the architecture and data schema.
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

// Serve static files from the "public" directory
function serveStaticFile(req, res) {
  const filePath = path.join(__dirname, req.url.split('?')[0]);
  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
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

// Generate the home page listing all quizzes
function serveHomePage(res) {
  const data = loadData();
  const quizzes = data.quizzes;
  // Build list items
  let listItems = '';
  if (quizzes.length === 0) {
    listItems = '<li>No quizzes found. <a href="/admin">Create one now</a>.</li>';
  } else {
    listItems = quizzes
      .map(q => `<li><a href="/quiz/${encodeURIComponent(q.id)}">${q.title}</a></li>`) 
      .join('\n');
  }
  // Load the template
  const templatePath = path.join(__dirname, 'views', 'index.html');
  let template = fs.readFileSync(templatePath, 'utf8');
  template = template.replace('{{quizList}}', listItems);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(template);
}

// Serve the admin page
function serveAdminPage(res) {
  const templatePath = path.join(__dirname, 'views', 'admin.html');
  fs.readFile(templatePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading admin page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
}

// Serve a specific quiz for taking
function serveQuizPage(res, quizId) {
  const data = loadData();
  const quiz = data.quizzes.find(q => q.id === quizId);
  if (!quiz) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Quiz not found');
    return;
  }
  // Build HTML for questions
  let questionsHtml = '';
  quiz.questions.forEach((q, idx) => {
    const qIndex = idx + 1;
    let inputHtml = '';
    if (q.type === 'mcq') {
      // Multiple choice: list radio buttons for each option
      inputHtml = q.options
        .map((opt, optIdx) => {
          return (
            `<div class="option">
              <label>
                <input type="radio" name="q_${q.id}" value="${opt}" required>
                ${opt}
              </label>
            </div>`
          );
        })
        .join('\n');
    } else if (q.type === 'tf') {
      inputHtml = ['true', 'false']
        .map(opt => {
          return (
            `<div class="option">
              <label>
                <input type="radio" name="q_${q.id}" value="${opt}" required>
                ${opt.charAt(0).toUpperCase() + opt.slice(1)}
              </label>
            </div>`
          );
        })
        .join('\n');
    } else if (q.type === 'text') {
      inputHtml = `<input type="text" name="q_${q.id}" required>`;
    }
    questionsHtml += `
      <div class="question">
        <p><strong>Question ${qIndex}:</strong> ${q.question}</p>
        ${inputHtml}
      </div>
    `;
  });
  // Load template and inject content
  const templatePath = path.join(__dirname, 'views', 'quiz.html');
  let template = fs.readFileSync(templatePath, 'utf8');
  template = template
    .replace(/{{quizTitle}}/g, quiz.title)
    .replace(/{{quizId}}/g, quiz.id)
    .replace('{{quizContent}}', questionsHtml);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(template);
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
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Quiz not found');
    return;
  }
  parseRequestBody(req, form => {
    if (!form) {
      res.writeHead(400);
      res.end('Invalid submission');
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
    // Build result HTML
    let resultRows = '';
    results.forEach((r, idx) => {
      const status = r.isCorrect ? 'correct' : 'incorrect';
      resultRows += `<tr class="${status}"><td>${idx + 1}</td><td>${r.question}</td><td>${r.userAnswer || ''}</td><td>${r.correctAnswer}</td><td>${r.isCorrect ? '✔' : '✘'}</td></tr>`;
    });
    const resultHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Quiz Results</title>
        <link rel="stylesheet" href="/public/style.css">
        <style>
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .correct { background-color: #e6ffed; }
          .incorrect { background-color: #ffe6e6; }
        </style>
      </head>
      <body>
        <h1>Results for "${quiz.title}"</h1>
        <p>Your Score: ${score} / ${total}</p>
        <table>
          <thead><tr><th>#</th><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Result</th></tr></thead>
          <tbody>
            ${resultRows}
          </tbody>
        </table>
        <p><a href="/">Back to quiz list</a></p>
      </body>
      </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(resultHtml);
  });
}

// Main HTTP server logic
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  // Serve static files under /public
  if (pathname.startsWith('/public/')) {
    serveStaticFile(req, res);
    return;
  }
  if (req.method === 'GET' && pathname === '/') {
    serveHomePage(res);
    return;
  }
  if (req.method === 'GET' && pathname === '/admin') {
    serveAdminPage(res);
    return;
  }
  // Serve quiz page
  const quizMatch = pathname.match(/^\/quiz\/([A-Za-z0-9_]+)$/);
  if (req.method === 'GET' && quizMatch) {
    const quizId = decodeURIComponent(quizMatch[1]);
    serveQuizPage(res, quizId);
    return;
  }
  // API to create quiz
  if (req.method === 'POST' && pathname === '/api/create-quiz') {
    handleCreateQuiz(req, res);
    return;
  }
  // API to submit quiz answers
  const quizSubmitMatch = pathname.match(/^\/api\/quiz\/([A-Za-z0-9_]+)$/);
  if (req.method === 'POST' && quizSubmitMatch) {
    const quizId = decodeURIComponent(quizSubmitMatch[1]);
    handleQuizSubmission(req, res, quizId);
    return;
  }
  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});