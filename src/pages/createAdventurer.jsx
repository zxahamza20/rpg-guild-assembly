import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './CreateAdventurer.css';

const CreateAdventurer = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    weapon: '',
    element: '',
    rank: 'Bronze', 
  });

  const classes = ['Warrior', 'Mage', 'Rogue', 'Cleric'];
  const elements = ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark'];
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionClick = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!formData.name || !formData.class || !formData.weapon || !formData.element) {
      alert('⚠️ Please complete all fields to recruit this hero!');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('adventurers')
        .insert([
          {
            name: formData.name,
            class: formData.class,
            weapon: formData.weapon,
            element: formData.element,
            rank: formData.rank,
          },
        ]);

      if (error) throw error;

      navigate('/');
    } catch (error) {
      console.error('Error recruiting adventurer:', error);
      alert('Failed to recruit adventurer. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-container">
      <h2>✨ Recruit a New Hero</h2>
      <p className="subtitle">Set their attributes to prepare them for the guild.</p>

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="name">Adventurer Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. Arthur Pendragon"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="weapon">Primary Weapon</label>
          <input
            type="text"
            id="weapon"
            name="weapon"
            placeholder="e.g. Broadsword, Elder Staff"
            value={formData.weapon}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label>Class</label>
          <div className="options-grid">
            {classes.map((cls) => (
              <div
                key={cls}
                className={`option-card ${formData.class === cls ? 'selected' : ''}`}
                onClick={() => handleOptionClick('class', cls)}
              >
                {cls}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Element Mastery</label>
          <div className="options-grid">
            {elements.map((el) => (
              <div
                key={el}
                className={`option-card ${formData.element === el ? 'selected' : ''}`}
                onClick={() => handleOptionClick('element', el)}
              >
                {el}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Starting Rank</label>
          <div className="options-grid">
            {ranks.map((r) => (
              <div
                key={r}
                className={`option-card ${formData.rank === r ? 'selected' : ''}`}
                onClick={() => handleOptionClick('rank', r)}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Recruiting...' : 'Seal the Pact ⚔️'}
        </button>
      </form>
    </div>
  );
};

export default CreateAdventurer;