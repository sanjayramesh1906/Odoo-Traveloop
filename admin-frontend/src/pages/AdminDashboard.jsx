import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import StatCard from '../components/StatCard';
import ActivityCharts from '../components/ActivityCharts';
import UserTable from '../components/UserTable';
import { Users, Map, Clock, Activity } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="app-container">
      <AdminSidebar />
      <main style={styles.mainContent}>
        
        <header style={styles.header}>
          <div>
            <h2 style={styles.pageTitle}>Admin Dashboard</h2>
            <p style={styles.subtitle}>Overview of platform metrics and user activity.</p>
          </div>
          
          <div style={styles.adminProfile}>
            <div style={styles.avatar}>A</div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem' }}>Super Admin</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>System Administrator</p>
            </div>
          </div>
        </header>

        <div style={styles.contentArea}>
          {/* KPI Cards */}
          <div style={styles.kpiGrid}>
            <StatCard title="Total Users" value="12,450" trend={12.5} icon={Users} color="#4F46E5" />
            <StatCard title="Trips Created" value="45,231" trend={8.2} icon={Map} color="#10B981" />
            <StatCard title="Active Sessions" value="1,204" trend={-2.4} icon={Clock} color="#F59E0B" />
            <StatCard title="System Load" value="24%" trend={1.1} icon={Activity} color="#EF4444" />
          </div>

          <div style={styles.splitLayout}>
            {/* Charts Section */}
            <ActivityCharts />
            
            {/* Quick Actions / Activity Feed Placeholder */}
            <div className="card" style={{ flex: '0 0 300px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.875rem' }}><b>Alex J.</b> created a new trip to Tokyo. <br/><span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>2 mins ago</span></div>
                <div style={{ fontSize: '0.875rem' }}><b>Sarah W.</b> registered an account. <br/><span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>1 hour ago</span></div>
                <div style={{ fontSize: '0.875rem' }}><b>System</b> automated backup completed. <br/><span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>3 hours ago</span></div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ marginTop: '1.5rem' }}>
            <UserTable />
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
    backgroundColor: '#F3F4F6', // Slightly darker bg for admin to contrast with white cards
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-color)',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    color: 'var(--text-secondary)',
    margin: 0,
    fontSize: '0.875rem',
  },
  adminProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '1.2rem',
  },
  contentArea: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  splitLayout: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  }
};

export default AdminDashboard;
