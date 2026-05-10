import React, { useState } from 'react';
import { Bold, Italic, Underline, List, Save } from 'lucide-react';

const NoteEditor = () => {
  const [content, setContent] = useState(`Day 3 - Kyoto.\n\nExplored the Fushimi Inari Shrine early morning. The torii gates were endless and magical.\n\nLater, had amazing matcha and traditional kaiseki dinner in Gion. The architecture is stunning. Need to remember the name of that tea house.`);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.brandTitle}>Traveloop</h1>
        <span style={styles.divider}>|</span>
        <span style={styles.pageTitle}>Trip Journal</span>
      </div>

      <div style={styles.editorCard}>
        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarGroup}>
            {/* Shapes / Tags */}
            <div style={{ ...styles.shape, backgroundColor: '#3B82F6', borderRadius: '50%' }} />
            <div style={{ ...styles.shape, backgroundColor: '#FBBF24', borderRadius: '2px' }} />
            <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '17px solid #EF4444', margin: '0 6px' }} />
            <div style={{ ...styles.shape, backgroundColor: '#10B981', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
            <div style={{ ...styles.shape, backgroundColor: '#A855F7', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          </div>

          <div style={styles.toolbarGroup}>
            <button style={styles.iconBtn}><Bold size={18} color="#111827" /></button>
            <button style={styles.iconBtn}><Italic size={18} color="#111827" /></button>
            <button style={styles.iconBtn}><Underline size={18} color="#111827" /></button>
            <button style={styles.iconBtn}><List size={18} color="#111827" /></button>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button style={styles.iconBtn}><Save size={20} color="#111827" /></button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          style={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Inter, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '0.75rem',
  },
  brandTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#000',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  divider: {
    fontSize: '1.25rem',
    color: '#D1D5DB',
  },
  pageTitle: {
    fontSize: '1.1rem',
    color: '#4B5563',
    fontWeight: '400',
  },
  editorCard: {
    backgroundColor: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#fff',
    gap: '2rem',
  },
  toolbarGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  shape: {
    width: '18px',
    height: '18px',
    margin: '0 4px',
    cursor: 'pointer',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  },
  textarea: {
    flex: 1,
    padding: '1.5rem',
    border: 'none',
    outline: 'none',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#111827',
    resize: 'none',
    fontFamily: 'inherit',
  }
};

export default NoteEditor;
