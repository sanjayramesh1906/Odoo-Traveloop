import React, { useState, useEffect } from 'react';
import { itineraryAPI } from '../api';

export default function AddActivityModal({ stopId, onClose, onAdded }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await itineraryAPI.searchActivities();
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (activityId) => {
    setSaving(true);
    try {
      await itineraryAPI.addActivity(stopId, activityId);
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem' }}>Add Activity</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>&times;</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Loading activities...</div>
          ) : activities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activities.map((activity) => (
                <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{activity.name}</h4>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem' }}>
                      <span>Type: {activity.type}</span>
                      <span>Duration: {activity.durationMinutes}m</span>
                      <span>Cost: ${activity.estimatedCost}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleAdd(activity.id)}
                    disabled={saving}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>No activities available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
