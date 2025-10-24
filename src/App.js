import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import Quiz from './components/Quiz';
import Results from './components/Results';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/results/:id" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
