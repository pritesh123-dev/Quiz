const fs = require('fs');
const path = require('path');

console.log('🎯 Setting up React Quiz System...\n');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log('📁 Created dist directory');
}

// Create a simple index.html for development
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Management System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .setup-message {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    .setup-message h1 {
      color: #667eea;
      margin-bottom: 1rem;
    }
    .setup-message p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    .button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  </style>
</head>
<body>
  <div class="setup-message">
    <h1>🎯 Quiz Management System</h1>
    <p>React application is being built. Please wait...</p>
    <p>If you see this message, run:</p>
    <code>npm run build</code>
    <br><br>
    <a href="/" class="button">🔄 Refresh</a>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
console.log('📄 Created temporary index.html');

console.log('\n✅ Setup completed!');
console.log('📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run build');
console.log('3. Run: npm start');
console.log('4. Open: http://localhost:3000');
