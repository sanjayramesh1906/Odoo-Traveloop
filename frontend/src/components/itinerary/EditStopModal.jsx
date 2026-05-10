import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import api from '../../api/axios';

export default function EditStopModal({ stop, trip, onClose, onSaved }) {
  const [dates, setDates] = useState({
    arrival: stop.arrivalDate ? stop.arrivalDate.split('T')[0] : '',
    departure: stop.departureDate ? stop.departureDate.split('T')[0] : '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const tripStart = trip?.startDate ? trip.startDate.split('T')[0] : null;
  const tripEnd = trip?.endDate ? trip.endDate.split('T')[0] : null;

  const validate = () => {
    const newErrors = {};
    
    if (dates.arrival && tripStart && dates.arrival < tripStart) 
      newErrors.arrival = `Arrival cannot be before trip start (${tripStart})`;
    if (dates.arrival && tripEnd && dates.arrival > tripEnd) 
      newErrors.arrival = `Arrival cannot be after trip end (${tripEnd})`;
      
    if (dates.departure && tripStart && dates.departure < tripStart) 
      newErrors.departure = `Departure cannot be before trip start (${tripStart})`;
    if (dates.departure && tripEnd && dates.departure > tripEnd) 
      newErrors.departure = `Departure cannot be after trip end (${tripEnd})`;

    if (dates.arrival && dates.departure && dates.arrival > dates.departure)
      newErrors.departure = 'Departure cannot be before arrival';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await api.put(`/itinerary/stops/${stop.id}`, {
        arrivalDate: dates.arrival || null,
        departureDate: dates.departure || null,
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error('Failed to update stop', err);
      setErrors({ submit: 'Failed to update stop. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Stop — {stop.city?.name}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} className="modal-form">
          {errors.submit && <div className="error-banner">{errors.submit}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Arrival Date</label>
              <div className="input-with-icon">
                <Calendar className="input-icon" size={16} />
                <input
                  type="date"
                  className={errors.arrival ? 'input-error' : ''}
                  min={tripStart}
                  max={tripEnd}
                  value={dates.arrival}
                  onChange={e => setDates({ ...dates, arrival: e.target.value })}
                />
              </div>
              {errors.arrival && <span className="error-text">{errors.arrival}</span>}
            </div>
            <div className="form-group">
              <label>Departure Date</label>
              <div className="input-with-icon">
                <Calendar className="input-icon" size={16} />
                <input
                  type="date"
                  className={errors.departure ? 'input-error' : ''}
                  min={tripStart}
                  max={tripEnd}
                  value={dates.departure}
                  onChange={e => setDates({ ...dates, departure: e.target.value })}
                />
              </div>
              {errors.departure && <span className="error-text">{errors.departure}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
