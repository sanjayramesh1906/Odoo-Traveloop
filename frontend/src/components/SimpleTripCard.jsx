import React from 'react';
import { Compass, Globe, Map, Navigation } from 'lucide-react';
import './SimpleTripCard.css';

const colors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA', '#F4511E', '#3949AB'];
const icons = [Globe, Compass, Map, Navigation];

const SimpleTripCard = ({ trip, onClick }) => {
  const hash = trip.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColor = colors[hash % colors.length];
  const IconComponent = icons[hash % icons.length];

  return (
    <div className="simple-trip-card" onClick={onClick}>
      <div className="stc-icon" style={{ backgroundColor: bgColor }}>
        <IconComponent size={24} color="#fff" strokeWidth={1.5} />
      </div>
      <h3 className="stc-title">{trip.name}</h3>
      <p className="stc-dates">{trip.startDate} - {trip.endDate}</p>
    </div>
  );
};

export default SimpleTripCard;
