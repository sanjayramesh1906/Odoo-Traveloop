import React, { useState, useEffect } from 'react';
import { itineraryAPI } from '../api';

export default function AddStopModal({ onClose, onAdd }) {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
        searchCities();
      } else {
        setCities([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchCities = async () => {
    setLoading(true);
    try {
      const res = await itineraryAPI.searchCities(query);
      setCities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCity) return;
    setSaving(true);
    try {
      const res = await itineraryAPI.addStop({
        cityId: selectedCity.id,
        arrivalDate,
        departureDate
      });
      onAdd(res.data);
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
          <h2 style={{ fontSize: '1.25rem' }}>Add Stop</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Search City</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Start typing..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading && <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>Searching...</div>}
            
            {cities.length > 0 && !selectedCity && (
              <div style={{ marginTop: '0.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', maxHeight: '150px', overflowY: 'auto' }}>
                {cities.map(city => (
                  <div 
                    key={city.id} 
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)' }}
                    onClick={() => { setSelectedCity(city); setQuery(`${city.name}, ${city.countryCode}`); setCities([]); }}
                  >
                    {city.name}, <span style={{ color: 'var(--color-text-muted)' }}>{city.country}</span>
                  </div>
                ))}
              </div>
            )}
            
            {selectedCity && (
              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
                <span>Selected: {selectedCity.name}</span>
                <button onClick={() => { setSelectedCity(null); setQuery(''); }} style={{ color: 'var(--color-text-muted)' }}>Change</button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Arrival Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Departure Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave} 
            disabled={!selectedCity || saving}
          >
            {saving ? 'Adding...' : 'Add Stop'}
          </button>
        </div>
      </div>
    </div>
  );
}
