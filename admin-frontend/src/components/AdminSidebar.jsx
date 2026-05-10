import React from 'react';
import { LayoutDashboard, Users, MapPin, Activity, Settings, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside className="sidebar flex-col justify-between" style={styles.sidebar}>
      <div>
        <div style={styles.brandContainer}>
          <div style={{ ...styles.avatar, borderColor: '#EF4444' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
          </div>
          <h1 style={{ ...styles.brandTitle, color: '#EF4444' }}>Traveloop Admin</h1>
          <p style={styles.brandSubtitle}>System Control</p>
        </div>

        <nav style={styles.nav}>
          <a href="#" style={{ ...styles.navItem, ...styles.navItemActive }}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" style={styles.navItem}>
            <Users size={20} />
            <span>Users</span>
          </a>
          <a href="#" style={styles.navItem}>
            <MapPin size={20} />
            <span>Destinations</span>
          </a>
          <a href="#" style={styles.navItem}>
            <Activity size={20} />
            <span>System Logs</span>
          </a>
          <a href="#" style={styles.navItem}>
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>
      </div>

      <div style={styles.bottomContainer}>
        <button className="btn w-full flex items-center" style={{ justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#DC2626' }}>
          <LogOut size={20} />
          Logout
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

export default AdminSidebar;
