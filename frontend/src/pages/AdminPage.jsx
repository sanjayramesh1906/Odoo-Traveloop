import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Users, Map, Activity, BarChart2, TrendingUp, Settings, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import './AdminPage.css';

export default function AdminPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout flex-center">
        <div className="it-spinner"></div>
        <p className="mt-10">Loading Platform Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout flex-center">
        <p className="error-text">{error}</p>
        <button className="btn-primary mt-10" onClick={() => navigate('/dashboard')}>Return to App</button>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar - simplified for Admin */}
      <aside className="sidebar admin-sidebar">
        <div className="brand">
          <div className="tl-logo-mini admin-logo">
            <BarChart2 size={24} color="#fff" />
          </div>
          <h2>Admin Portal</h2>
        </div>

        <nav className="nav-menu mt-20">
          <a href="#" className="nav-item active">
            <TrendingUp size={20} />
            <span>Platform Stats</span>
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            <span>User Management</span>
          </a>
          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>System Config</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-ghost full-width mt-10" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div>
            <h1>Platform Analytics</h1>
            <p>Real-time insights into Traveloop's usage and growth.</p>
          </div>
        </header>

        <div className="admin-grid">
          {/* Top KPI Cards */}
          <div className="kpi-row">
            <div className="kpi-card glass">
              <div className="kpi-icon-wrapper blue">
                <Users size={24} />
              </div>
              <div className="kpi-data">
                <span className="kpi-label">Total Users</span>
                <span className="kpi-value">{stats?.totalUsers || 0}</span>
              </div>
            </div>
            
            <div className="kpi-card glass">
              <div className="kpi-icon-wrapper green">
                <Compass size={24} />
              </div>
              <div className="kpi-data">
                <span className="kpi-label">Trips Planned</span>
                <span className="kpi-value">{stats?.totalTrips || 0}</span>
              </div>
            </div>

            <div className="kpi-card glass">
              <div className="kpi-icon-wrapper orange">
                <Map size={24} />
              </div>
              <div className="kpi-data">
                <span className="kpi-label">Total Stops</span>
                <span className="kpi-value">{stats?.totalStops || 0}</span>
              </div>
            </div>

            <div className="kpi-card glass">
              <div className="kpi-icon-wrapper purple">
                <Activity size={24} />
              </div>
              <div className="kpi-data">
                <span className="kpi-label">Activities Scheduled</span>
                <span className="kpi-value">{stats?.totalActivities || 0}</span>
              </div>
            </div>
          </div>

          <div className="admin-two-col">
            {/* Top Destinations */}
            <div className="admin-card glass">
              <h3>Top Destinations</h3>
              <p className="admin-card-sub">Most popular cities among travelers</p>
              
              <ul className="admin-list">
                {stats?.topCities?.length > 0 ? (
                  stats.topCities.map((city, idx) => (
                    <li key={idx} className="admin-list-item">
                      <div className="admin-list-info">
                        <span className="admin-list-rank">#{idx + 1}</span>
                        <span className="admin-list-name">{city.name}, {city.countryCode}</span>
                      </div>
                      <span className="admin-list-count">{city.stopCount} stops</span>
                    </li>
                  ))
                ) : (
                  <p className="text-muted">No data available.</p>
                )}
              </ul>
            </div>

            {/* Recent Trips Table */}
            <div className="admin-card glass">
              <h3>Recently Created Trips</h3>
              <p className="admin-card-sub">Latest travel plans on the platform</p>
              
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Trip Name</th>
                      <th>Owner</th>
                      <th>Dest.</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentTrips?.length > 0 ? (
                      stats.recentTrips.map(trip => (
                        <tr key={trip.id}>
                          <td>{trip.name}</td>
                          <td>{trip.owner?.name || 'Unknown'}</td>
                          <td>{trip.destinationCountry || 'Multi'}</td>
                          <td>{new Date(trip.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="text-center">No trips found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
