import React from 'react';
import './Dashboard.css';
import { 
  Compass, 
  Map, 
  BarChart2, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Bell 
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="traveloop-layout">
      {/* Background Decorative Elements */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <h2>Traveloop</h2>
        </div>
        
        <div className="user-profile-widget">
          <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" className="avatar-large" />
          <h3 className="user-name">Traveloop</h3>
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
          <button className="btn-primary full-width">
            <Plus size={18} />
            <span>New Trip</span>
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
            <button className="icon-btn"><Settings size={2gigit0} /></button>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="avatar-small" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="page-header">
            <h1 className="page-title">Welcome back, Nomad!</h1>
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
                {/* Trip Card 1 */}
                <div className="trip-card">
                  <div className="trip-card-image" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80")'}}>
                    <span className="trip-badge upcoming">Upcoming</span>
                  </div>
                  <div className="trip-card-content">
                    <h3>Japan Escapade</h3>
                    <p className="trip-dates">Oct 12 - Oct 24 • 3 Destinations</p>
                    <div className="collaborators">
                      <img src="https://i.pravatar.cc/150?img=32" alt="Collab 1" />
                      <img src="https://i.pravatar.cc/150?img=12" alt="Collab 2" />
                      <span className="collab-more">+2</span>
                    </div>
                  </div>
                </div>

                {/* Trip Card 2 */}
                <div className="trip-card">
                  <div className="trip-card-image" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80")'}}>
                    <span className="trip-badge past">Completed</span>
                  </div>
                  <div className="trip-card-content">
                    <h3>Paris Getaway</h3>
                    <p className="trip-dates">Sep 5 - Sep 10 • 1 Destination</p>
                    <div className="collaborators">
                      <img src="https://i.pravatar.cc/150?img=47" alt="Collab 1" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar info area */}
            <aside className="dashboard-sidebar">
              {/* Budget Highlights */}
              <div className="info-card budget-card">
                <h3>Budget Highlights</h3>
                <div className="budget-stat">
                  <span className="label">Total Spent This Year</span>
                  <span className="value">$4,250</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: '65%' }}></div>
                </div>
                <p className="budget-subtext">You have 35% of your annual travel budget remaining.</p>
                <button className="btn-secondary full-width mt-10">View Detailed Budget</button>
              </div>

              {/* Recommended Destinations */}
              <div className="info-card recommended-card">
                <h3>Recommended for You</h3>
                <p className="subtitle">Based on your interests</p>
                
                <ul className="destination-list">
                  <li>
                    <div className="dest-image" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=200&q=80")'}}></div>
                    <div className="dest-info">
                      <h4>London, UK</h4>
                      <span>Culture, Food</span>
                    </div>
                    <button className="icon-btn-small"><Plus size={16}/></button>
                  </li>
                  <li>
                    <div className="dest-image" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&q=80")'}}></div>
                    <div className="dest-info">
                      <h4>Dubai, UAE</h4>
                      <span>Luxury, Adventure</span>
                    </div>
                    <button className="icon-btn-small"><Plus size={16}/></button>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
