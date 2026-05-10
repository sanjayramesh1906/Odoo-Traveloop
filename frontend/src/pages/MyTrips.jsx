import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Bell, Plus, Map, Calendar, Users, Filter } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

import CreateTripModal from '../components/CreateTripModal';

const MyTrips = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      setTrips(res.data || []);
    } catch (err) {
      console.error('Failed to fetch trips', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(trip => {
    if (filter === 'All') return true;
    if (!trip.startDate) return filter === 'Upcoming'; // Default to upcoming if no date
    const isUpcoming = new Date(trip.startDate) > new Date();
    return filter === 'Upcoming' ? isUpcoming : !isUpcoming;
  });

  return (
    <div className="traveloop-layout">
      {/* Background Decorations */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>

      <Sidebar />

      <main className="main-content">
        <header className="top-nav">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search your plans..." />
          </div>
          <div className="nav-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <img src={user?.photoUrl || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="avatar-small" />
          </div>
        </header>
        
        <div className="dashboard-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 className="page-title">My Plans</h1>
              <p className="page-subtitle">Manage and organize your travel itineraries.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '4px' }}>
                {['All', 'Upcoming', 'Past'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      background: filter === f ? 'var(--primary)' : 'transparent',
                      color: filter === f ? 'white' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} /> New Plan
              </button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', marginTop: '32px' }}>
            {loading ? (
              <p>Loading your plans...</p>
            ) : filteredTrips.length > 0 ? (
              filteredTrips.map(trip => (
                <div 
                  key={trip.id} 
                  className="trip-card" 
                  onClick={() => navigate(`/trips/${trip.id}/builder`)}
                  style={{ height: 'auto', flexDirection: 'column' }}
                >
                  <div className="trip-card-image" style={{ 
                    width: '100%', 
                    height: '180px', 
                    backgroundImage: `url(${trip.coverPhotoUrl || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"})` 
                  }}>
                    <span className={`trip-badge ${(!trip.startDate || new Date(trip.startDate) > new Date()) ? 'upcoming' : 'past'}`}>
                      {(!trip.startDate || new Date(trip.startDate) > new Date()) ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                  <div className="trip-card-content" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0 }}>{trip.name}</h3>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)', background: 'var(--secondary)', padding: '4px 8px', borderRadius: '6px' }}>
                        {(trip.stops?.length || 0)} Stops
                      </span>
                    </div>
                    <p className="trip-dates" style={{ marginBottom: '16px' }}>
                      <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible Dates'}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '16px' }}>
                      {trip.description || "No description provided."}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                      <div className="collaborators">
                        {(trip.tripMembers || []).slice(0, 3).map((m, i) => (
                          <img key={i} src={m.user?.photoUrl || `https://i.pravatar.cc/150?img=${20+i}`} alt="Member" style={{ width: '28px', height: '28px' }} />
                        ))}
                        {(trip.tripMembers || []).length > 3 && <span className="collab-more">+{trip.tripMembers.length - 3}</span>}
                      </div>
                      <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <Map size={48} style={{ color: 'var(--text-muted)', opacity: 0.3, marginBottom: '16px' }} />
                <h3>No plans found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Start by creating your first travel itinerary.</p>
                <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ margin: '0 auto' }}>
                  <Plus size={18} /> Create New Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTrips} 
      />
    </div>
  );
};

export default MyTrips;
