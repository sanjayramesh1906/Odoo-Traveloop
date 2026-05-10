import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import NoteEditor from '../components/NoteEditor';
import { Plus } from 'lucide-react';

const mockNotes = [
  { id: 1, date: 'Oct 14, 2026', time: '09:30 AM', title: 'Day 3 - Kyoto', tag: 'Stop', preview: 'Explored the Fushimi Inari Shrine early morning...' },
  { id: 2, date: 'Oct 13, 2026', time: '08:00 PM', title: 'Robot Restaurant', tag: 'Activity', preview: 'Make sure to arrive 30 mins early for the show...' },
  { id: 3, date: 'Oct 12, 2026', time: '10:15 AM', title: 'Flight Details', tag: 'Trip', preview: 'Confirmation number XYZ123. Terminal 2...' },
];

const TripNotes = () => {
  const [activeNote, setActiveNote] = useState(1);

  return (
    <div className="app-container">
      <Sidebar />
      <main style={styles.mainContent}>
        <TopNav />
        
        <div style={styles.contentArea}>
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.title}>Trip Notes</h1>
              <p style={styles.subtitle}>Jot down important details, reminders, and journal entries.</p>
            </div>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus size={16} /> New Note
            </button>
          </div>
          
          <div style={styles.layout}>
            {/* Notes List */}
            <div style={styles.notesList}>
              {mockNotes.map(note => (
                <div 
                  key={note.id} 
                  style={{...styles.noteItem, ...(activeNote === note.id ? styles.noteItemActive : {})}}
                  onClick={() => setActiveNote(note.id)}
                >
                  <div style={styles.noteItemHeader}>
                    <span style={styles.noteTitle}>{note.title}</span>
                    <span className="badge badge-yellow">{note.tag}</span>
                  </div>
                  <p style={styles.notePreview}>{note.preview}</p>
                  <div style={styles.noteMeta}>
                    {note.date} • {note.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Note Editor */}
            <div style={styles.editorWrapper}>
              <NoteEditor />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  contentArea: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    margin: 0,
  },
  layout: {
    display: 'flex',
    gap: '2rem',
    flex: 1,
    minHeight: 0,
  },
  notesList: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },
  noteItem: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  noteItemActive: {
    borderColor: 'var(--primary)',
    boxShadow: '0 0 0 1px var(--primary)',
  },
  noteItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  noteTitle: {
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  notePreview: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    margin: '0 0 0.75rem 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  noteMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  editorWrapper: {
    flex: 1,
    overflowY: 'auto',
  }
};

export default TripNotes;
