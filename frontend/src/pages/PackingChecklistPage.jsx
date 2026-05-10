import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Bell, CheckCircle, 
  Circle, Trash2, RotateCcw, ShoppingBag, Briefcase, 
  Smartphone, File
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const CATEGORIES = ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Miscellaneous'];

const CategoryIcon = ({ category }) => {
  switch (category) {
    case 'Clothing': return <ShoppingBag size={18} />;
    case 'Documents': return <File size={18} />;
    case 'Electronics': return <Smartphone size={18} />;
    case 'Toiletries': return <CheckCircle size={18} />;
    default: return <Briefcase size={18} />;
  }
};

export default function PackingChecklistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ itemName: '', category: 'Miscellaneous' });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      const userTrips = res.data || [];
      setTrips(userTrips);
      if (userTrips.length > 0) {
        selectTrip(userTrips[0]);
      }
    } catch (err) {
      console.error('Failed to fetch trips', err);
    } finally {
      setLoading(false);
    }
  };

  const selectTrip = async (trip) => {
    setActiveTrip(trip);
    try {
      const res = await api.get(`/trips/${trip.id}/packing`);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.itemName.trim() || !activeTrip) return;
    try {
      const res = await api.post(`/trips/${activeTrip.id}/packing`, newItem);
      setItems([...items, res.data]);
      setNewItem({ itemName: '', category: 'Miscellaneous' });
    } catch (err) {
      console.error('Failed to add item', err);
    }
  };

  const togglePacked = async (item) => {
    try {
      const res = await api.put(`/packing/${item.id}`, { ...item, isPacked: !item.isPacked });
      setItems(items.map(i => i.id === item.id ? res.data : i));
    } catch (err) {
      console.error('Failed to toggle item', err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/packing/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const resetList = async () => {
    if (!window.confirm('Reset all items to unpacked?')) return;
    try {
      await api.put(`/trips/${activeTrip.id}/packing/reset`);
      setItems(items.map(i => ({ ...i, isPacked: false })));
    } catch (err) {
      console.error('Failed to reset list', err);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'All') return true;
    return item.category === filter;
  });

  const packedCount = items.filter(i => i.isPacked).length;
  const progress = items.length > 0 ? (packedCount / items.length) * 100 : 0;

  if (loading) return <div className="traveloop-layout flex-center"><div className="it-spinner"></div></div>;

  return (
    <div className="traveloop-layout">
      {/* Background Decorative Elements */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>

      {/* Sidebar */}
      <Sidebar />

      <main className="main-content">
        <header className="top-nav">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">Packing Checklist</h1>
            <p className="page-subtitle">Don't leave the essentials behind.</p>
          </div>
          <div className="nav-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <img src={user?.photoUrl || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="avatar-small" />
          </div>
        </header>

        <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
          {/* Left Column: Trip Selection & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="info-card">
              <h3>Select Trip</h3>
              <select 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                value={activeTrip?.id || ''}
                onChange={(e) => {
                  const tripId = e.target.value;
                  const trip = trips.find(t => t.id === tripId);
                  if (trip) selectTrip(trip);
                }}
              >
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>{trip.name}</option>
                ))}
              </select>
            </div>

            <div className="info-card">
              <h3>Packing Progress</h3>
              <div className="budget-stat">
                <span className="label">Items Packed</span>
                <span className="value" style={{ fontSize: '20px' }}>{packedCount} / {items.length}</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: progress === 100 ? 'var(--success)' : 'var(--primary)' }}></div>
              </div>
              <p className="budget-subtext">
                {progress === 100 ? "You're all set to go!" : `Keep going, you're ${progress.toFixed(0)}% ready.`}
              </p>
              <button className="btn-secondary full-width mt-10" onClick={resetList} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <RotateCcw size={16} /> Reset List
              </button>
            </div>

            <div className="info-card">
              <h3>Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  className={`btn-ghost full-width`} 
                  style={{ justifyContent: 'flex-start', background: filter === 'All' ? 'var(--secondary)' : 'transparent', color: filter === 'All' ? 'var(--primary)' : 'var(--text-muted)' }}
                  onClick={() => setFilter('All')}
                >
                  All Items
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    className={`btn-ghost full-width`} 
                    style={{ justifyContent: 'flex-start', background: filter === cat ? 'var(--secondary)' : 'transparent', color: filter === cat ? 'var(--primary)' : 'var(--text-muted)' }}
                    onClick={() => setFilter(cat)}
                  >
                    <CategoryIcon category={cat} />
                    <span style={{ marginLeft: '10px' }}>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: List and Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="info-card">
              <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="What do you need to pack?"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
                <select 
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button type="submit" className="btn-primary">
                  <Plus size={20} />
                </button>
              </form>
            </div>

            <div className="info-card" style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredItems.map(item => (
                  <div 
                    key={item.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '16px', 
                      borderRadius: '12px', 
                      background: item.isPacked ? '#f8f9fc' : 'white',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <button 
                      onClick={() => togglePacked(item)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.isPacked ? 'var(--success)' : 'var(--text-muted)', marginRight: '16px' }}
                    >
                      {item.isPacked ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        fontSize: '16px', 
                        fontWeight: '500', 
                        textDecoration: item.isPacked ? 'line-through' : 'none',
                        color: item.isPacked ? 'var(--text-muted)' : 'var(--text-main)'
                      }}>
                        {item.itemName}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.category}</p>
                    </div>

                    <button 
                      className="icon-btn" 
                      onClick={() => handleDeleteItem(item.id)}
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p>No items found. Add some!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
