import React, { useState } from 'react';
import { Compass, Map, BarChart2, Users, Settings, Plus, Bookmark } from 'lucide-react';
import './ProfilePage.css';
import data from './data.json';

export default function ProfilePage() {
  const [profile, setProfile] = useState(data.profile);
  const [preferences, setPreferences] = useState(data.preferences);
  const [destinations] = useState(data.savedDestinations);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageChange = (e) => {
    setPreferences(prev => ({ ...prev, language: e.target.value }));
  };

  return (
    <div className="traveloop-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <h2>Traveloop</h2>
          <p className="brand-subtitle">Modern Nomad</p>
        </div>
        
        <button className="btn-primary full-width mb-8">
          <Plus size={18} />
          <span>New Trip</span>
        </button>

        <nav className="nav-menu">
          <a href="#" className="nav-item">
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
          <a href="#" className="nav-item active">
            <Settings className="nav-icon" size={20} />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content profile-page">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your profile information, application preferences, and saved travel inspirations.</p>
        </div>

        <div className="settings-grid">
          {/* Profile Information Block */}
          <div className="organic-bg shape-green">
            <div className="settings-card card-green">
              <h2>Profile Information</h2>
              
              <div className="profile-header">
                <img src={profile.photoUrl} alt="Profile" className="profile-avatar" />
                <div className="profile-stats">
                  <h3>{profile.firstName}</h3>
                  <button className="btn-small">Change Photo</button>
                  <div className="stats-row">
                    <span><strong>{profile.stats.trips}</strong> Trips</span>
                    <span><strong>{profile.stats.followers}</strong> Followers</span>
                    <span><strong>{profile.stats.following}</strong> Following</span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>FIRST NAME</label>
                  <input type="text" name="firstName" value={profile.firstName} onChange={handleProfileChange} />
                </div>
                <div className="input-group">
                  <label>LAST NAME</label>
                  <input type="text" name="lastName" value={profile.lastName} onChange={handleProfileChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group full-width">
                  <label>EMAIL ADDRESS</label>
                  <input type="email" name="email" value={profile.email} onChange={handleProfileChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group full-width">
                  <label>BIO</label>
                  <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows="2"></textarea>
                </div>
              </div>

              <button className="btn-save">Save Changes</button>
            </div>
          </div>

          <div className="right-column">
            {/* Preferences Block */}
            <div className="organic-bg shape-red-light">
              <div className="settings-card card-red">
                <h2>Preferences</h2>
                
                <div className="input-group full-width">
                  <label>DISPLAY LANGUAGE</label>
                  <select value={preferences.language} onChange={handleLanguageChange}>
                    <option value="English (US)">English (US)</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <h4>Public Profile</h4>
                    <p>Allow others to see your shared itineraries.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={preferences.publicProfile} onChange={() => handlePreferenceToggle('publicProfile')} />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <h4>Activity Status</h4>
                    <p>Show when you are actively planning a trip.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={preferences.activityStatus} onChange={() => handlePreferenceToggle('activityStatus')} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone Block */}
            <div className="organic-bg shape-red-dark mt-6">
              <div className="settings-card card-red-dark">
                <h2>Danger Zone</h2>
                <p className="danger-text">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Destinations Block */}
        <div className="saved-destinations-section">
          <div className="section-header">
            <h2>Saved Destinations</h2>
            <a href="#" className="view-all">View All</a>
          </div>
          
          <div className="destinations-organic-bg">
            <div className="destinations-grid">
              {destinations.map(dest => (
                <div key={dest.id} className="destination-card">
                  <Bookmark className="bookmark-icon" size={18} />
                  <div className="dest-info">
                    <h3>{dest.name}</h3>
                    <p>📍 {dest.country}</p>
                  </div>
                </div>
              ))}
              
              <div className="destination-card explore-card">
                <div className="explore-icon-wrapper">
                  <Plus size={24} color="#fff" />
                </div>
                <p>Explore New Places</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
