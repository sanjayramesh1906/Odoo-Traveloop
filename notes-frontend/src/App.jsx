import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TripNotes from './pages/TripNotes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TripNotes />} />
      </Routes>
    </Router>
  );
}

export default App;
