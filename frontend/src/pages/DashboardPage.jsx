import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      background: 'var(--color-bg)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 500 }}>
        👋 Welcome, {user?.name || 'Traveller'}!
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>Dashboard coming soon…</p>
      <button
        id="logout-btn"
        onClick={handleLogout}
        style={{
          padding: '10px 28px',
          background: '#1a1a1a',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
        }}
      >
        Log out
      </button>
    </div>
  );
}
