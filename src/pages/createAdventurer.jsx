import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Add Link import
import { supabase } from '../supabaseClient';
import './CreateAdventurer.css';

const CreateAdventurer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    class: 'Warrior',
    element: 'Fire',
    rank: 'Bronze',
    weapon: '',
    backstory: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.weapon.trim()) {
      setErrorMsg('Please fulfill all required fields (Name & Weapon).');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('adventurers').insert([formData]);

      if (error) throw error;
      navigate('/guild-hall');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit adventurer registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <div className="recruit-page-bg"></div>

      {/* Add navigation row */}
      <div className="form-nav">
        <Link to="/guild-hall" className="btn-back">
          ← Back to Guild Hall
        </Link>
      </div>

      <h2>✨ Register New Adventurer</h2>
      <p className="form-subtitle">Enlist a hero to join the ranks of Zenith Aegis.</p>

      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="hero-form">
        <div className="form-group">
          <label htmlFor="name">Hero Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Kaelen Shadowblade"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="class">Class</label>
            <select id="class" name="class" value={formData.class} onChange={handleChange}>
              <option value="Warrior">Warrior</option>
              <option value="Mage">Mage</option>
              <option value="Rogue">Rogue</option>
              <option value="Cleric">Cleric</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="element">Affiliated Element</label>
            <select id="element" name="element" value={formData.element} onChange={handleChange}>
              <option value="Fire">Fire</option>
              <option value="Water">Water</option>
              <option value="Earth">Earth</option>
              <option value="Air">Air</option>
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rank">Guild Rank</label>
            <select id="rank" name="rank" value={formData.rank} onChange={handleChange}>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="weapon">Primary Weapon *</label>
            <input
              type="text"
              id="weapon"
              name="weapon"
              value={formData.weapon}
              onChange={handleChange}
              placeholder="e.g. Runed Claymore"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="backstory">Backstory / Origin</label>
          <textarea
            id="backstory"
            name="backstory"
            rows="4"
            value={formData.backstory}
            onChange={handleChange}
            placeholder="Describe where this hero comes from and their past feats..."
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Registering Hero...' : '⚔️ Complete Guild Registration'}
        </button>
      </form>
    </div>
  );
};

export default CreateAdventurer;