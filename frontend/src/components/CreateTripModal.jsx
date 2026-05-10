import React, { useState } from 'react';
import { X, Calendar, DollarSign, Image as ImageIcon, Send } from 'lucide-react';
import './CreateTripModal.css';
import api from '../api/axios';

const CreateTripModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
    coverPhotoUrl: '',
    destinationCountry: '',
    destinationCountryCode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Trip name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.destinationCountry) newErrors.destinationCountry = 'Please select a destination country';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (formData.budget && isNaN(formData.budget)) newErrors.budget = 'Budget must be a number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/trips', {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({ name: '', startDate: '', endDate: '', budget: '', description: '', coverPhotoUrl: '' });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const countries = [
    { name: 'France', code: 'FRA' },
    { name: 'Germany', code: 'DEU' },
    { name: 'Italy', code: 'ITA' },
    { name: 'United States', code: 'USA' },
    { name: 'United Arab Emirates', code: 'ARE' },
    { name: 'Qatar', code: 'QAT' },
    { name: 'Spain', code: 'ESP' },
    { name: 'India', code: 'IND' },
    { name: 'Sri Lanka', code: 'LKA' },
    { name: 'Thailand', code: 'THA' },
    { name: 'Japan', code: 'JPN' },
    { name: 'United Kingdom', code: 'GBR' },
    { name: 'Australia', code: 'AUS' },
    { name: 'Canada', code: 'CAN' },
    { name: 'Egypt', code: 'EGY' },
    { name: 'Turkey', code: 'TUR' },
    { name: 'Netherlands', code: 'NLD' },
    { name: 'Greece', code: 'GRC' },
    { name: 'Portugal', code: 'PRT' },
    { name: 'Austria', code: 'AUT' },
    { name: 'Switzerland', code: 'CHE' },
    { name: 'Singapore', code: 'SGP' }
  ];

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const countryObj = countries.find(c => c.name === countryName);
    setFormData(prev => ({
      ...prev,
      destinationCountry: countryName,
      destinationCountryCode: countryObj ? countryObj.code : ''
    }));
    if (errors.destinationCountry) {
      setErrors(prev => {
        const n = { ...prev };
        delete n.destinationCountry;
        return n;
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>Create New Trip</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          {serverError && <div className="error-banner">{serverError}</div>}

          <div className="form-group">
            <label htmlFor="name">Trip Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Summer in Tuscany"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="destinationCountry">Destination Country</label>
            <select
              id="destinationCountry"
              name="destinationCountry"
              value={formData.destinationCountry}
              onChange={handleCountryChange}
              className={errors.destinationCountry ? 'input-error' : ''}
            >
              <option value="">-- Select Country --</option>
              {countries.map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
            {errors.destinationCountry && <span className="error-text">{errors.destinationCountry}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={errors.startDate ? 'input-error' : ''}
                />
              </div>
              {errors.startDate && <span className="error-text">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={errors.endDate ? 'input-error' : ''}
                />
              </div>
              {errors.endDate && <span className="error-text">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">Total Budget ($)</label>
              <div className="input-with-icon">
                <DollarSign size={16} className="input-icon" />
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  placeholder="0.00"
                  value={formData.budget}
                  onChange={handleChange}
                  className={errors.budget ? 'input-error' : ''}
                />
              </div>
              {errors.budget && <span className="error-text">{errors.budget}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="coverPhotoUrl">Cover Image URL</label>
              <div className="input-with-icon">
                <ImageIcon size={16} className="input-icon" />
                <input
                  type="text"
                  id="coverPhotoUrl"
                  name="coverPhotoUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverPhotoUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Short Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              placeholder="A few words about your journey..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : (
                <>
                  <Send size={18} />
                  <span>Create Trip</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;
