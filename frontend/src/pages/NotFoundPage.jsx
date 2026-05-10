import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '12px',
      background: 'var(--color-bg)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 300, margin: 0 }}>404</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>Page not found.</p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 24px',
          background: '#1a1a1a',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Go Home
      </button>
    </div>
  );
}
