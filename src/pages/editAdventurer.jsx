import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './EditAdventurer.css';

const EditAdventurer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    class: 'Warrior',
    elements: ['Fire'],
    rank: 'Bronze',
    weapon: '',
    backstory: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedElements, setSelectedElements] = useState(['Fire']);

  // Class-specific backstories
  const classBackstories = {
    Warrior: `Born in the borderlands of the Shattered Peaks, this warrior trained from youth in the ancient combat arts. They've weathered countless battles, each scar telling a story of survival and honor. Their blade has tasted the blood of both beasts and men, and they seek only to find a worthy death in the service of a noble cause.`,
    
    Mage: `Discovered as a child when they accidentally set the family barn ablaze, this mage was whisked away to the Arcane Academy. Years of study under the Grand Archmage have honed their natural talent into formidable power. They walk the thin line between mastery and madness, their magic a beautiful and terrible force of nature.`,
    
    Rogue: `Raised in the shadowy alleys of the capital's underworld, this rogue learned that the only law that matters is survival. They've picked locks for kings and cut purses for beggars, always staying one step ahead of the law. Their quick wit and quicker blade have made them a legend among the city's criminal elite.`,
    
    Cleric: `Chosen by the gods at birth, this cleric was raised in the grand temples of the holy city. They have spent their life studying ancient scriptures and performing sacred rites. Their faith is unshakeable, and their prayers carry the power to heal the wounded or smite the unholy with divine wrath.`
  };

  const genericBackstory = `A mysterious adventurer who appeared at the guild gates with nothing but their weapon and a burning desire for glory. Their past is shrouded in mystery, but their skill speaks volumes. They've proven themselves worthy of the Zenith Aegis.`;

  useEffect(() => {
    const fetchAdventurer = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('adventurers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          // Parse elements back to array if stored as string
          const elementsArray = data.elements ? 
            data.elements.split(', ').filter(e => e) : 
            ['Fire'];
          
          setFormData(data);
          setSelectedElements(elementsArray);
        }
      } catch (err) {
        setErrorMsg('Failed to fetch adventurer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdventurer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassSelect = (classType) => {
    setFormData(prev => ({ 
      ...prev, 
      class: classType,
      backstory: classBackstories[classType] || genericBackstory
    }));
  };

  const handleRankSelect = (rank) => {
    setFormData(prev => ({ ...prev, rank }));
  };

  const handleElementToggle = (element) => {
    setSelectedElements(prev => {
      if (prev.includes(element)) {
        if (prev.length <= 1) return prev;
        return prev.filter(e => e !== element);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, element];
      }
    });
  };

  // Update formData when selectedElements changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, elements: selectedElements }));
  }, [selectedElements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setSubmitting(true);
      const submitData = {
        ...formData,
        elements: formData.elements.join(', ')
      };
      
      const { error } = await supabase
        .from('adventurers')
        .update(submitData)
        .eq('id', id);

      if (error) throw error;
      navigate(`/adventurer/${id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update adventurer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get element display info
  const getElementInfo = (element) => {
    const elements = {
      Fire: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', icon: '🔥', glow: '0 0 20px rgba(239, 68, 68, 0.4)' },
      Water: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)', icon: '💧', glow: '0 0 20px rgba(59, 130, 246, 0.4)' },
      Earth: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.2)', icon: '🌍', glow: '0 0 20px rgba(34, 197, 94, 0.4)' },
      Air: { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)', icon: '🌪️', glow: '0 0 20px rgba(6, 182, 212, 0.4)' },
      Light: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.2)', icon: '✨', glow: '0 0 20px rgba(234, 179, 8, 0.4)' },
      Dark: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', icon: '🌙', glow: '0 0 20px rgba(139, 92, 246, 0.4)' }
    };
    return elements[element] || { color: '#fff', bg: 'rgba(255,255,255,0.1)', icon: '⚡', glow: 'none' };
  };

  // Get class display info
  const getClassInfo = (classType) => {
    const classes = {
      Warrior: { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.2)', icon: '⚔️' },
      Mage: { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.2)', icon: '🔮' },
      Rogue: { color: '#16a34a', bg: 'rgba(22, 163, 74, 0.2)', icon: '🗡️' },
      Cleric: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.2)', icon: '✨' }
    };
    return classes[classType] || { color: '#fff', bg: 'rgba(255,255,255,0.1)', icon: '⚔️' };
  };

  // Get rank display info
  const getRankInfo = (rank) => {
    const ranks = {
      Bronze: { color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.2)', icon: '🥉' },
      Silver: { color: '#c0c0c0', bg: 'rgba(192, 192, 192, 0.2)', icon: '🥈' },
      Gold: { color: '#ffd700', bg: 'rgba(255, 215, 0, 0.2)', icon: '🥇' },
      Platinum: { color: '#b8b8d0', bg: 'rgba(184, 184, 208, 0.2)', icon: '💎' }
    };
    return ranks[rank] || { color: '#fff', bg: 'rgba(255,255,255,0.1)', icon: '⭐' };
  };

  if (loading) {
    return (
      <div className="create-container">
        <div className="recruit-page-bg"></div>
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <p className="pulse-text">📜 Retrieving Hero Record...</p>
      </div>
    );
  }

  return (
    <div className="create-container">
      <div className="recruit-page-bg"></div>
      
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="form-nav">
        <div className="nav-buttons">
          <Link to="/guild-hall" className="btn-back">
            ← Back to Guild Hall
          </Link>
          <Link to={`/adventurer/${id}`} className="btn-back btn-back-profile">
            👤 Back to Profile
          </Link>
        </div>
      </div>

      <div className="form-header">
        <h2>⚙️ Edit Adventurer Record</h2>
        <p className="form-subtitle">Update parameters for {formData.name || 'Hero'}.</p>
      </div>

      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="hero-form">
        {/* Character Preview/Avatar Area */}
        <div className="character-preview">
          <div className="avatar-container" style={{
            borderColor: getElementInfo(selectedElements[0] || 'Fire').color,
            boxShadow: getElementInfo(selectedElements[0] || 'Fire').glow
          }}>
            <div className="avatar-icon">
              {getClassInfo(formData.class).icon}
            </div>
            <div className="avatar-name">{formData.name || 'New Hero'}</div>
            <div className="avatar-details">
              <span>{formData.rank}</span>
              <span>{formData.class}</span>
            </div>
            <div className="avatar-elements">
              {selectedElements.map(el => (
                <span key={el} style={{ color: getElementInfo(el).color }}>
                  {getElementInfo(el).icon}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Hero Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Class Selection as Buttons */}
        <div className="form-group">
          <label>Choose Your Class</label>
          <div className="button-group class-group">
            {['Warrior', 'Mage', 'Rogue', 'Cleric'].map((classType) => {
              const info = getClassInfo(classType);
              const isSelected = formData.class === classType;
              return (
                <button
                  key={classType}
                  type="button"
                  className={`option-btn class-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    backgroundColor: isSelected ? info.color : 'rgba(255,255,255,0.05)',
                    borderColor: isSelected ? info.color : 'rgba(255,255,255,0.2)',
                    color: isSelected ? '#fff' : '#9ca3af',
                    boxShadow: isSelected ? `0 0 30px ${info.color}40` : 'none'
                  }}
                  onClick={() => handleClassSelect(classType)}
                >
                  <span className="option-icon">{info.icon}</span>
                  <span className="option-label">{classType}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Element Selection as Buttons (Multiple) */}
        <div className="form-group">
          <label>Affiliated Elements <span className="hint">(Select up to 3)</span></label>
          <div className="button-group element-group">
            {['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark'].map((element) => {
              const info = getElementInfo(element);
              const isSelected = selectedElements.includes(element);
              return (
                <button
                  key={element}
                  type="button"
                  className={`option-btn element-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    backgroundColor: isSelected ? info.bg : 'rgba(255,255,255,0.05)',
                    borderColor: isSelected ? info.color : 'rgba(255,255,255,0.2)',
                    color: isSelected ? info.color : '#9ca3af',
                    boxShadow: isSelected ? info.glow : 'none'
                  }}
                  onClick={() => handleElementToggle(element)}
                >
                  <span className="option-icon">{info.icon}</span>
                  <span className="option-label">{element}</span>
                  {isSelected && <span className="check-mark">✓</span>}
                </button>
              );
            })}
          </div>
          <div className="element-counter">
            {selectedElements.length}/3 Elements Selected
          </div>
        </div>

        {/* Rank Selection as Buttons */}
        <div className="form-group">
          <label>Guild Rank</label>
          <div className="button-group rank-group">
            {['Bronze', 'Silver', 'Gold', 'Platinum'].map((rank) => {
              const info = getRankInfo(rank);
              const isSelected = formData.rank === rank;
              return (
                <button
                  key={rank}
                  type="button"
                  className={`option-btn rank-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    backgroundColor: isSelected ? info.bg : 'rgba(255,255,255,0.05)',
                    borderColor: isSelected ? info.color : 'rgba(255,255,255,0.2)',
                    color: isSelected ? info.color : '#9ca3af',
                    boxShadow: isSelected ? `0 0 30px ${info.color}30` : 'none'
                  }}
                  onClick={() => handleRankSelect(rank)}
                >
                  <span className="option-icon">{info.icon}</span>
                  <span className="option-label">{rank}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="weapon">Primary Weapon *</label>
          <input
            type="text"
            id="weapon"
            name="weapon"
            value={formData.weapon}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="backstory">Backstory / Origin</label>
          <textarea
            id="backstory"
            name="backstory"
            rows="4"
            value={formData.backstory}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Updating...' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditAdventurer;