import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MyTrips from './pages/MyTrips';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/my-trips" element={<MyTrips />} />
        {/* Redirect root to my-trips for now */}
        <Route path="/" element={<Navigate to="/my-trips" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
