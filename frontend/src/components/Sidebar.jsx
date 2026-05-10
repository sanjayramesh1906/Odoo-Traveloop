import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Compass, Map, BarChart2, Users, Settings, Plus, 
  FileText, ShoppingBag, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Explorer', icon: <Compass size={20} />, path: '/dashboard' },
    { name: 'My Plans', icon: <Map size={20} />, path: '/my-trips' },
    { name: 'Journal', icon: <FileText size={20} />, path: '/notes' },
    { name: 'Packing List', icon: <ShoppingBag size={20} />, path: '/packing' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/profile' },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="tl-logo-mini">
          <span className="shape-square"></span>
          <span className="shape-circle"></span>
          <span className="shape-diamond"></span>
        </div>
        <h2>Traveloop</h2>
      </div>
      
      <div className="user-profile-widget">
        <img src={user?.photoUrl || "https://i.pravatar.cc/150?img=11"} alt="User Avatar" className="avatar-large" />
        <h3 className="user-name">{user?.name || "Traveloop"}</h3>
        <p className="user-title">Modern Nomad</p>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) || 
                          (item.path === '/my-trips' && location.pathname.includes('/trips/'));
          
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-ghost full-width mt-10" onClick={() => { logout(); navigate('/login'); }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
