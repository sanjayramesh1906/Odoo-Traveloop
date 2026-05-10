import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Clock, CheckCircle2, AlertCircle, DollarSign, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { itineraryAPI } from '../../api/itinerary';
import AddActivityModal from './AddActivityModal';
import EditStopModal from './EditStopModal';

// Shapes matching the design, using unified tokens
const STOP_ICONS = [
  { shape: 'diamond', color: 'var(--success)', bg: 'rgba(52, 199, 89, 0.1)' },
  { shape: 'triangle', color: 'var(--warning)', bg: 'rgba(255, 204, 0, 0.1)' },
  { shape: 'square',   color: 'var(--danger)',  bg: 'rgba(255, 59, 48, 0.1)' },
  { shape: 'circle',   color: 'var(--primary)', bg: 'rgba(94, 92, 230, 0.1)' },
  { shape: 'pentagon', color: '#9b59b6', bg: '#f4eafb' }, // Purple (extra)
];

const ShapeIcon = ({ shape, color, bg }) => {
  const size = 28;
  const style = {
    width: 48, height: 48,
    borderRadius: 12,
    background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };
  return (
    <div style={style}>
      <svg width={size} height={size} viewBox="0 0 28 28">
        {shape === 'diamond' && <polygon points="14,2 26,14 14,26 2,14" fill={color} />}
        {shape === 'triangle' && <polygon points="14,3 26,25 2,25" fill={color} />}
        {shape === 'square'   && <rect x="3" y="3" width="22" height="22" rx="3" fill={color} />}
        {shape === 'circle'   && <circle cx="14" cy="14" r="11" fill={color} />}
        {shape === 'pentagon' && <polygon points="14,2 25,9 21,22 7,22 3,9" fill={color} />}
      </svg>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    completed: { label: 'Completed', icon: <CheckCircle2 size={13} />, cls: 'badge-completed' },
    active:    { label: 'Active',    icon: <Clock size={13} />,         cls: 'badge-active' },
    upcoming:  { label: 'Upcoming',  icon: <Clock size={13} />,         cls: 'badge-upcoming' },
    pending:   { label: 'Pending',   icon: <AlertCircle size={13} />,   cls: 'badge-pending' },
  };
  const { label, icon, cls } = map[status] || map.pending;
  return (
    <span className={`it-badge ${cls}`}>
      {icon} {label}
    </span>
  );
};

export default function StopCard({ stop, trip, dayNumber, status, onRemove, onUpdate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const iconDef = STOP_ICONS[(dayNumber - 1) % STOP_ICONS.length];

  const handleDelete = async () => {
    // Confirmation alert removed as requested for faster workflow
    try {
      await itineraryAPI.removeStop(stop.id);
      onRemove();
    } catch (err) {
      console.error('Failed to remove stop', err);
    }
  };

  const activities = stop.stopActivities || [];
  const avatarCount = Math.max(0, (dayNumber % 3));

  return (
    <>
      <div 
        ref={setNodeRef}
        style={style}
        className={`it-stop-card ${isDragging ? 'it-card-dragging' : ''}`}
      >
        <div className="it-card-header">
          {/* Drag Handle */}
          <div className="it-drag-handle" {...attributes} {...listeners}>
            <GripVertical size={20} />
          </div>
          
          <ShapeIcon {...iconDef} />
          <div className="it-card-title-area">
            <h3 className="it-card-title">
              {stop.city?.name}{stop.city?.countryCode ? `, ${stop.city.countryCode}` : ''}
            </h3>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="it-card-activities-list">
          {activities.length > 0 ? (
            activities.map((sa) => (
              <div key={sa.id} className="it-activity-row">
                <div className="it-activity-marker"></div>
                <div className="it-activity-content">
                  <span className="it-activity-name">{sa.activity?.name}</span>
                  <div className="it-activity-meta">
                    <span className="it-meta-pill">
                      <Clock size={10} /> {sa.activity?.durationMinutes}m
                    </span>
                    <span className="it-meta-pill">
                      <DollarSign size={10} /> ${sa.activity?.estimatedCost}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="it-card-desc">No activities planned yet.</p>
          )}
        </div>

        {avatarCount > 0 && (
          <div className="it-card-avatars">
            {Array.from({ length: Math.min(avatarCount, 3) }).map((_, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/32?img=${10 + dayNumber + i}`}
                alt="Member"
                className="it-avatar"
              />
            ))}
          </div>
        )}

        <div className="it-card-actions">
          <button className="it-btn it-btn-edit" onClick={() => setIsEditOpen(true)}>
            <Edit2 size={14} /> Edit
          </button>
          <button className="it-btn it-btn-delete" onClick={handleDelete}>
            <Trash2 size={14} /> Remove
          </button>
          <button className="it-btn it-btn-view" onClick={() => setIsAddActivityOpen(true)}>
            <Eye size={14} /> Add Activities
          </button>
        </div>
      </div>

      {isAddActivityOpen && (
        <AddActivityModal
          stopId={stop.id}
          stop={stop}
          onClose={() => setIsAddActivityOpen(false)}
          onAdded={onUpdate}
        />
      )}

      {isEditOpen && (
        <EditStopModal
          stop={stop}
          trip={trip}
          onClose={() => setIsEditOpen(false)}
          onSaved={onUpdate}
        />
      )}
    </>
  );
}
