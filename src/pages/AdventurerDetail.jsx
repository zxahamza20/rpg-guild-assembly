import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdventurerDetail.css';

const AdventurerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroDetail = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('adventurers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setHero(data);
      } catch (error) {
        console.error('Error fetching adventurer details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHeroDetail();
  }, [id]);

  const calculateCombatPower = (adventurer) => {
    if (!adventurer) return 0;

    let base = 1000;

    const rankMultipliers = {
      Bronze: 1.0,
      Silver: 1.5,
      Gold: 2.2,
      Platinum: 3.5,
    };

    const classBonuses = {
      Warrior: 450,
      Mage: 500,
      Rogue: 400,
      Cleric: 350,
    };

    const multiplier = rankMultipliers[adventurer.rank] || 1.0;
    const bonus = classBonuses[adventurer.class] || 200;

    return Math.floor((base + bonus) * multiplier);
  };

  const getHeroBackstory = (adventurer) => {
    if (adventurer.backstory) return adventurer.backstory;

    return `${adventurer.name} is a renowned ${adventurer.class} hailing from the distant lands. Master of the ${adventurer.element} element, they wield their trusted ${adventurer.weapon} with unmatched skill, earning their respected ${adventurer.rank} rank within the guild.`;
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="status-message">
          <p>📜 Inspecting Hero Credentials...</p>
        </div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="detail-container">
        <div className="empty-state">
          <h3>Hero Not Found</h3>
          <p>No adventurer matching this ledger entry was found in the database.</p>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Back to Guild Hall
          </button>
        </div>
      </div>
    );
  }

  const combatPower = calculateCombatPower(hero);

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <span className="rank-badge">{hero.rank} Rank</span>
            <h2>{hero.name}</h2>
            <p className="element-sub">{hero.element} Elemental Specialist</p>
          </div>
          <div className="cp-badge">
            <span className="cp-label">Combat Power</span>
            <span className="cp-value">⚔️ {combatPower.toLocaleString()} CP</span>
          </div>
        </div>

        <hr className="divider" />

        <div className="attributes-grid">
          <div className="attr-item">
            <span className="attr-label">Class</span>
            <span className="attr-value">{hero.class}</span>
          </div>
          <div className="attr-item">
            <span className="attr-label">Primary Weapon</span>
            <span className="attr-value">{hero.weapon}</span>
          </div>
          <div className="attr-item">
            <span className="attr-label">Element</span>
            <span className="attr-value">{hero.element}</span>
          </div>
          <div className="attr-item">
            <span className="attr-label">Recruitment Date</span>
            <span className="attr-value">
              {new Date(hero.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="bio-section">
          <h3>📜 Guild Ledger Bio & Backstory</h3>
          <p>{getHeroBackstory(hero)}</p>
        </div>

        <div className="detail-actions">
          <Link to="/" className="btn-secondary">
            ⬅️ Back to Guild Hall
          </Link>
          <Link to={`/edit/${hero.id}`} className="btn-primary">
            ⚙️ Modify Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdventurerDetail;