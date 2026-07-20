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
    backstory: '',
    race: 'Human',
    signature_move: '',
    signature_ability: '',
    level: 1,
    quests_completed: 0
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedElements, setSelectedElements] = useState(['Fire']);

  // Class restrictions - defines what elements and abilities each class can have
  const classRestrictions = {
    Warrior: {
      allowedElements: ['Fire', 'Earth', 'Light'],
      allowedSignatureAbilities: [
        'Battle Cry',
        'Shield Wall', 
        'Berserker Rage',
        'Whirlwind',
        'Cleave',
        'Execute',
        'War Stomp'
      ],
      icon: '⚔️',
      color: '#dc2626',
      description: 'Master of arms and frontline combat'
    },
    Mage: {
      allowedElements: ['Fire', 'Water', 'Air', 'Dark', 'Light'],
      allowedSignatureAbilities: [
        'Arcane Surge',
        'Elemental Mastery',
        'Mind Control',
        'Teleportation',
        'Fireball',
        'Lightning Storm',
        'Time Stop'
      ],
      icon: '🔮',
      color: '#7c3aed',
      description: 'Masters of arcane arts and elemental forces'
    },
    Rogue: {
      allowedElements: ['Dark', 'Air', 'Water'],
      allowedSignatureAbilities: [
        'Shadow Step',
        'Poison Mastery',
        'Assassinate',
        'Lockpicking',
        'Backstab',
        'Evasion',
        'Sneak Attack'
      ],
      icon: '🗡️',
      color: '#16a34a',
      description: 'Stealthy operatives and masters of deception'
    },
    Cleric: {
      allowedElements: ['Light', 'Water', 'Earth'],
      allowedSignatureAbilities: [
        'Divine Shield',
        'Healing Light',
        'Holy Smite',
        'Blessing',
        'Resurrection',
        'Purify',
        'Guardian Angel'
      ],
      icon: '✨',
      color: '#d97706',
      description: 'Divine warriors wielding holy power'
    }
  };

  // Race data with icons and colors
  const races = {
    Human: { icon: '🧑', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)' },
    Elf: { icon: '🧝', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.3)' },
    Dwarf: { icon: '⛏️', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' },
    Orc: { icon: '👹', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
    Dragonborn: { icon: '🐉', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)' },
    Halfling: { icon: '🍃', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)' },
    Gnome: { icon: '🔧', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)' },
    Tiefling: { icon: '😈', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
    Aasimar: { icon: '👼', color: '#fcd34d', bg: 'rgba(252, 211, 77, 0.15)', border: 'rgba(252, 211, 77, 0.3)' },
    'Half-Elf': { icon: '🧝‍♂️', color: '#6ee7b7', bg: 'rgba(110, 231, 183, 0.15)', border: 'rgba(110, 231, 183, 0.3)' },
    'Half-Orc': { icon: '👊', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)', border: 'rgba(251, 146, 60, 0.3)' }
  };

  // Class-specific backstories
  const classBackstories = {
    Warrior: `Born in the borderlands of the Shattered Peaks, this warrior trained from youth in the ancient combat arts. They've weathered countless battles, each scar telling a story of survival and honor. Their blade has tasted the blood of both beasts and men, and they seek only to find a worthy death in the service of a noble cause.`,
    
    Mage: `Discovered as a child when they accidentally set the family barn ablaze, this mage was whisked away to the Arcane Academy. Years of study under the Grand Archmage have honed their natural talent into formidable power. They walk the thin line between mastery and madness, their magic a beautiful and terrible force of nature.`,
    
    Rogue: `Raised in the shadowy alleys of the capital's underworld, this rogue learned that the only law that matters is survival. They've picked locks for kings and cut purses for beggars, always staying one step ahead of the law. Their quick wit and quicker blade have made them a legend among the city's criminal elite.`,
    
    Cleric: `Chosen by the gods at birth, this cleric was raised in the grand temples of the holy city. They have spent their life studying ancient scriptures and performing sacred rites. Their faith is unshakeable, and their prayers carry the power to heal the wounded or smite the unholy with divine wrath.`
  };

  const genericBackstory = `A mysterious adventurer who appeared at the guild gates with nothing but their weapon and a burning desire for glory. Their past is shrouded in mystery, but their skill speaks volumes. They've proven themselves worthy of the Zenith Aegis.`;

  // Get available elements based on selected class
  const getAvailableElements = () => {
    const restrictions = classRestrictions[formData.class];
    return restrictions ? restrictions.allowedElements : ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark'];
  };

  // Get available signature abilities based on selected class
  const getAvailableAbilities = () => {
    const restrictions = classRestrictions[formData.class];
    return restrictions ? restrictions.allowedSignatureAbilities : [];
  };

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
          
          // Ensure elements are valid for the class
          const availableElements = classRestrictions[data.class]?.allowedElements || ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark'];
          const validElements = elementsArray.filter(el => availableElements.includes(el));
          
          // Set default values for new fields if they don't exist
          const updatedData = {
            ...data,
            race: data.race || 'Human',
            signature_move: data.signature_move || '',
            signature_ability: data.signature_ability || '',
            level: data.level || 1,
            quests_completed: data.quests_completed || 0
          };
          
          setFormData(updatedData);
          setSelectedElements(validElements.length > 0 ? validElements : [availableElements[0]]);
        }
      } catch (err) {
        setErrorMsg('Failed to fetch adventurer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdventurer();
  }, [id]);

  // Reset elements when class changes to ensure only allowed elements are selected
  useEffect(() => {
    const availableElements = getAvailableElements();
    setSelectedElements(prev => {
      // Keep only elements that are allowed
      const filtered = prev.filter(el => availableElements.includes(el));
      // If no elements remain, add the first available
      if (filtered.length === 0 && availableElements.length > 0) {
        return [availableElements[0]];
      }
      return filtered;
    });
  }, [formData.class]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
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

  const handleRaceSelect = (race) => {
    setFormData(prev => ({ ...prev, race }));
  };

  const handleElementToggle = (element) => {
    const availableElements = getAvailableElements();
    // Only allow toggling if the element is available for this class
    if (!availableElements.includes(element)) return;
    
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

  const availableElements = getAvailableElements();
  const availableAbilities = getAvailableAbilities();
  const currentClassRestrictions = classRestrictions[formData.class];

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

        {/* Class Selection as Buttons - THIS IS THE CATEGORY FIELD */}
        <div className="form-group">
          <label>Choose Your Class <span className="hint">(This will determine your available options)</span></label>
          <div className="button-group class-group">
            {['Warrior', 'Mage', 'Rogue', 'Cleric'].map((classType) => {
              const info = getClassInfo(classType);
              const isSelected = formData.class === classType;
              const restrictions = classRestrictions[classType];
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
                  {isSelected && (
                    <span className="class-restriction-hint">
                      {restrictions?.allowedElements.length} elements • {restrictions?.allowedSignatureAbilities.length} abilities
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {currentClassRestrictions && (
            <div className="class-description" style={{ color: currentClassRestrictions.color }}>
              {currentClassRestrictions.description}
            </div>
          )}
        </div>

        {/* Element Selection as Buttons (Multiple) - RESTRICTED BY CLASS */}
        <div className="form-group">
          <label>Affiliated Elements <span className="hint">(Select up to 3 • {availableElements.length} available for {formData.class})</span></label>
          <div className="button-group element-group">
            {availableElements.map((element) => {
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

        {/* Race Selection as Buttons */}
        <div className="form-group">
          <label>Race / Ancestry</label>
          <div className="button-group race-group">
            {Object.entries(races).map(([race, info]) => {
              const isSelected = formData.race === race;
              return (
                <button
                  key={race}
                  type="button"
                  className={`option-btn race-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    backgroundColor: isSelected ? info.bg : 'rgba(255,255,255,0.05)',
                    borderColor: isSelected ? info.color : 'rgba(255,255,255,0.15)',
                    color: isSelected ? info.color : '#9ca3af',
                    boxShadow: isSelected ? `0 0 30px ${info.color}30` : 'none'
                  }}
                  onClick={() => handleRaceSelect(race)}
                >
                  <span className="option-icon">{info.icon}</span>
                  <span className="option-label">{race}</span>
                  {isSelected && <span className="check-mark">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="level">Level</label>
            <input
              type="number"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleNumberChange}
              min="1"
              max="100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="quests_completed">Quests Completed</label>
            <input
              type="number"
              id="quests_completed"
              name="quests_completed"
              value={formData.quests_completed}
              onChange={handleNumberChange}
              min="0"
            />
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
          <label htmlFor="signature_move">Signature Move</label>
          <input
            type="text"
            id="signature_move"
            name="signature_move"
            value={formData.signature_move}
            onChange={handleChange}
            placeholder="e.g. Inferno Slash"
          />
        </div>

        {/* Signature Ability - RESTRICTED BY CLASS */}
        <div className="form-group">
          <label htmlFor="signature_ability">Signature Ability <span className="hint">({availableAbilities.length} available for {formData.class})</span></label>
          <select
            id="signature_ability"
            name="signature_ability"
            value={formData.signature_ability}
            onChange={handleChange}
            style={{
              backgroundColor: 'rgba(13, 13, 18, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          >
            <option value="">Select an ability...</option>
            {availableAbilities.map(ability => (
              <option key={ability} value={ability}>{ability}</option>
            ))}
          </select>
          {availableAbilities.length === 0 && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              ⚠️ No signature abilities available for this class. Please select a different class.
            </div>
          )}
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