import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './WelcomePage.css';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // If already logged in skip to dashboard
  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  return (
    <div className="welcome-root">
      <div className="welcome-card">
        {/* Logo shapes */}
        <div className="logo-shapes">
          <span className="shape-square" />
          <span className="shape-circle" />
          <span className="shape-diamond" />
        </div>

        {/* Wordmark */}
        <h1 className="wordmark">Traveloop</h1>
        <p className="tagline">Plan every loop of your journey</p>

        {/* CTA */}
        <button
          id="welcome-begin-btn"
          className="btn-outline"
          onClick={() => navigate('/login')}
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
}
