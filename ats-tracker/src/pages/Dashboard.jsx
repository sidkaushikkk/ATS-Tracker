import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../lib/AuthContext";
import { FileText, Clock, TrendingUp, Edit, Award, Target, Activity, MapPin, GraduationCap, Briefcase, Link, Code, Globe, Mail } from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    metrics: null,
    history: []
  });
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      const fetchDashboardData = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
          const res = await fetch(`${apiUrl}/dashboard`, {
            credentials: 'include'
          });
        
        if (res.ok) {
          const data = await res.json();
          
          // Check profile completeness
          if (data.profile && !data.profile.profileCompleted) {
            navigate('/profile');
            return;
          }
          
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
      };

      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const handleOpenAnalysis = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      
      const res = await fetch(`${apiUrl}/analysis/${id}`, {
        credentials: 'include'
      });
      
      if (res.ok) {
        const analysisData = await res.json();
        navigate("/analysis", { state: { analysisData, fileName: analysisData.fileName } });
      }
    } catch (error) {
      console.error("Failed to fetch analysis", error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="loading-state">Loading your dashboard...</div>
      </div>
    );
  }

  const { profile, metrics, history } = dashboardData;

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        
        {/* Profile Summary Section */}
        {profile && (
          <div className="profile-summary glass-panel expanded-profile">
            <div className="profile-header-main">
              <div className="profile-avatar">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.name} />
                ) : (
                  <div className="avatar-placeholder">{profile.name.charAt(0)}</div>
                )}
              </div>
              <div className="profile-info">
                <h2>Welcome back, {profile.name}!</h2>
                <p className="profile-subtitle">
                  <Briefcase size={16} /> {profile.currentRole || profile.currentStatus}
                </p>
                {profile.location && (
                  <p className="profile-location">
                    <MapPin size={16} /> {profile.location}
                  </p>
                )}
              </div>
              <div className="profile-actions">
                <button className="edit-profile-btn" onClick={() => navigate('/profile')}>
                  <Edit size={16} /> Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="detail-card">
                <h3><GraduationCap size={18} /> Education</h3>
                <p><strong>College:</strong> {profile.collegeName || 'Not provided'}</p>
                {(profile.degree || profile.major) && (
                  <p><strong>Major:</strong> {profile.degree} {profile.major}</p>
                )}
                {profile.graduationYear && (
                  <p><strong>Graduation:</strong> {profile.graduationYear}</p>
                )}
              </div>

              <div className="detail-card">
                <h3><Briefcase size={18} /> Career</h3>
                <p><strong>Status:</strong> {profile.currentStatus || 'Not provided'}</p>
                {profile.targetRole && (
                  <p><strong>Target Role:</strong> {profile.targetRole}</p>
                )}
                <p className="profile-email"><Mail size={16}/> {profile.email}</p>
              </div>
            </div>

            {profile.bio && (
              <div className="profile-bio-section">
                <h3>About Me</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {(profile.linkedin || profile.github || profile.portfolio) && (
              <div className="profile-social-links">
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Link size={20} /> LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Code size={20} /> GitHub
                  </a>
                )}
                {profile.portfolio && (
                  <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Globe size={20} /> Portfolio
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Metrics Section */}
        {metrics && (
          <div className="metrics-grid">
            <div className="metric-card glass-panel">
              <div className="metric-icon blue"><FileText size={24} /></div>
              <div className="metric-content">
                <h3>Resumes Analyzed</h3>
                <p className="metric-value">{metrics.resumesAnalyzed}</p>
              </div>
            </div>
            <div className="metric-card glass-panel">
              <div className="metric-icon purple"><Activity size={24} /></div>
              <div className="metric-content">
                <h3>Latest Score</h3>
                <p className="metric-value">{metrics.latestScore}<span className="metric-suffix">/100</span></p>
              </div>
            </div>
            <div className="metric-card glass-panel">
              <div className="metric-icon green"><Target size={24} /></div>
              <div className="metric-content">
                <h3>Average Score</h3>
                <p className="metric-value">{metrics.averageScore}<span className="metric-suffix">/100</span></p>
              </div>
            </div>
            <div className="metric-card glass-panel">
              <div className="metric-icon gold"><Award size={24} /></div>
              <div className="metric-content">
                <h3>Best Score</h3>
                <p className="metric-value">{metrics.bestScore}<span className="metric-suffix">/100</span></p>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        <h2 className="section-title">Resume History</h2>
        
        {history.length === 0 ? (
          <div className="empty-state">
            <p>You haven't analyzed any resumes yet.</p>
            <button onClick={() => navigate("/upload-resume")} className="upload-btn">
              Analyze a Resume
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((item) => (
              <div 
                key={item._id} 
                className="history-card glass-panel"
                onClick={() => handleOpenAnalysis(item._id)}
              >
                <div className="history-card-header">
                  <FileText className="file-icon" />
                  <h3 className="file-name" title={item.fileName}>
                    {item.fileName}
                  </h3>
                </div>
                
                <div className="history-card-details">
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item score">
                    <TrendingUp size={16} />
                    <span className="score-value">Score: {item.overallScore}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
