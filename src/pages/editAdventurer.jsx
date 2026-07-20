import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './EditAdventurer.css';

const EditAdventurer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    class: 'Warrior',
    element: 'Fire',
    rank: 'Bronze',
    weapon: '',
    backstory: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        if (data) setFormData(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('adventurers')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      navigate(`/adventurer/${id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update adventurer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="create-container">
        <div className="recruit-page-bg"></div>
        <p className="pulse-text">📜 Retrieving Hero Record...</p>
      </div>
    );
  }

  return (
    <div className="create-container">
      <div className="recruit-page-bg"></div>

      <h2>⚙️ Edit Adventurer Record</h2>
      <p className="form-subtitle">Update parameters for {formData.name || 'Hero'}.</p>

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