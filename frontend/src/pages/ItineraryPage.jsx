import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart2, Search, Bell, Settings, Share2
} from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './ItineraryPage.css';
import '../components/itinerary/ItineraryBuilder.css';
import ItineraryBuilder from '../components/itinerary/ItineraryBuilder';
import CollaboratePanel from '../components/itinerary/CollaboratePanel';

const ItineraryPage = ({ user, onLogout }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (tripId) {
      api.get(`/trips/${tripId}`)
        .then(res => setTrip(res.data))
        .catch(err => console.error('Failed to load trip', err))
        .finally(() => setLoading(false));
    }
  }, [tripId]);

  const handleShare = async () => {
    try {
      setSharing(true);
      const res = await api.post(`/trips/${tripId}/share`);
      const shareUrl = `${window.location.origin}/share/${res.data.token}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Public share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to generate share link', err);
      alert('Failed to generate share link. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="traveloop-layout">
      {/* Background Decorative Elements */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>

      {/* Unified Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="top-nav">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search your plans..." />
          </div>
          <div className="nav-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><Settings size={20} /></button>
            <img
              src={user?.photoUrl || 'https://i.pravatar.cc/150?img=11'}
              alt="Profile"
              className="avatar-small"
            />
          </div>
        </header>

        {/* Itinerary Content */}
        <div className="itinerary-content">
          {/* Page Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div>
                <h1 className="itinerary-page-title">
                  My Plan{loading ? '' : trip ? ` | ${trip.name}` : ''}
                </h1>
                <p className="itinerary-page-subtitle">Your minimalist itinerary and collaboration hub.</p>
              </div>
              {!loading && (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    className="btn-outline-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}
                    onClick={() => navigate(`/trips/${tripId}/budget`)}
                  >
                    <BarChart2 size={18} />
                    Budget & Costs
                  </button>
                  <button 
                    className="btn-outline-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}
                    onClick={handleShare}
                    disabled={sharing}
                  >
                    <Share2 size={18} />
                    {sharing ? 'Generating...' : 'Share Trip'}
                  </button>
                </div>
              )}
            </div>

          {/* Two-column layout: Timeline | Collaborate */}
          <div className="itinerary-two-col">
            <div className="itinerary-timeline-col">
              <ItineraryBuilder tripId={tripId} />
            </div>
            <div className="itinerary-right-col">
              <CollaboratePanel tripId={tripId} members={trip?.tripMembers || []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItineraryPage;
