import React from 'react';
import { Calendar, MapPin, Edit2, Trash2, Eye } from 'lucide-react';

const TripCard = ({ trip }) => {
  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>{trip.name}</h3>
          <div style={styles.dateRange}>
            <Calendar size={14} style={{ marginRight: '4px' }} />
            {trip.startDate} - {trip.endDate}
          </div>
        </div>
        <div className={`badge ${trip.status === 'Completed' ? 'badge-green' : trip.status === 'Upcoming' ? 'badge-yellow' : 'badge-red'}`}>
          {trip.status}
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.destinations}>
          <MapPin size={16} color="var(--primary)" />
          <span style={styles.destinationCount}>
            {trip.destinationCount} Destination{trip.destinationCount > 1 ? 's' : ''}
          </span>
        </div>
        
        <p style={styles.description}>{trip.description}</p>
      </div>

      <div style={styles.footer}>
        <div style={styles.members}>
          {trip.members.map((member, idx) => (
            <div key={idx} style={{...styles.memberAvatar, zIndex: 10 - idx, marginLeft: idx > 0 ? '-10px' : '0'}}>
              <img src={member.avatar} alt="member" style={styles.memberImg} />
            </div>
          ))}
          {trip.additionalMembers > 0 && (
            <div style={{...styles.memberAvatar, ...styles.moreMembers, zIndex: 0, marginLeft: '-10px'}}>
              +{trip.additionalMembers}
            </div>
          )}
        </div>
        
        <div style={styles.actions}>
          <button className="btn btn-green" style={styles.actionBtn}>
            <Edit2 size={14} />
            Edit
          </button>
          <button className="btn btn-red" style={styles.actionBtn}>
            <Trash2 size={14} />
            Delete
          </button>
          <button className="btn btn-yellow" style={styles.actionBtn}>
            <Eye size={14} />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  dateRange: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  },
  body: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    borderTop: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
  },
  destinations: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  destinationCount: {
    fontWeight: '500',
    fontSize: '0.875rem',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.5rem',
  },
  members: {
    display: 'flex',
    alignItems: 'center',
  },
  memberAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid #fff',
    backgroundColor: '#E5E7EB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  memberImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  moreMembers: {
    backgroundColor: 'var(--primary)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.4rem 0.75rem',
  }
};

export default TripCard;
