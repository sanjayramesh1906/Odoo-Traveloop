import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';
import api from '../api/axios';
import { 
  Compass, 
  Map, 
  BarChart2, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Bell,
  LogOut,
  Calendar,
  FileText
} from 'lucide-react';
import CreateTripModal from '../components/CreateTripModal';
import Sidebar from '../components/Sidebar';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    trips: [],
    budget: { totalSpent: 0, annualBudget: 10000 },
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips/dashboard');
      // Align backend response structure with frontend state
      setData({
        trips: response.data.recentTrips || [],
        budget: {
          totalSpent: response.data.budgetSummary?.totalSpent || 0,
          annualBudget: 10000 // Default or from user preferences
        }
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const budgetProgress = (data.budget.totalSpent / data.budget.annualBudget) * 100;
  const remainingBudgetPercent = 100 - budgetProgress;

  return (
    <div className="traveloop-layout">
      {/* Background Decorative Elements */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="top-nav">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search destinations..." />
          </div>
          <div className="nav-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><Settings size={20} /></button>
            <img src={user?.photoUrl || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="avatar-small" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="page-header">
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] || "Nomad"}!</h1>
            <p className="page-subtitle">Here is an overview of your upcoming adventures and travel inspiration.</p>
          </div>

          <div className="dashboard-grid">
            <div className="main-section">
              {/* Recent Trips Section */}
              <section className="dashboard-section recent-trips">
                <div className="section-header">
                  <h2>Upcoming & Recent Trips</h2>
                  <Link to="/my-trips" className="view-all">View All</Link>
                </div>
                
                <div className="trips-list">
                  {loading ? (
                    <p>Loading your adventures...</p>
                  ) : data.trips.length > 0 ? (
                    data.trips.map(trip => (
                      <div 
                        key={trip.id} 
                        className="trip-card"
                        onClick={() => navigate(`/trips/${trip.id}/builder`)}
                      >
                        <div className="trip-card-image" style={{backgroundImage: `url(${trip.coverPhotoUrl || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"})`}}>
                          <span className={`trip-badge ${new Date(trip.startDate) > new Date() ? 'upcoming' : 'past'}`}>
                            {new Date(trip.startDate) > new Date() ? 'Upcoming' : 'Past'}
                          </span>
                        </div>
                        <div className="trip-card-content">
                          <h3>{trip.name}</h3>
                          <p className="trip-dates">
                            {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'} - 
                            {trip.endDate ? new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'} • 
                            {trip.stopCount || 0} Destinations
                          </p>
                          <div className="collaborators">
                            {(trip.tripMembers || []).map((member, i) => (
                               <img key={member.id} src={member.user?.photoUrl || `https://i.pravatar.cc/150?img=${10+i}`} alt="Collaborator" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No trips planned yet. Time to dream!</p>
                      <button className="btn-secondary mt-10" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} /> Plan a Trip
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Popular Destinations Section */}
              <section className="popular-destinations-section" style={{ marginTop: '48px' }}>
                <div className="section-header">
                  <h2>Popular Destinations</h2>
                  <a href="#" className="view-all">See more</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {[
                    { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', rating: '4.9' },
                    { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80', rating: '4.8' },
                    { name: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', rating: '4.7' },
                    { name: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', rating: '4.9' }
                  ].map((dest, i) => (
                    <div key={i} className="info-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                      <div style={{ height: '160px', backgroundImage: `url(${dest.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px' }}>{dest.name}</h4>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--warning)' }}>★ {dest.rating}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>{dest.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="dashboard-sidebar">
              {/* Budget Highlights */}
              <div className="info-card budget-card">
                <h3>Budget Highlights</h3>
                <div className="budget-stat">
                  <span className="label">Total Spent This Year</span>
                  <span className="value">${data.budget.totalSpent.toLocaleString()}</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${Math.min(budgetProgress, 100)}%` }}></div>
                </div>
                <p className="budget-subtext">You have {remainingBudgetPercent.toFixed(0)}% of your annual travel budget remaining.</p>
                <button className="btn-secondary full-width mt-10">View Detailed Budget</button>
              </div>

            </aside>
          </div>
        </div>
      </main>

      {/* Modal */}
      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchDashboard}
      />
    </div>
  );
};

export default Dashboard;
