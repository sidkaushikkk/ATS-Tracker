import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { FileText, Clock, TrendingUp, Edit, Award, Target, Activity } from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    metrics: null,
    history: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
  }, [navigate]);

  const handleOpenAnalysis = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      
      const res = await fetch(`${apiUrl}/analysis/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const analysisData = await res.json();
        navigate("/analysis", { state: { analysisData, fileName: analysisData.fileName } });
      }
    } catch (error) {
      console.error("Failed to fetch analysis", error);
    }
  };

  if (loading) {
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
          <div className="profile-summary glass-panel">
            <div className="profile-info">
              <h2>Welcome back, {profile.name}!</h2>
              <p className="profile-subtitle">
                {profile.currentRole || profile.currentStatus} • {profile.college}
              </p>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            </div>
            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={() => navigate('/profile')}>
                <Edit size={16} /> Edit Profile
              </button>
            </div>
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
