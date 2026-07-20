import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdventurerDetail.css';

const AdventurerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('adventurers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setHero(data);
      } catch (err) {
        setErrorMsg('Hero not found or removed from the ledger.');
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to banish ${hero.name} from the guild? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      const { error } = await supabase
        .from('adventurers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/guild-hall');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to banish hero.');
      setDeleting(false);
    }
  };

  const calculateCP = (rank, heroClass) => {
    const rankMultipliers = { Bronze: 1.0, Silver: 1.5, Gold: 2.2, Platinum: 3.5 };
    const classBonuses = { Warrior: 450, Mage: 500, Rogue: 400, Cleric: 350 };
    const mult = rankMultipliers[rank] || 1.0;
    const bonus = classBonuses[heroClass] || 200;
    return Math.floor((1000 + bonus) * mult);
  };

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
      <div className="detail-container">
        <div className="hero-details-bg"></div>
        <div className="status-message">
          <p className="pulse-text">🔮 Reading the Ancient Scroll...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !hero) {
    return (
      <div className="detail-container">
        <div className="hero-details-bg"></div>
        <div className="empty-state">
          <h3>⚠️ Hero Record Missing</h3>
          <p>{errorMsg || 'Could not locate this adventurer.'}</p>
          <Link to="/guild-hall" className="btn-secondary">
            Return to Guild Hall
          </Link>
        </div>
      </div>
    );
  }

  const elements = hero.elements ? 
    hero.elements.split(', ').filter(e => e) : 
    [hero.element];

  return (
    <div className="detail-container">
      <div className="hero-details-bg"></div>

      <div className="detail-nav">
        <Link to="/guild-hall" className="btn-back-guild">
          🏰 Back to Guild Hall
        </Link>
      </div>

      <div className="hero-profile-card">
        <header className="profile-header">
          <div>
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
            <h2>{hero.name}</h2>
            <p className="hero-subtext">
              {hero.rank} Rank • {hero.class} • {hero.race || 'Unknown Race'} • Level {hero.level || 1}
            </p>
          </div>
          <div className="cp-badge">
            <span className="cp-label">Combat Power</span>
            <span className="cp-value">⚔️ {calculateCP(hero.rank, hero.class).toLocaleString()}</span>
          </div>
        </header>

        <hr className="profile-divider" />

        <div className="profile-stats-grid">
          <div className="stat-box">
            <span className="box-label">Primary Weapon</span>
            <span className="box-value">🗡️ {hero.weapon}</span>
          </div>
          <div className="stat-box">
            <span className="box-label">Guild Standing</span>
            <span className="box-value">🏅 {hero.rank} Adventurer</span>
          </div>
          <div className="stat-box">
            <span className="box-label">Quests Completed</span>
            <span className="box-value">📜 {hero.quests_completed || 0}</span>
          </div>
          <div className="stat-box">
            <span className="box-label">Signature Move</span>
            <span className="box-value">⚡ {hero.signature_move || 'None'}</span>
          </div>
        </div>

        <div className="profile-section">
          <h3>🎯 Signature Ability</h3>
          <p className="backstory-text" style={{ fontSize: '1.1rem', color: '#c7d2fe' }}>
            {hero.signature_ability || 'No signature ability recorded.'}
          </p>
        </div>

        <div className="profile-section" style={{ marginTop: '1.5rem' }}>
          <h3>📜 Hero Backstory & Records</h3>
          <p className="backstory-text">
            {hero.backstory || 'No recorded history available for this adventurer.'}
          </p>
        </div>

        <footer className="profile-actions">
          <Link to={`/edit/${hero.id}`} className="action-btn btn-edit-hero">
            ⚙️ Edit Profile
          </Link>
          <button
            onClick={handleDelete}
            className="action-btn btn-banish-hero"
            disabled={deleting}
          >
            {deleting ? 'Banishing...' : '🔥 Banish from Guild'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdventurerDetail;