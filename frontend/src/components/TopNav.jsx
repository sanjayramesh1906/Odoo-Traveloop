import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';

const TopNav = () => {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <h2 style={styles.pageTitle}>Traveloop</h2>
      </div>
      
      <div style={styles.actions}>
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search destinations..." 
            style={styles.searchInput}
          />
        </div>
        
        <button style={styles.iconButton}>
          <Bell size={20} />
        </button>
        <button style={styles.iconButton}>
          <Settings size={20} />
        </button>
        
        <div style={styles.profileAvatar}>
          <User size={20} color="#fff" />
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 2rem',
    backgroundColor: 'var(--bg-main)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary)',
    margin: 0,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-secondary)',
  },
  searchInput: {
    padding: '0.6rem 1rem 0.6rem 2.5rem',
    borderRadius: '9999px',
    border: 'none',
    backgroundColor: '#E5E7EB',
    outline: 'none',
    fontSize: '0.875rem',
    width: '250px',
    fontFamily: 'inherit',
    transition: 'width 0.2s, background-color 0.2s',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  profileAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0.5rem',
    cursor: 'pointer',
  }
};

export default TopNav;
