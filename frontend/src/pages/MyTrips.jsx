import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import TripCard from '../components/TripCard';

// Mock data to match the visual style and schema
const mockTrips = [
  {
    id: 1,
    name: 'Japan Escapade',
    startDate: 'Oct 12, 2026',
    endDate: 'Oct 26, 2026',
    status: 'Completed',
    destinationCount: 3,
    description: 'A comprehensive journey through Tokyo, Kyoto, and Osaka focusing on culture and culinary experiences.',
    members: [
      { avatar: 'https://i.pravatar.cc/150?img=33' },
      { avatar: 'https://i.pravatar.cc/150?img=47' },
    ],
    additionalMembers: 2
  },
  {
    id: 2,
    name: 'Euro Backpacking',
    startDate: 'May 10, 2027',
    endDate: 'Jun 15, 2027',
    status: 'Upcoming',
    destinationCount: 5,
    description: 'Backpacking across France, Italy, Switzerland, Germany, and the Netherlands.',
    members: [
      { avatar: 'https://i.pravatar.cc/150?img=12' },
      { avatar: 'https://i.pravatar.cc/150?img=5' },
    ],
    additionalMembers: 0
  },
  {
    id: 3,
    name: 'Bali Retreat',
    startDate: 'Dec 05, 2026',
    endDate: 'Dec 15, 2026',
    status: 'Pending',
    destinationCount: 1,
    description: 'Relaxation and wellness retreat in Ubud and Seminyak.',
    members: [
      { avatar: 'https://i.pravatar.cc/150?img=68' },
    ],
    additionalMembers: 0
  }
];

const MyTrips = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main style={styles.mainContent}>
        <TopNav />
        
        <div style={styles.contentArea}>
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.title}>My Trips</h1>
              <p style={styles.subtitle}>Manage your upcoming and past travel plans.</p>
            </div>
            
            <div style={styles.filterBar}>
              <select style={styles.select}>
                <option>All Trips</option>
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          
          <div style={styles.grid}>
            {mockTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  contentArea: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    margin: 0,
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
  },
  select: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.5rem',
  }
};

export default MyTrips;
