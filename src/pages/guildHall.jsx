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

  const getClassColor = (cls) => {
    const colors = {
      Warrior: '#dc2626',
      Mage: '#7c3aed',
      Rogue: '#16a34a',
      Cleric: '#d97706'
    };
    return colors[cls] || '#6b7280';
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
      const elements = hero.elements ? 
        hero.elements.split(', ').filter(e => e) : 
        [hero.element];
      
      elements.forEach(el => {
        if (el) {
          counts[el] = (counts[el] || 0) + 1;
        }
      });
    });

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

    if (dominantElements.length > 1) {
      return dominantElements.slice(0, 3).join(', ');
    }

    return dominantElements[0] || 'None';
  };

  // Calculate Success Score
  const calculateSuccessScore = () => {
    if (adventurers.length === 0) return 0;
    
    let score = 0;
    
    // Factor 1: Team composition diversity
    const classes = new Set(adventurers.map(h => h.class));
    const elements = new Set();
    adventurers.forEach(h => {
      const el = h.elements ? h.elements.split(', ').filter(e => e) : [h.element];
      el.forEach(e => elements.add(e));
    });
    
    if (classes.size >= 3) score += 20;
    if (elements.size >= 4) score += 15;
    if (classes.size >= 4) score += 10;
    
    // Factor 2: High ranks
    const platinumCount = adventurers.filter(h => h.rank === 'Platinum').length;
    const goldCount = adventurers.filter(h => h.rank === 'Gold').length;
    score += platinumCount * 10 + goldCount * 5;
    
    // Factor 3: Average level
    const avgLevel = adventurers.reduce((sum, h) => sum + (h.level || 1), 0) / adventurers.length;
    score += Math.min(avgLevel * 0.5, 20);
    
    // Factor 4: Quest completion
    const totalQuests = adventurers.reduce((sum, h) => sum + (h.quests_completed || 0), 0);
    score += Math.min(totalQuests * 0.2, 15);
    
    // Factor 5: Signature abilities
    const hasSignature = adventurers.filter(h => h.signature_ability).length;
    score += Math.min(hasSignature * 2, 10);
    
    // Factor 6: Team size bonus
    if (adventurers.length >= 5) score += 5;
    if (adventurers.length >= 10) score += 5;
    
    return Math.min(Math.round(score), 100);
  };

  // Get success tier
  const getSuccessTier = (score) => {
    if (score >= 80) return { label: '⚔️ Legendary Guild', color: '#ffd700', glow: '0 0 40px rgba(255, 215, 0, 0.4)' };
    if (score >= 60) return { label: '🏆 Elite Company', color: '#c0c0c0', glow: '0 0 30px rgba(192, 192, 192, 0.3)' };
    if (score >= 40) return { label: '⚡ Rising Power', color: '#cd7f32', glow: '0 0 30px rgba(205, 127, 50, 0.3)' };
    if (score >= 20) return { label: '🌱 Growing Adventurers', color: '#22c55e', glow: '0 0 20px rgba(34, 197, 94, 0.2)' };
    return { label: '🛡️ New Recruits', color: '#6b7280', glow: '0 0 20px rgba(107, 114, 128, 0.2)' };
  };

  // Calculate class percentages
  const getClassPercentages = () => {
    const total = adventurers.length;
    if (total === 0) return {};
    
    const counts = {};
    adventurers.forEach(hero => {
      counts[hero.class] = (counts[hero.class] || 0) + 1;
    });
    
    const percentages = {};
    Object.entries(counts).forEach(([cls, count]) => {
      percentages[cls] = Math.round((count / total) * 100);
    });
    return percentages;
  };

  // Calculate element percentages
  const getElementPercentages = () => {
    const total = adventurers.length;
    if (total === 0) return {};
    
    const counts = {};
    adventurers.forEach(hero => {
      const elements = hero.elements ? hero.elements.split(', ').filter(e => e) : [hero.element];
      elements.forEach(el => {
        counts[el] = (counts[el] || 0) + 1;
      });
    });
    
    const percentages = {};
    Object.entries(counts).forEach(([el, count]) => {
      percentages[el] = Math.round((count / total) * 100);
    });
    return percentages;
  };

  const successScore = calculateSuccessScore();
  const successTier = getSuccessTier(successScore);
  const classPercentages = getClassPercentages();
  const elementPercentages = getElementPercentages();

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

      {/* Success Score Banner */}
      {adventurers.length > 0 && (
        <div className="success-banner" style={{ 
          borderColor: successTier.color,
          boxShadow: successTier.glow
        }}>
          <div className="success-content">
            <div className="success-icon">🏆</div>
            <div className="success-info">
              <div className="success-label">Guild Success Score</div>
              <div className="success-value" style={{ color: successTier.color }}>
                {successScore}/100
              </div>
              <div className="success-tier">{successTier.label}</div>
            </div>
            <div className="success-metrics">
              <span>⚔️ {adventurers.length} Heroes</span>
              <span>📜 {adventurers.reduce((sum, h) => sum + (h.quests_completed || 0), 0)} Quests</span>
              <span>⭐ {adventurers.filter(h => h.rank === 'Platinum').length} Platinum</span>
            </div>
          </div>
          <div className="success-bar">
            <div className="success-bar-fill" style={{ 
              width: `${successScore}%`,
              background: `linear-gradient(90deg, ${successTier.color}, ${successTier.color}dd)`
            }} />
          </div>
        </div>
      )}

      {adventurers.length > 0 && (
        <div className="stats-banner">
          <div className="stat-card">
            <span className="stat-label">Total Squad CP</span>
            <span className="stat-value">⚔️ {calculateTotalCP().toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Dominant Element(S)</span>
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

      {/* Crew Analytics Section */}
      {adventurers.length > 0 && (
        <div className="crew-analytics">
          <h3>📊 Crew Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-section">
              <h4>Class Distribution</h4>
              {Object.entries(classPercentages).map(([cls, percentage]) => (
                <div key={cls} className="analytics-bar">
                  <span className="analytics-label">{cls}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        background: getClassColor(cls)
                      }}
                    />
                  </div>
                  <span className="analytics-percent">{percentage}%</span>
                </div>
              ))}
            </div>
            <div className="analytics-section">
              <h4>Element Distribution</h4>
              {Object.entries(elementPercentages).slice(0, 6).map(([el, percentage]) => (
                <div key={el} className="analytics-bar">
                  <span className="analytics-label">{el}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill bar-fill-element" 
                      style={{ 
                        width: `${percentage}%`,
                        background: `var(--${el.toLowerCase()}-color, #6b7280)`
                      }}
                    />
                  </div>
                  <span className="analytics-percent">{percentage}%</span>
                </div>
              ))}
            </div>
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
        <div className="adventurers-grid" style={{
          borderColor: successTier.color,
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '16px',
          padding: '1rem',
          background: `rgba(255, 255, 255, 0.02)`,
          transition: 'all 0.5s ease'
        }}>
          {adventurers.map((hero) => {
            const elements = hero.elements ? 
              hero.elements.split(', ').filter(e => e) : 
              [hero.element];
            
            return (
              <div
                key={hero.id}
                className={`adventurer-card class-${hero.class} rank-${hero.rank}`}
              >
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
                  {hero.level && (
                    <p className="hero-level" style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Level {hero.level} • {hero.quests_completed || 0} Quests
                    </p>
                  )}
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