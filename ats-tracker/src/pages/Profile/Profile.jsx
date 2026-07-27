import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../lib/AuthContext';
import './Profile.css';

function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeName: '',
    degree: '',
    major: '',
    currentStatus: '',
    currentRole: '',
    targetRole: '',
    graduationYear: '',
    location: '',
    bio: '',
    linkedin: '',
    github: '',
    portfolio: '',
    profilePicture: ''
  });
  
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      const fetchProfile = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
          const res = await fetch(`${apiUrl}/profile`, {
            credentials: 'include'
          });
        
        if (res.ok) {
          const data = await res.json();
          // Initialize form data with existing profile
          setFormData(prev => ({
            ...prev,
            ...data
          }));
        } else {
          setError('Failed to fetch profile.');
        }
      } catch (err) {
        console.error('Error fetching profile', err);
        setError('Error fetching profile.');
      } finally {
        setLoading(false);
      }
      };

      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${apiUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        // Redirect to dashboard on success
        navigate('/dashboard');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile', err);
      setError('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-loading">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Complete Your Profile</h1>
          <p>Please provide your details to personalize your dashboard.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-form glass-panel">
          <div className="profile-image-upload-container">
            <div className="profile-image-upload" onClick={handleImageClick}>
              <div className="image-preview">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" />
                ) : (
                  <div className="image-placeholder">
                    <Camera size={32} />
                    <span>Upload Photo</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="collegeName">College/University*</label>
              <input
                type="text"
                id="collegeName"
                name="collegeName"
                value={formData.collegeName || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="degree">Degree </label>
              <input
                type="text"
                id="degree"
                name="degree"
                placeholder="e.g. B.S."
                value={formData.degree || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="major">Major</label>
              <input
                type="text"
                id="major"
                name="major"
                placeholder="e.g. Computer Science"
                value={formData.major || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="currentStatus">Current Status *</label>
              <select
                id="currentStatus"
                name="currentStatus"
                value={formData.currentStatus || ''}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Status</option>
                <option value="Student">Student</option>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Working Professional">Working Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group half-width">
              <label htmlFor="currentRole">Current Role *</label>
              <input
                type="text"
                id="currentRole"
                name="currentRole"
                placeholder="e.g. Frontend Developer"
                value={formData.currentRole || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="targetRole">Target Role</label>
              <input
                type="text"
                id="targetRole"
                name="targetRole"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.targetRole || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="graduationYear">Graduation Year *</label>
              <input
                type="text"
                id="graduationYear"
                name="graduationYear"
                placeholder="e.g. 2024"
                value={formData.graduationYear || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="City, State"
                value={formData.location || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Short Career Goal/Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio || ''}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="github">GitHub URL</label>
              <input
                type="url"
                id="github"
                name="github"
                value={formData.github || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="portfolio">Portfolio URL</label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={formData.portfolio || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
