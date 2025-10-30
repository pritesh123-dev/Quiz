const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building React Quiz System...\n');

try {
  // Check if node_modules exists
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Build the React app
  console.log('🔨 Building React application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
  console.log('🎯 You can now run: npm start');
  console.log('🌐 Open http://localhost:3000 in your browser');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

