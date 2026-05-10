import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Calendar
} from 'lucide-react';
import CreateTripModal from '../components/CreateTripModal';

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
      setData(response.data);
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
      <aside className="sidebar">
        <div className="brand">
          <div className="tl-logo-mini">
            <span className="shape-square"></span>
            <span className="shape-circle"></span>
            <span className="shape-diamond"></span>
          </div>
          <h2>Traveloop</h2>
        </div>
        
        <div className="user-profile-widget">
          <img src={user?.photoUrl || "https://i.pravatar.cc/150?img=11"} alt="User Avatar" className="avatar-large" />
          <h3 className="user-name">{user?.name || "Traveloop"}</h3>
          <p className="user-title">Modern Nomad</p>
        </div>

        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <Compass className="nav-icon" size={20} />
            <span>Explorer</span>
          </a>
          <a href="#" className="nav-item">
            <Map className="nav-icon" size={20} />
            <span>Itinerary</span>
          </a>
          <a href="#" className="nav-item">
            <BarChart2 className="nav-icon" size={20} />
            <span>Insights</span>
          </a>
          <a href="#" className="nav-item">
            <Users className="nav-icon" size={20} />
            <span>Shared</span>
          </a>
          <a href="#" className="nav-item">
            <Settings className="nav-icon" size={20} />
            <span>Settings</span>
          </a>
        </nav>

          <div className="sidebar-footer">
            <button className="btn-primary full-width" onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={18} />
              <span>New Trip</span>
            </button>
          <button className="btn-ghost full-width mt-10" onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

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
            <h1 className="page-title">Welcome back, {user?.name.split(' ')[0] || "Nomad"}!</h1>
            <p className="page-subtitle">Here is an overview of your upcoming adventures and travel inspiration.</p>
          </div>

          <div className="dashboard-grid">
            {/* Recent Trips Section */}
            <section className="dashboard-section recent-trips">
              <div className="section-header">
                <h2>Upcoming & Recent Trips</h2>
                <a href="#" className="view-all">View All</a>
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
                          {trip.stops.length} {trip.stops.length === 1 ? 'Destination' : 'Destinations'}
                        </p>
                        <div className="collaborators">
                          {trip.tripMembers.map((member, i) => (
                             <img key={member.id} src={member.user.photoUrl || `https://i.pravatar.cc/150?img=${10+i}`} alt="Collaborator" />
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

            {/* Sidebar info area */}
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

              {/* Recommended Destinations */}
              <div className="info-card recommended-card">
                <h3>Recommended for You</h3>
                <p className="subtitle">Based on your interests</p>
                
                <ul className="destination-list">
                  {data.recommendations.map(city => (
                    <li key={city.id}>
                      <div className="dest-image" style={{backgroundImage: `url("https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=200&q=80")`}}></div>
                      <div className="dest-info">
                        <h4>{city.name}, {city.countryCode}</h4>
                        <span>Popularity: {city.popularityScore}</span>
                      </div>
                      <button className="icon-btn-small"><Plus size={16}/></button>
                    </li>
                  ))}
                  {data.recommendations.length === 0 && !loading && (
                    <p className="subtitle">Explore to get recommendations!</p>
                  )}
                </ul>
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
