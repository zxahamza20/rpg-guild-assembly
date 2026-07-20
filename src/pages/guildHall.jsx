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
    
    adventurers.forEach((hero) => {
      // Parse elements if stored as string, otherwise use single element
      const elements = hero.elements ? 
        hero.elements.split(', ').filter(e => e) : 
        [hero.element];
      
      // Count each element
      elements.forEach(el => {
        if (el) {
          counts[el] = (counts[el] || 0) + 1;
        }
      });
    });

    // Find the maximum count
    let maxCount = 0;
    let dominantElements = [];
    
    for (const [element, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantElements = [element];
      } else if (count === maxCount) {
        dominantElements.push(element);
      }
    }

    // If there's a tie, pick one randomly
    if (dominantElements.length > 1) {
      const randomIndex = Math.floor(Math.random() * dominantElements.length);
      return dominantElements[randomIndex];
    }

    return dominantElements[0] || 'None';
  };

  if (loading) {
    return (
      <div className="guild-hall-container">
        <div className="guild-hall-bg"></div>
        <div className="status-message">
          <p className="pulse-text">🔮 Summoning the Guild Roster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guild-hall-container">
      <div className="guild-hall-bg"></div>

      <header className="guild-header">
        <div>
          <h2>🏰 Guild Hall Roster</h2>
          <p className="subtitle">
            {adventurers.length} {adventurers.length === 1 ? 'Hero' : 'Heroes'} currently stationed at the guild.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-secondary">
            🏠 Guild HQ
          </Link>
          <Link to="/create" className="btn-primary">
            ✨ Recruit Hero
          </Link>
        </div>
      </header>

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

      {adventurers.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛡️</span>
          <h3>The Guild Hall is Quiet...</h3>
          <p>No adventurers have joined your ranks yet.</p>
          <Link to="/create" className="btn-secondary" style={{ marginTop: '1rem' }}>
            Recruit Your First Hero ⚔️
          </Link>
        </div>
      ) : (
        <div className="adventurers-grid">
          {adventurers.map((hero) => {
            // Parse elements if stored as string
            const elements = hero.elements ? 
              hero.elements.split(', ').filter(e => e) : 
              [hero.element];
            
            return (
              <div
                key={hero.id}
                className={`adventurer-card class-${hero.class} rank-${hero.rank}`}
              >
                {/* Character shadow */}
                <div className="card-shadow"></div>
                
                <div className="card-header">
                  <div className="element-bubbles">
                    {elements.map((el, index) => (
                      <span 
                        key={index}
                        className={`element-tag ${getElementBadgeClass(el)}`}
                      >
                        {el}
                      </span>
                    ))}
                  </div>
                  <span className={`rank-tag rank-${hero.rank}`}>
                    {hero.rank}
                  </span>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuildHall;