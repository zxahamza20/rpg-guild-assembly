import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">⚔️ Zenith Aegis</Link>
      </div>
      
      <ul className="sidebar-links">
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            🏠 Guild HQ
          </Link>
        </li>
        <li>
          <Link 
            to="/guild-hall" 
            className={location.pathname === '/guild-hall' ? 'active' : ''}
          >
            🏰 Guild Hall
          </Link>
        </li>
        <li>
          <Link 
            to="/create" 
            className={`btn-recruit ${location.pathname === '/create' ? 'active' : ''}`}
          >
            ✨ Recruit Hero
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <p>Guild Ledger v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;