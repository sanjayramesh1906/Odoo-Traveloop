import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, MapPin, Loader2 } from 'lucide-react';
import { itineraryAPI } from '../../api/itinerary';

export default function AddStopModal({ tripId, trip, onClose, onAdd }) {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [dates, setDates] = useState({ 
    arrival: trip?.startDate ? trip.startDate.split('T')[0] : '', 
    departure: trip?.startDate ? trip.startDate.split('T')[0] : '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const destinationCountry = trip?.destinationCountry;
  const tripStart = trip?.startDate ? trip.startDate.split('T')[0] : null;
  const tripEnd = trip?.endDate ? trip.endDate.split('T')[0] : null;

  useEffect(() => {
    if (search.length > 1) {
      const t = setTimeout(() => {
        fetchCities(search);
      }, 300);
      return () => clearTimeout(t);
    } else if (search.length === 0 && destinationCountry) {
      fetchCities(''); // Fetch default cities for the country
    }
  }, [search, destinationCountry]);

  const fetchCities = async (query) => {
    try {
      setSearching(true);
      const res = await itineraryAPI.searchCities(query, destinationCountry);
      setCities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedCity) newErrors.city = 'Please select a city';
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await itineraryAPI.addStop(tripId, {
        cityId: selectedCity.id,
        arrivalDate: dates.arrival || undefined,
        departureDate: dates.departure || undefined,
      });
      onAdd();
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Failed to add stop. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Stop</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {errors.submit && <div className="error-banner">{errors.submit}</div>}

          <div className="form-group" style={{ position: 'relative' }}>
            <label>Destination City</label>
            <div className="input-with-icon">
              {searching ? <Loader2 className="input-icon animate-spin" size={16} /> : <Search className="input-icon" size={16} />}
              <input
                type="text"
                className={errors.city ? 'input-error' : ''}
                placeholder="Search for a city..."
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedCity(null); }}
              />
            </div>
            {errors.city && <span className="error-text">{errors.city}</span>}

            {cities.length > 0 && !selectedCity && (
              <div className="search-results-dropdown">
                {cities.map(city => (
                  <div
                    key={city.id}
                    className="search-result-item"
                    onClick={() => {
                      setSelectedCity(city);
                      setSearch(`${city.name}, ${city.countryCode}`);
                      setCities([]);
                    }}
                  >
                    <MapPin size={15} />
                    <span>{city.name}, {city.countryCode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
            <button type="submit" className="btn-primary" disabled={!selectedCity || loading}>
              {loading ? 'Adding...' : 'Add Stop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
