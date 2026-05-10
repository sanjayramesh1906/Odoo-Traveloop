import React from 'react';
import { Compass, Map, BarChart2, Users, Settings, Plus } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar flex-col justify-between" style={styles.sidebar}>
      <div>
        <div style={styles.brandContainer}>
          <div style={styles.avatar}>
            <span style={{ fontSize: '1.5rem' }}>🌍</span>
          </div>
          <h1 style={styles.brandTitle}>Traveloop</h1>
          <p style={styles.brandSubtitle}>Modern Nomad</p>
        </div>

        <nav style={styles.nav}>
          <a href="#" style={styles.navItem}>
            <Compass size={20} />
            <span>Explorer</span>
          </a>
          <a href="#" style={{ ...styles.navItem, ...styles.navItemActive }}>
            <Map size={20} />
            <span>My Trips</span>
          </a>
          <a href="#" style={styles.navItem}>
            <BarChart2 size={20} />
            <span>Insights</span>
          </a>
          <a href="#" style={styles.navItem}>
            <Users size={20} />
            <span>Shared</span>
          </a>
          <a href="#" style={styles.navItem}>
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>
      </div>

      <div style={styles.bottomContainer}>
        <button className="btn btn-primary w-full flex items-center" style={{ justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}>
          <Plus size={20} />
          New Trip
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#fff',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    padding: '2rem 1.5rem',
    flexShrink: 0,
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    border: '2px solid var(--primary)',
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--primary)',
    marginBottom: '0.25rem',
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navItemActive: {
    backgroundColor: 'var(--primary)',
    color: '#fff',
  },
  bottomContainer: {
    marginTop: 'auto',
  }
};

export default Sidebar;
