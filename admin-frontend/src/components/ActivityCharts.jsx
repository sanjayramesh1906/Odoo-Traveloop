import React from 'react';

// Simple CSS-based bar chart for visual representation
const ActivityCharts = () => {
  const topCities = [
    { name: 'Tokyo', value: 85 },
    { name: 'Paris', value: 72 },
    { name: 'Bali', value: 65 },
    { name: 'London', value: 50 },
    { name: 'New York', value: 45 },
  ];

  return (
    <div className="card" style={{ flex: 1 }}>
      <h3 style={styles.title}>Top Destinations</h3>
      <p style={styles.subtitle}>Most planned cities in the last 30 days</p>
      
      <div style={styles.chartContainer}>
        {topCities.map((city, index) => (
          <div key={index} style={styles.barRow}>
            <span style={styles.label}>{city.name}</span>
            <div style={styles.barTrack}>
              <div 
                style={{ 
                  ...styles.barFill, 
                  width: `${city.value}%`,
                  backgroundColor: `hsl(244, 75%, ${40 + (index * 8)}%)` // Gradient effect
                }} 
              />
            </div>
            <span style={styles.valueLabel}>{city.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
    color: 'var(--text-primary)',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  label: {
    width: '80px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
  },
  barTrack: {
    flex: 1,
    height: '12px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 1s ease-out',
  },
  valueLabel: {
    width: '40px',
    textAlign: 'right',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  }
};

export default ActivityCharts;
