import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Map, Users, Settings, LogOut, FileText, Camera, Trash2, Save } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    photoUrl: '',
    languagePreference: 'en'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      setProfileData({
        name: res.data.name || '',
        email: res.data.email || '',
        photoUrl: res.data.photoUrl || '',
        languagePreference: res.data.languagePreference || 'en'
      });
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      const res = await api.put('/users/profile', {
        name: profileData.name,
        photoUrl: profileData.photoUrl,
        languagePreference: profileData.languagePreference
      });
      // Update local AuthContext user object with new data
      login(localStorage.getItem('traveloop_token'), res.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and will delete all your trips.')) return;
    try {
      await api.delete('/users/profile');
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account', err);
      alert('Failed to delete account.');
    }
  };

  if (loading) {
    return (
      <div className="traveloop-layout flex-center">
        <div className="it-spinner"></div>
      </div>
    );
  }

  return (
    <div className="traveloop-layout">
      {/* Background Decorative Elements */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      
      {/* Unified Sidebar */}
      <Sidebar />

      <main className="main-content">
        <header className="top-nav">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">Profile Settings</h1>
            <p className="page-subtitle">Manage your account details and preferences.</p>
          </div>
        </header>

        <div className="dashboard-content" style={{ maxWidth: '800px' }}>
          {message && (
            <div style={{ padding: '15px', background: message.includes('Failed') ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)', color: message.includes('Failed') ? 'var(--danger)' : 'var(--success)', borderRadius: '12px', marginBottom: '20px', fontWeight: '500' }}>
              {message}
            </div>
          )}

          <div className="admin-card glass" style={{ padding: '30px', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Personal Information</h3>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid white', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <img src={profileData.photoUrl || "https://i.pravatar.cc/150?img=11"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', outline: 'none' }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      disabled
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', outline: 'none', background: '#f5f5f5', color: 'var(--text-muted)' }}
                    />
                    <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Email cannot be changed.</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Profile Photo URL</label>
                    <input 
                      type="text" 
                      value={profileData.photoUrl} 
                      onChange={(e) => setProfileData({...profileData, photoUrl: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', outline: 'none' }}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Language Preference</label>
                    <select 
                      value={profileData.languagePreference}
                      onChange={(e) => setProfileData({...profileData, languagePreference: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', outline: 'none', background: 'white' }}
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="admin-card glass" style={{ padding: '30px', borderLeft: '4px solid var(--danger)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--danger)', marginBottom: '10px' }}>Danger Zone</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              Once you delete your account, there is no going back. All your travel plans, notes, and budgets will be permanently deleted.
            </p>
            <button 
              className="btn-primary" 
              style={{ background: 'white', color: 'var(--danger)', border: '1px solid var(--danger)' }}
              onClick={handleDeleteAccount}
            >
              <Trash2 size={18} style={{ marginRight: '8px' }}/> Delete Account
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
