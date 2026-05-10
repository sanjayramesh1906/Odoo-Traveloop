import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Map } from 'lucide-react';
import { itineraryAPI } from '../api';
import StopCard from './StopCard';
import AddStopModal from './AddStopModal';

export default function ItineraryBuilder() {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);

  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const res = await itineraryAPI.getItinerary();
      setStops(res.data.stops || []);
    } catch (err) {
      setError('Failed to load itinerary. Please ensure backend is running and database is seeded.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = stops.findIndex((s) => s.id === active.id);
      const newIndex = stops.findIndex((s) => s.id === over.id);

      const newStops = arrayMove(stops, oldIndex, newIndex);
      setStops(newStops);

      try {
        await itineraryAPI.reorderStops(newStops.map(s => s.id));
      } catch (err) {
        console.error('Failed to reorder', err);
        // Revert on failure
        fetchItinerary();
      }
    }
  };

  const handleStopAdded = (newStop) => {
    setStops([...stops, newStop]);
  };

  const handleStopRemoved = (stopId) => {
    setStops(stops.filter(s => s.id !== stopId));
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container" style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Trip Itinerary</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Drag and drop cities to rearrange your journey.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddStopOpen(true)}>
          <Plus size={20} />
          Add Stop
        </button>
      </div>

      {stops.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Map size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
          <h3>No stops added yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Start building your itinerary by adding your first city.</p>
          <button className="btn btn-primary" onClick={() => setIsAddStopOpen(true)}>
            Add First Stop
          </button>
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={stops.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stops.map((stop) => (
                <StopCard 
                  key={stop.id} 
                  stop={stop} 
                  onRemove={() => handleStopRemoved(stop.id)}
                  onUpdate={fetchItinerary}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isAddStopOpen && (
        <AddStopModal 
          onClose={() => setIsAddStopOpen(false)} 
          onAdd={handleStopAdded}
        />
      )}
    </div>
  );
}
