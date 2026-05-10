import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Map, Users, Settings, LogOut, FileText, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

export default function TripNotes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Note editing state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      const userTrips = res.data || [];
      setTrips(userTrips);
      if (userTrips.length > 0) {
        selectTrip(userTrips[0]);
      }
    } catch (err) {
      console.error('Failed to fetch trips', err);
    } finally {
      setLoading(false);
    }
  };

  const selectTrip = async (trip) => {
    setActiveTrip(trip);
    setSelectedNote(null);
    setNoteTitle('');
    setNoteContent('');
    try {
      const res = await api.get(`/trips/${trip.id}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    }
  };

  const handleCreateNote = async () => {
    if (!activeTrip) return;
    try {
      const res = await api.post(`/trips/${activeTrip.id}/notes`, {
        title: 'New Note',
        content: ''
      });
      setNotes([res.data, ...notes]);
      selectNote(res.data);
    } catch (err) {
      console.error('Failed to create note', err);
    }
  };

  const selectNote = (note) => {
    setSelectedNote(note);
    setNoteTitle(note.title || '');
    setNoteContent(note.content || '');
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    try {
      const res = await api.put(`/notes/${selectedNote.id}`, {
        title: noteTitle,
        content: noteContent
      });
      setNotes(notes.map(n => n.id === selectedNote.id ? res.data : n));
      // Re-select to update the list view immediately
      selectNote(res.data);
    } catch (err) {
      console.error('Failed to save note', err);
    }
  };

  const handleDeleteNote = async (e, noteId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter(n => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setNoteTitle('');
        setNoteContent('');
      }
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  return (
    <div className="traveloop-layout">
      {/* Background Decorative Elements */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      
      {/* Unified Sidebar */}
      <Sidebar />

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header className="top-nav" style={{ flexShrink: 0 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">Trip Journal</h1>
            <p className="page-subtitle">Jot down important details, check-in info, and memories.</p>
          </div>
        </header>

        <div className="notes-container" style={{ display: 'flex', flex: 1, gap: '20px', padding: '20px 40px', overflow: 'hidden' }}>
          
          {/* Left pane: Trips & Note List */}
          <div className="notes-sidebar" style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
            <div className="admin-card glass" style={{ padding: '15px' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Select Trip</h3>
              <select 
                className="w-full" 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', outline: 'none' }}
                value={activeTrip?.id || ''}
                onChange={(e) => {
                  const trip = trips.find(t => t.id === e.target.value);
                  if (trip) selectTrip(trip);
                }}
              >
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>{trip.name}</option>
                ))}
              </select>
            </div>

            <div className="admin-card glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Notes</h3>
                <button className="icon-btn" style={{ background: 'var(--primary)', color: 'white' }} onClick={handleCreateNote}>
                  <Plus size={16} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notes.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>No notes for this trip.</p>
                ) : (
                  notes.map(note => (
                    <div 
                      key={note.id} 
                      onClick={() => selectNote(note)}
                      style={{ 
                        padding: '12px', 
                        borderRadius: '8px', 
                        background: selectedNote?.id === note.id ? 'var(--primary-light)' : '#f8f9fc',
                        border: selectedNote?.id === note.id ? '1px solid var(--primary)' : '1px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {note.title || 'Untitled Note'}
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="icon-btn" style={{ width: '24px', height: '24px', color: 'var(--danger)' }} onClick={(e) => handleDeleteNote(e, note.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right pane: Note Editor */}
          <div className="notes-editor-pane" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedNote ? (
              <div className="admin-card glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Note Title"
                    style={{ fontSize: '24px', fontWeight: 'bold', border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                  />
                  <button className="btn-primary" onClick={handleSaveNote} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={16} /> Save
                  </button>
                </div>
                <textarea 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Start typing your note here..."
                  style={{ 
                    flex: 1, 
                    border: 'none', 
                    background: 'transparent', 
                    outline: 'none', 
                    resize: 'none', 
                    fontSize: '16px', 
                    lineHeight: '1.6',
                    fontFamily: 'inherit'
                  }}
                ></textarea>
              </div>
            ) : (
              <div className="admin-card glass flex-center" style={{ flex: 1, color: 'var(--text-muted)' }}>
                <FileText size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <h3>Select a note or create a new one</h3>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
