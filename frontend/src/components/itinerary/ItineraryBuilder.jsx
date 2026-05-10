import React, { useState, useEffect } from 'react';
import { Plus, Map } from 'lucide-react';
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
import { itineraryAPI } from '../../api/itinerary';
import StopCard from './StopCard';
import AddStopModal from './AddStopModal';

export default function ItineraryBuilder({ tripId }) {
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);

  useEffect(() => {
    if (tripId) fetchItinerary();
  }, [tripId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await itineraryAPI.getItinerary(tripId);
      setTrip(res.data);
      // Ensure stops are sorted by orderIndex
      const sortedStops = (res.data.stops || []).sort((a, b) => a.orderIndex - b.orderIndex);
      setStops(sortedStops);
    } catch (err) {
      setError('Failed to load itinerary. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = stops.findIndex((s) => s.id === active.id);
      const newIndex = stops.findIndex((s) => s.id === over.id);

      const newStops = arrayMove(stops, oldIndex, newIndex);
      setStops(newStops);

      try {
        await itineraryAPI.reorderStops(tripId, newStops.map(s => s.id));
      } catch (err) {
        console.error('Failed to reorder stops', err);
        fetchItinerary(); // Revert on failure
      }
    }
  };

  const handleStopAdded = () => fetchItinerary();
  const handleStopRemoved = (stopId) => setStops(prev => prev.filter(s => s.id !== stopId));

  // Determine status for each stop based on dates
  const getStatus = (stop) => {
    const now = new Date();
    if (!stop.arrivalDate) return 'pending';
    const arrival = new Date(stop.arrivalDate);
    const departure = stop.departureDate ? new Date(stop.departureDate) : null;
    if (departure && now > departure) return 'completed';
    if (arrival <= now && (!departure || now <= departure)) return 'active';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="it-loading">
        <div className="it-spinner"></div>
        <p>Loading your itinerary...</p>
      </div>
    );
  }

  if (error) {
    return <div className="it-error">{error}</div>;
  }

  return (
    <div className="it-builder">
      {stops.length === 0 ? (
        <div className="it-empty-state">
          <div className="it-empty-icon">
            <Map size={40} />
          </div>
          <h3>Your itinerary is empty</h3>
          <p>Start by adding your first destination to build your journey.</p>
          <button className="btn-primary" onClick={() => setIsAddStopOpen(true)}>
            <Plus size={18} /> Add Your First Stop
          </button>
        </div>
      ) : (
        <div className="it-timeline">
          {/* Timeline vertical line */}
          <div className="it-timeline-line"></div>

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={stops.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {stops.map((stop, index) => {
                const status = getStatus(stop);
                const dayNumber = index + 1;
                const dateLabel = stop.arrivalDate
                  ? new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : null;

                return (
                  <div key={stop.id} className="it-timeline-row">
                    {/* Left: Day label + marker */}
                    <div className="it-timeline-left">
                      <div className="it-day-label">Day {dayNumber}</div>
                      {dateLabel && <div className="it-day-date">{dateLabel}</div>}
                      <div className={`it-marker it-marker-${status}`}></div>
                    </div>

                    {/* Right: Stop card */}
                    <StopCard
                      stop={stop}
                      trip={trip}
                      dayNumber={dayNumber}
                      status={status}
                      onRemove={() => handleStopRemoved(stop.id)}
                      onUpdate={fetchItinerary}
                    />
                  </div>
                );
              })}
            </SortableContext>
          </DndContext>

          {/* Add Stop button at bottom of timeline */}
          <div className="it-timeline-row it-add-row">
            <div className="it-timeline-left">
              <div className="it-day-label">Day {stops.length + 1}</div>
              <div className="it-marker it-marker-add">+</div>
            </div>
            <button className="it-add-stop-btn" onClick={() => setIsAddStopOpen(true)}>
              <Plus size={18} />
              <span>Add Next Stop</span>
            </button>
          </div>
        </div>
      )}

      {isAddStopOpen && (
        <AddStopModal
          tripId={tripId}
          trip={trip}
          onClose={() => setIsAddStopOpen(false)}
          onAdd={handleStopAdded}
        />
      )}
    </div>
  );
}
