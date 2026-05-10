import React from 'react';
import { MoreVertical, Edit, Shield, Trash2 } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'Active', lastLogin: '2 mins ago' },
  { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', role: 'User', status: 'Active', lastLogin: '1 hour ago' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'User', status: 'Inactive', lastLogin: '2 days ago' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Moderator', status: 'Active', lastLogin: '5 hours ago' },
];

const UserTable = () => {
  return (
    <div className="card">
      <div style={styles.header}>
        <h3 style={styles.title}>User Management</h3>
        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>+ Add User</button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{user.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {user.role === 'Admin' && <Shield size={14} color="var(--primary)" />}
                    {user.role}
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                    {user.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{user.lastLogin}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={styles.iconBtn}><Edit size={16} /></button>
                    <button style={{ ...styles.iconBtn, color: 'var(--btn-red)' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  }
};

export default UserTable;
