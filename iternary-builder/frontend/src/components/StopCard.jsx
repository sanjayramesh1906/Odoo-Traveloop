import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin, Calendar, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { itineraryAPI } from '../api';
import AddActivityModal from './AddActivityModal';

export default function StopCard({ stop, onRemove, onUpdate }) {
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

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
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleRemove = async () => {
    if (confirm('Are you sure you want to remove this stop?')) {
      try {
        await itineraryAPI.removeStop(stop.id);
        onRemove();
      } catch (err) {
        console.error('Failed to remove stop', err);
      }
    }
  };

  const handleRemoveActivity = async (activityId) => {
    try {
      await itineraryAPI.removeActivity(stop.id, activityId);
      onUpdate();
    } catch (err) {
      console.error('Failed to remove activity', err);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="glass-panel"
      {...attributes}
    >
      <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
        <div 
          {...listeners} 
          style={{ 
            padding: '1.5rem 1rem', 
            cursor: 'grab', 
            display: 'flex', 
            alignItems: 'center', 
            borderRight: '1px solid var(--glass-border)',
            color: 'var(--color-text-muted)'
          }}
        >
          <GripVertical />
        </div>
        
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <MapPin size={20} style={{ color: 'var(--color-primary)' }}/>
              {stop.city?.name}, {stop.city?.countryCode}
            </h3>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {stop.arrivalDate && stop.departureDate && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={16} />
                  {format(new Date(stop.arrivalDate), 'MMM d, yyyy')} - {format(new Date(stop.departureDate), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
          
          <button className="btn btn-danger" onClick={handleRemove} style={{ padding: '0.5rem' }}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Activities</h4>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
            onClick={() => setIsAddActivityOpen(true)}
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {stop.stopActivities && stop.stopActivities.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {stop.stopActivities.map((sa) => (
              <div key={sa.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', position: 'relative' }}>
                <button 
                  onClick={() => handleRemoveActivity(sa.activityId)}
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--color-text-muted)', padding: '0.25rem' }}
                >
                  &times;
                </button>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{sa.activity?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{sa.activity?.type}</span>
                  <span>{sa.activity?.durationMinutes}m | ${sa.activity?.estimatedCost}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No activities planned yet.</p>
        )}
      </div>

      {isAddActivityOpen && (
        <AddActivityModal 
          stopId={stop.id}
          onClose={() => setIsAddActivityOpen(false)}
          onAdded={onUpdate}
        />
      )}
    </div>
  );
}
