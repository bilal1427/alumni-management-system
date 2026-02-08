import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Connecting Generations. Empowering Futures.</h1>
            <p className="hero-subtitle">
              Join our thriving alumni network and unlock endless opportunities
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/login')} className="btn btn-primary">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-secondary">
                Register
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="roles-section">
        <h2 className="section-title">Who Are You?</h2>
        <div className="role-cards">
          <div className="role-card">
            <div className="role-icon">🎓</div>
            <h3>Student</h3>
            <p>Connect with alumni, explore career opportunities, and get mentorship</p>
          </div>
          <div className="role-card">
            <div className="role-icon">👔</div>
            <h3>Alumni</h3>
            <p>Give back, post job opportunities, and mentor the next generation</p>
          </div>
          <div className="role-card">
            <div className="role-icon">⚙️</div>
            <h3>Admin</h3>
            <p>Manage the platform, approve alumni, and organize events</p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <blockquote>
          "The best way to predict the future is to create it together"
        </blockquote>
        <p className="quote-author">- Alumni Community</p>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h3>500+</h3>
          <p>Active Alumni</p>
        </div>
        <div className="stat-item">
          <h3>1000+</h3>
          <p>Students</p>
        </div>
        <div className="stat-item">
          <h3>200+</h3>
          <p>Job Opportunities</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Events Organized</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Alumni Management System. All rights reserved.</p>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
