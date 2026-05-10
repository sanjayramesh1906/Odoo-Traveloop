git import React from 'react';
import Dashboard from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <Dashboard user={user} onLogout={handleLogout} />
  );
}
