import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, Clock, DollarSign, Plus } from 'lucide-react';
import { itineraryAPI } from '../../api/itinerary';

export default function AddActivityModal({ stopId, stop, onClose, onAdded }) {
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState([]);
  const [adding, setAdding] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchActivities('');
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchActivities(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchActivities = async (q) => {
    try {
      setSearching(true);
      const res = await itineraryAPI.searchActivities(q, '', stop?.cityId);
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (activityId) => {
    try {
      setAdding(activityId);
      await itineraryAPI.addActivity(stopId, activityId);
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  // Activities already added to this stop
  const addedIds = new Set((stop?.stopActivities || []).map(sa => sa.activityId));

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <h2>Add Activity to {stop?.city?.name}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label>Search Activities</label>
            <div className="input-with-icon">
              {searching ? <Loader2 className="input-icon animate-spin" size={16} /> : <Search className="input-icon" size={16} />}
              <input
                type="text"
                placeholder="Sightseeing, food tours, adventure..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="activities-selection-list">
            {activities.length === 0 && !searching && (
              <div className="list-status">No activities found. Try a different search.</div>
            )}
            {activities.map(activity => {
              const isAdded = addedIds.has(activity.id);
              return (
                <div key={activity.id} className={`selection-item ${isAdded ? 'already-added' : ''}`}>
                  <div className="selection-info">
                    <span className="selection-name">{activity.name}</span>
                    <div className="selection-meta-row">
                      <span className="it-type-pill">{activity.type}</span>
                      <span className="selection-stat"><Clock size={12} /> {activity.durationMinutes}m</span>
                      <span className="selection-stat"><DollarSign size={12} /> ${activity.estimatedCost}</span>
                    </div>
                  </div>
                  {isAdded ? (
                    <span className="already-badge">Added</span>
                  ) : (
                    <button
                      className="it-btn it-btn-edit"
                      onClick={() => handleAdd(activity.id)}
                      disabled={adding === activity.id}
                    >
                      <Plus size={14} />
                      {adding === activity.id ? 'Adding...' : 'Add'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="modal-footer" style={{ marginTop: 16 }}>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
