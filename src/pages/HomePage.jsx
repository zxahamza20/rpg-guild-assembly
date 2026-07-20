import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero-banner">
        <div className="hero-badge">⚔️ Official Guild Headquarters</div>
        <h1 className="guild-title">The Order of the Zenith Aegis</h1>
        <p className="guild-tagline">"Through Shattered Steel, We Forge Eternal Glory."</p>

        <div className="hero-actions">
          <Link to="/guild-hall" className="btn-enter-hall">
            🏰 Enter the Guild Hall
          </Link>
          <Link to="/create" className="btn-recruit-home">
            ✨ Register New Hero
          </Link>
        </div>
      </section>

      <section className="details-grid">
        
        <div className="detail-card">
          <div className="card-icon">📜</div>
          <h3>Guild History</h3>
          <p>
            Founded in the year 412 of the Third Era following the Great Astral Convergence. 
            The Zenith Aegis began as a band of four wandering mercenary champions who repelled 
            the Shadow Void at the Siege of Oakhaven. Today, it stands as the kingdom's premier bastion 
            against mythical threats.
          </p>
        </div>

        <div className="detail-card">
          <div className="card-icon">🏰</div>
          <h3>Headquarters Location</h3>
          <p>
            <strong>The Obsidian Citadel of Aethergard</strong><br />
            Perched atop the shattered peaks of the Frostveil Spire, overlooking the Eternal Mist Valleys. 
            Protected by ancient arcane wards and accessible only via griffon transport or the Sky-Bridge.
          </p>
        </div>

        <div className="detail-card">
          <div className="card-icon">🍺</div>
          <h3>Guild Facilities</h3>
          <p>
            Members enjoy unlimited access to the <em>Grand Hearth Tavern</em>, the subterranean 
            Alchemy Lab, full blacksmith forging rights, and priority contract distribution across all nine realms.
          </p>
        </div>

        <div className="detail-card">
          <div className="card-icon">🎯</div>
          <h3>Active Directives</h3>
          <p>
            Current high-priority contract: <strong>The Deep Abyss Raid</strong>. The guild is actively 
            recruiting elemental mages, heavy armored tanks, and frontline clerics to prepare for the upcoming expedition.
          </p>
        </div>

      </section>
    </div>
  );
};

export default HomePage;