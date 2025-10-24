# Quiz Management System - React Version

A modern, responsive quiz management system built with React, featuring beautiful UI/UX and comprehensive functionality.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, React Router, and modern JavaScript
- **Beautiful UI/UX**: Gradient backgrounds, animations, and responsive design
- **Admin Interface**: Create quizzes with multiple question types (MCQ, True/False, Text)
- **Progress Tracking**: Real-time progress indicators and smart validation
- **Results System**: Beautiful results page with performance feedback
- **Mobile Responsive**: Works perfectly on all devices
- **Preview Functionality**: Preview quizzes before publishing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the React App**
   ```bash
   npm run build
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

## 🏗️ Development

For development with hot reloading:

```bash
npm run build:dev
```

## 📁 Project Structure

```
quiz-system/
├── src/
│   ├── components/          # React components
│   │   ├── Home.js         # Home page component
│   │   ├── Admin.js        # Admin interface
│   │   ├── Quiz.js         # Quiz taking interface
│   │   └── Results.js      # Results display
│   ├── App.js              # Main App component
│   ├── App.css             # Global styles
│   └── index.js            # React entry point
├── public/
│   └── index.html          # HTML template
├── dist/                   # Built React app (generated)
├── server.js               # Node.js server
├── db.json                 # Quiz data storage
├── package.json            # Dependencies
├── webpack.config.js       # Webpack configuration
└── README.md               # This file
```

## 🎯 API Endpoints

- `GET /api/quizzes` - Get all quizzes
- `GET /api/quiz/:id` - Get specific quiz
- `POST /api/create-quiz` - Create new quiz
- `POST /api/quiz/:id` - Submit quiz answers

## 🎨 Features

### Admin Interface
- Dynamic question creation
- Multiple question types support
- Live preview functionality
- Form validation and error handling
- Responsive design

### Quiz Taking
- Progress tracking with visual indicators
- Smart validation system
- Real-time feedback
- Mobile-optimized interface

### Results System
- Beautiful score visualization
- Detailed answer breakdown
- Performance feedback
- Retake functionality

## 🔧 Customization

The system is built with modern CSS and React patterns, making it easy to customize:

- **Styling**: Modify CSS files in the `src/` directory
- **Components**: Update React components for new functionality
- **API**: Extend server.js for additional endpoints

## 🚀 Deployment

1. Build the React app: `npm run build`
2. Deploy the entire project to your hosting platform
3. Ensure Node.js is available on your server
4. Run `npm start` to start the server

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

---

Built with ❤️ using React and modern web technologies.
