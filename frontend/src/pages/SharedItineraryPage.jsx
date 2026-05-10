import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Clock, DollarSign, Share2, Copy, 
  ChevronLeft, Globe, Info, Download, Link as LinkIcon
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './SharedItineraryPage.css';

export default function SharedItineraryPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { token: authToken } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copying, setCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchSharedItinerary();
  }, [token]);

  const fetchSharedItinerary = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/public/itinerary/${token}`);
      setTrip(res.data);
      
      // Update page meta tags for social sharing
      document.title = `Traveloop | ${res.data.name}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `Explore this journey to ${res.data.destinationCountry || 'the world'} on Traveloop. ${res.data.stops?.length || 0} stops and counting!`);
      }
    } catch (err) {
      setError('This shared itinerary is no longer available or the link is invalid.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async () => {
    if (!authToken) {
      // Redirect to login but save the return path
      navigate(`/login?returnTo=/share/${token}`);
      return;
    }

    try {
      setCopying(true);
      const res = await api.post(`/trips/clone/${token}`);
      setCopySuccess(true);
      setTimeout(() => {
        navigate(`/trips/${res.data.tripId}/builder`);
      }, 1500);
    } catch (err) {
      console.error('Failed to clone trip', err);
      alert('Failed to copy trip. Please try again.');
    } finally {
      setCopying(false);
    }
  };

  const shareUrl = window.location.href;

  if (loading) return (
    <div className="shared-loading">
      <div className="it-spinner"></div>
      <p>Loading itinerary...</p>
    </div>
  );

  if (error) return (
    <div className="shared-error-page">
      <div className="error-card">
        <Info size={48} color="var(--danger)" />
        <h1>Oops!</h1>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="shared-page-root">
      {/* Hero Header */}
      <header className="shared-hero" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${trip.coverPhotoUrl})` }}>
        <div className="shared-hero-content">
          <div className="shared-badges">
            <span className="badge-glass"><Globe size={14} /> Shared Itinerary</span>
            {trip.destinationCountry && <span className="badge-glass">{trip.destinationCountry}</span>}
          </div>
          <h1>{trip.name}</h1>
          <p className="shared-trip-meta">
            <Calendar size={18} /> 
            {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
            <span className="dot-divider">•</span>
            {trip.stops?.length || 0} Destinations
          </p>
          
          <div className="shared-hero-actions">
            <button className="btn-premium" onClick={handleClone} disabled={copying}>
              {copying ? 'Copying...' : copySuccess ? 'Copied!' : <><Copy size={18} /> Copy to My Trips</>}
            </button>
            <div className="social-shares">
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied!'); }} className="social-icon"><LinkIcon size={20} /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="shared-main">
        <div className="shared-container">
          <div className="shared-content-grid">
            {/* Left: Timeline */}
            <div className="shared-timeline-col">
              <h2 className="section-title">The Journey</h2>
              <div className="shared-timeline">
                <div className="timeline-line"></div>
                {trip.stops?.map((stop, index) => (
                  <div key={stop.id} className="shared-stop-card">
                    <div className="stop-marker">
                      <span className="stop-number">{index + 1}</span>
                    </div>
                    <div className="stop-content">
                      <div className="stop-header">
                        <h3>{stop.city?.name}</h3>
                        <span className="stop-dates">
                          {new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="stop-activities">
                        {stop.stopActivities?.map(sa => (
                          <div key={sa.id} className="shared-activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-info">
                              <span className="activity-name">{sa.activity?.name}</span>
                              <div className="activity-meta">
                                <span><Clock size={12} /> {sa.activity?.durationMinutes}m</span>
                                <span><DollarSign size={12} /> ${sa.activity?.estimatedCost}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {stop.stopActivities?.length === 0 && <p className="no-activities">Relax and explore the city.</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary Sidebar */}
            <aside className="shared-sidebar">
              <div className="summary-card glass">
                <h3>Trip Summary</h3>
                <div className="summary-item">
                  <span className="label">Creator</span>
                  <span className="value">{trip.owner?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Budget Estimate</span>
                  <span className="value">${trip.budget}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Description</span>
                  <p className="value-desc">{trip.description || 'A beautiful journey across borders.'}</p>
                </div>
                
                <div className="shared-footer-cta">
                  <p>Plan your own adventure with Traveloop.</p>
                  <button className="btn-outline-white full-width" onClick={() => navigate('/login')}>Get Started Free</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
