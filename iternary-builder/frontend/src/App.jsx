import React from 'react';
import ItineraryBuilder from './components/ItineraryBuilder';

function App() {
  return (
    <div className="app-wrapper">
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Traveloop
        </h1>
        <span style={{ color: 'var(--color-text-muted)' }}>| Itinerary Builder</span>
      </header>
      
      <main>
        <ItineraryBuilder />
      </main>
    </div>
  );
}

export default App;
