import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

export default function CollaboratePanel({ tripId, members = [] }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire up to backend invite API
    setSent(true);
    setTimeout(() => { setSent(false); setEmail(''); }, 3000);
  };

  return (
    <div className="collaborate-panel">
      <h3 className="collab-title">Collaborate with Friends</h3>
      <p className="collab-subtitle">Invite others to plan this trip.</p>

      <form onSubmit={handleInvite} className="collab-form">
        <input
          type="email"
          className="collab-input"
          placeholder="Enter email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit" className="collab-invite-btn">
          {sent ? '✓ Sent!' : 'Invite'}
        </button>
      </form>

      <div className="collab-members-section">
        <p className="collab-members-label">Current Members:</p>
        {members.length === 0 ? (
          <div className="collab-empty">
            <UserPlus size={24} />
            <p>No members yet. Invite someone!</p>
          </div>
        ) : (
          <div className="collab-avatars">
            {members.map((m, i) => (
              <img
                key={m.id || i}
                src={m.user?.photoUrl || `https://i.pravatar.cc/40?img=${20 + i}`}
                alt={m.user?.name || 'Member'}
                title={m.user?.name || m.user?.email}
                className="collab-avatar"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
