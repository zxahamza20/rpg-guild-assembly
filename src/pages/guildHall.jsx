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

  if (loading) {
    return (
      <div className="guild-hall-container">
        <div className="status-message">
          <p>🔮 Summoning the Guild Roster...</p>
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
        <Link to="/create" className="btn-primary">
          ✨ Recruit Hero
        </Link>
      </header>

      {adventurers.length === 0 ? (
        <div className="empty-state">
          <h3>The Guild Hall is Quiet...</h3>
          <p>No adventurers have joined your ranks yet!</p>
          <Link to="/create" className="btn-secondary">
            Recruit Your First Hero ⚔️
          </Link>
        </div>
      ) : (
        <div className="adventurers-grid">
          {adventurers.map((hero) => (
            <div key={hero.id} className="adventurer-card">
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