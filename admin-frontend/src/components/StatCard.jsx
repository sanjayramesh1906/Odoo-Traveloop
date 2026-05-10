import React from 'react';

const StatCard = ({ title, value, trend, icon: Icon, color }) => {
  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.title}>{title}</p>
          <h3 style={styles.value}>{value}</h3>
        </div>
        <div style={{ ...styles.iconContainer, backgroundColor: `${color}20`, color: color }}>
          <Icon size={24} />
        </div>
      </div>
      <div style={styles.footer}>
        <span style={{ color: trend >= 0 ? 'var(--btn-green)' : 'var(--btn-red)', fontWeight: '600', fontSize: '0.875rem' }}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
        <span style={styles.trendText}>from last month</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
  },
  value: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  iconContainer: {
    padding: '0.75rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  trendText: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  }
};

export default StatCard;
