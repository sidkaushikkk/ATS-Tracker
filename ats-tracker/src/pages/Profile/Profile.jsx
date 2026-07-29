import { useState, useEffect, useRef } from 'react';
import { Camera, User, GraduationCap, Briefcase, Link2, ArrowRight } from 'lucide-react';
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
        <div className="profile-loading-wrapper">
          <div className="profile-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-form-wrapper">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-plain-form">
          
          {/* SECTION 1: PERSONAL & AVATAR */}
          <div className="form-section">
            <div className="section-title-pd">
              <User size={15} />
              <span>Personal Details</span>
            </div>
            <div className="personal-row">
              <div className="avatar-upload-wrapper" onClick={handleImageClick}>
                <div className="avatar-preview">
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" />
                  ) : (
                    <div className="avatar-fallback">
                      <User size={36} />
                    </div>
                  )}
                </div>
                <div className="avatar-edit-badge" title="Upload Photo">
                  <Camera size={14} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              <div className="personal-inputs" >
                <div className="form-field">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Alex Morgan"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
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
              </div>
            </div>
          </div>

          {/* SECTION 2: EDUCATION */}
          <div className="form-section">
            <div className="section-title">
              <GraduationCap size={15} />
              <span>Education</span>
            </div>
            <div className="form-grid grid-3">
              <div className="form-field">
                <label htmlFor="collegeName">College / University *</label>
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  placeholder="e.g. Stanford University"
                  value={formData.collegeName || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="degree">Degree</label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  placeholder="e.g. B.S."
                  value={formData.degree || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
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
          </div>

          {/* SECTION 3: CAREER */}
          <div className="form-section">
            <div className="section-title">
              <Briefcase size={15} />
              <span>Career Profile</span>
            </div>
            <div className="form-grid grid-3">
              <div className="form-field">
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
              <div className="form-field">
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
              <div className="form-field">
                <label htmlFor="targetRole">Target Role</label>
                <input
                  type="text"
                  id="targetRole"
                  name="targetRole"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.targetRole || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: LOCATION & BIO */}
          <div className="form-section">
            <div className="form-grid grid-3">
              <div className="form-field">
                <label htmlFor="graduationYear">Graduation Year *</label>
                <input
                  type="text"
                  id="graduationYear"
                  name="graduationYear"
                  placeholder="e.g. 2025"
                  value={formData.graduationYear || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
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
              <div className="form-field">
                <label htmlFor="bio">Short Career Bio / Goal</label>
                <input
                  type="text"
                  id="bio"
                  name="bio"
                  placeholder="e.g. Full-stack AI developer"
                  value={formData.bio || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: ONLINE PRESENCE */}
          <div className="form-section">
            <div className="section-title">
              <Link2 size={15} />
              <span>Online Presence</span>
            </div>
            <div className="form-grid grid-3">
              <div className="form-field">
                <label htmlFor="linkedin">LinkedIn URL</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="github">GitHub URL</label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  placeholder="https://github.com/username"
                  value={formData.github || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="portfolio">Portfolio URL</label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="form-actions-bottom">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Skip for now
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <span>{saving ? 'Saving...' : 'Save & Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Profile;
