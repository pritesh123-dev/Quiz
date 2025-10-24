import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children, title, showBack = false }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>{title}</h1>
        <nav className="nav">
          {showBack && <Link to="/">🏠 Back to Home</Link>}
          <Link to="/admin">➕ Create New Quiz</Link>
        </nav>
      </header>
      <main className="main">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2024 Quiz Management System. Built with ❤️ for learning.</p>
      </footer>
    </div>
  );
};

export default Layout;
