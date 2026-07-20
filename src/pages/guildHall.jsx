import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './GuildHall.css';

const GuildHall = () => {
  const [adventurers, setAdventurers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdventurers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('adventurers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdventurers(data || []);
    } catch (error) {
      console.error('Error loading guild rosters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdventurers();
  }, []);

  const getElementBadgeClass = (element) => {
    switch (element?.toLowerCase()) {
      case 'fire': return 'element-fire';
      case 'water': return 'element-water';
      case 'earth': return 'element-earth';
      case 'air': return 'element-air';
      case 'light': return 'element-light';
      case 'dark': return 'element-dark';
      default: return '';
    }
  };

  const calculateTotalCP = () => {
    const rankMultipliers = { Bronze: 1.0, Silver: 1.5, Gold: 2.2, Platinum: 3.5 };
    const classBonuses = { Warrior: 450, Mage: 500, Rogue: 400, Cleric: 350 };

    return adventurers.reduce((total, hero) => {
      const mult = rankMultipliers[hero.rank] || 1.0;
      const bonus = classBonuses[hero.class] || 200;
      return total + Math.floor((1000 + bonus) * mult);
    }, 0);
  };

  const getDominantElement = () => {
    if (adventurers.length === 0) return 'None';
    const counts = {};
    adventurers.forEach((h) => {
      counts[h.element] = (counts[h.element] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  };

  if (loading) {
    return (
      <div className="guild-hall-container">
        <div className="status-message">
          <p className="pulse-text">🔮 Summoning the Guild Roster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guild-hall-container">
      <header className="guild-header">
        <div>
          <h2>🏰 Guild Hall Roster</h2>
          <p className="subtitle">
            {adventurers.length} {adventurers.length === 1 ? 'Hero' : 'Heroes'} currently stationed at the guild.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/" className="btn-secondary" style={{ marginTop: 0 }}>
            🏠 Guild HQ
          </Link>
          <Link to="/create" className="btn-primary">
            ✨ Recruit Hero
          </Link>
        </div>
      </header>

      {/* Guild Analytics Banner */}
      {adventurers.length > 0 && (
        <div className="stats-banner">
          <div className="stat-card">
            <span className="stat-label">Total Squad CP</span>
            <span className="stat-value">⚔️ {calculateTotalCP().toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Dominant Element</span>
            <span className="stat-value">✨ {getDominantElement()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Platinum Heroes</span>
            <span className="stat-value">
              🏆 {adventurers.filter((a) => a.rank === 'Platinum').length}
            </span>
          </div>
        </div>
      )}

      {/* Empty State Guardrail */}
      {adventurers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛡️</div>
          <h3>The Guild Hall is Quiet...</h3>
          <p>No adventurers have joined your ranks yet.</p>
          <Link to="/create" className="btn-secondary">
            Recruit Your First Hero ⚔️
          </Link>
        </div>
      ) : (
        <div className="adventurers-grid">
          {adventurers.map((hero) => (
            <div
              key={hero.id}
              className={`adventurer-card border-${hero.element?.toLowerCase()}`}
            >
              <div className="card-header">
                <span className={`element-tag ${getElementBadgeClass(hero.element)}`}>
                  {hero.element}
                </span>
                <span className="rank-tag">{hero.rank} Rank</span>
              </div>

              <div className="card-body">
                <h3>{hero.name}</h3>
                <p className="hero-class">Class: <strong>{hero.class}</strong></p>
                <p className="hero-weapon">Primary Weapon: <strong>{hero.weapon}</strong></p>
              </div>

              <div className="card-actions">
                <Link to={`/adventurer/${hero.id}`} className="action-btn btn-view">
                  📜 View Profile
                </Link>
                <Link to={`/edit/${hero.id}`} className="action-btn btn-edit">
                  ⚙️ Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuildHall;