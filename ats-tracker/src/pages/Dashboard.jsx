import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { FileText, Clock, TrendingUp } from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
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
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
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
        // Pass the analysis data to the AnalyzePage via state
        navigate("/analysis", { state: { analysisData, fileName: analysisData.fileName } });
      }
    } catch (error) {
      console.error("Failed to fetch analysis", error);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Your Resume History</h1>
        
        {loading ? (
          <div className="loading-state">Loading your history...</div>
        ) : history.length === 0 ? (
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
