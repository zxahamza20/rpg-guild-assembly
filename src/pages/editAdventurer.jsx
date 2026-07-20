import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './EditAdventurer.css';

const EditAdventurer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    weapon: '',
    element: '',
    rank: 'Bronze',
    backstory: '',
  });

  const classes = ['Warrior', 'Mage', 'Rogue', 'Cleric'];
  const elements = ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark'];
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum'];

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
          setFormData({
            name: data.name || '',
            class: data.class || '',
            weapon: data.weapon || '',
            element: data.element || '',
            rank: data.rank || 'Bronze',
            backstory: data.backstory || '',
          });
        }
      } catch (error) {
        console.error('Error loading adventurer details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAdventurer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionClick = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.class || !formData.weapon || !formData.element) {
      alert('⚠️ Please complete all fields before saving changes!');
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('adventurers')
        .update({
          name: formData.name,
          class: formData.class,
          weapon: formData.weapon,
          element: formData.element,
          rank: formData.rank,
          backstory: formData.backstory,
        })
        .eq('id', id);

      if (error) throw error;

      navigate('/');
    } catch (error) {
      console.error('Error updating adventurer:', error);
      alert('Failed to update adventurer records. Check console for details.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmBanish = window.confirm(
      `⚠️ Are you sure you want to banish ${formData.name} from the guild? This action cannot be undone.`
    );

    if (!confirmBanish) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('adventurers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      navigate('/');
    } catch (error) {
      console.error('Error deleting adventurer:', error);
      alert('Failed to banish adventurer. Check console for details.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-container">
        <div className="status-message">
          <p>📜 Fetching Guild Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <div className="edit-header">
        <h2>⚙️ Modify Adventurer Registration</h2>
        <p className="subtitle">Update records or banish this hero from the guild ledger.</p>
      </div>

      <form onSubmit={handleUpdate} className="edit-form">
        
        <div className="form-group">
          <label htmlFor="name">Adventurer Name</label>
          <input
            type="text"
            id="name"
            name="name"
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
            value={formData.weapon}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="backstory">Guild Backstory / Notes</label>
          <textarea
            id="backstory"
            name="backstory"
            rows="3"
            placeholder="Write a custom backstory or notes for this hero..."
            value={formData.backstory}
            onChange={handleChange}
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
          <label>Guild Rank</label>
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

        <div className="form-actions">
          <button
            type="submit"
            className="btn-update"
            disabled={isUpdating || isDeleting}
          >
            {isUpdating ? 'Saving Changes...' : '💾 Save Changes'}
          </button>

          <button
            type="button"
            className="btn-delete"
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
          >
            {isDeleting ? 'Banishing...' : '🔥 Banish Hero'}
          </button>
        </div>

        <div className="back-link-wrapper">
          <Link to={`/adventurer/${id}`} className="link-cancel">
            Cancel & Return to Profile
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditAdventurer;