import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">⚔️ RPG Guild Assembly</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">🏰 Guild Hall</Link>
        </li>
        <li>
          <Link to="/create" className="btn-recruit">✨ Recruit Adventurer</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;