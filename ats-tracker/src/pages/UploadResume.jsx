import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegFilePdf, FaRegFileWord, FaCloudUploadAlt, FaTimes, FaExclamationTriangle, FaLock } from "react-icons/fa";
import { Sparkles, CheckCircle2, Loader2, FileText, SearchCheck, BrainCircuit, Award } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../lib/AuthContext.jsx";
import "./UploadResume.css";

const ANALYSIS_STAGES = [
  { id: 1, label: "Extracting document structure & metadata...", Icon: FileText },
  { id: 2, label: "Scanning ATS keywords & density...", Icon: SearchCheck },
  { id: 3, label: "Evaluating formatting, impact & sections...", Icon: BrainCircuit },
  { id: 4, label: "Formulating AI score & recommendations...", Icon: Award },
];

const ATS_TIPS = [
  "Over 75% of resumes are filtered out by ATS before a hiring manager sees them.",
  "Using standard section headings like 'Work Experience' and 'Education' helps ATS parsers read your file accurately.",
  "Quantifying your achievements with metrics and percentages can increase callback rates by up to 40%.",
  "Avoid using complex multi-column tables or graphics, as ATS scanners cannot reliably parse them.",
  "Aligning your resume's key skills with job descriptions dramatically increases match confidence."
];

export function UploadResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);
  
  const [currentStage, setCurrentStage] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  
  const fileInputRef = useRef(null);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Handle escape to close or go back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isUploading) {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, isUploading]);

  // Loading animation intervals
  useEffect(() => {
    if (!isUploading) {
      setCurrentStage(0);
      setAnalysisProgress(0);
      setTipIndex(0);
      return;
    }

    // Step & progress interval
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev < 90) {
          const next = prev + Math.random() * 2.5 + 1;
          if (next >= 75) setCurrentStage(3);
          else if (next >= 50) setCurrentStage(2);
          else if (next >= 25) setCurrentStage(1);
          else setCurrentStage(0);
          return Math.min(next, 92);
        }
        return prev;
      });
    }, 200);

    // Tip rotation interval
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ATS_TIPS.length);
    }, 3800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [isUploading]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file) => {
    setError(null);
    setAnalysisFailed(false);
    setShowLoginPrompt(false);
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    const validExtensions = ["pdf", "docx"];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      setError("Please upload a valid PDF or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setSelectedFile({
      name: file.name,
      size: formatSize(file.size),
      extension: ext,
      fileObject: file,
      status: "ready"
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.user) {
        login(data.user);
        setShowLoginPrompt(false);
      }
    } catch (err) {
      console.error("Google login failed from upload prompt", err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !selectedFile.fileObject) return;
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!aiConsent) {
      setError("You must consent to AI analysis to continue.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setAnalysisFailed(false);

    const formData = new FormData();
    formData.append("resume", selectedFile.fileObject);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        credentials: 'include',
        body: formData,
      });

      const analysisData = await res.json().catch(() => null);

      if (res.ok && analysisData && analysisData.success !== false) {
        setAnalysisProgress(100);
        setCurrentStage(3);
        setTimeout(() => {
          navigate("/analysis", { 
            state: { 
              analysisData, 
              fileName: selectedFile.name, 
              fileObject: selectedFile.fileObject 
            } 
          });
        }, 400);
      } else {
        setAnalysisFailed(true);
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setAnalysisFailed(true);
    } finally {
      setIsUploading(false);
    }
  };

  const renderFileIcon = (ext) => {
    if (ext === "pdf") {
      return <FaRegFilePdf className="file-type-icon pdf-icon" />;
    }
    return <FaRegFileWord className="file-type-icon word-icon" />;
  };

  return (
    <div className="upload-resume-page">
      <div className="bg-decoration wave-left"></div>
      <div className="bg-decoration wave-right"></div>
      
      <header className="mockup-page-header">
        <div className="mockup-logo">
          <span className="logo-dot"></span>
          <span className="logo-text">ATS Tracker</span>
        </div>
      </header>

      <div className="upload-model-overlay" onClick={() => !isUploading && navigate("/")}>
        <div 
          className="upload-model-card" 
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Upload Resume Modal"
        >
          <button 
            className="upload-close-button" 
            onClick={() => !isUploading && navigate("/")} 
            disabled={isUploading}
            aria-label="Close dialog"
          >
            ×
          </button>

          <main className="upload-model-body single-column">
            <section className="upload-section">
              {!isUploading && <h1 className="upload-title">Upload Resume</h1>}
              
              {isUploading ? (
                <div className="analysis-loading-card">
                  <div className="loading-badge">
                    <Sparkles className="sparkle-icon glowing" />
                    <span>AI Resume Engine Active</span>
                  </div>

                  <h2 className="loading-title">Analyzing Your Resume</h2>
                  <p className="loading-filename">
                    Target File: <span className="file-pill-name">{selectedFile?.name}</span>
                  </p>

                  <div className="progress-wrapper">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${analysisProgress}%` }}
                      >
                        <div className="progress-shimmer"></div>
                      </div>
                    </div>
                    <div className="progress-percentage">{Math.round(analysisProgress)}%</div>
                  </div>

                  <div className="loading-steps-list">
                    {ANALYSIS_STAGES.map((stage, idx) => {
                      const isDone = currentStage > idx;
                      const isCurrent = currentStage === idx;
                      const StageIcon = stage.Icon;
                      
                      return (
                        <div 
                          key={stage.id} 
                          className={`step-item ${isDone ? "completed" : ""} ${isCurrent ? "active" : ""}`}
                        >
                          <div className="step-icon-wrap">
                            {isDone ? (
                              <CheckCircle2 className="step-check-icon" />
                            ) : isCurrent ? (
                              <Loader2 className="step-spin-icon" />
                            ) : (
                              <StageIcon className="step-default-icon" />
                            )}
                          </div>
                          <span className="step-label">{stage.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="ats-tip-box">
                    <div className="tip-header">
                      <Sparkles className="tip-sparkle" />
                      <span>ATS Pro Tip</span>
                    </div>
                    <p className="tip-content" key={tipIndex}>
                      {ATS_TIPS[tipIndex]}
                    </p>
                  </div>
                </div>
              ) : analysisFailed ? (
                <div className="analysis-error-card">
                  <div className="error-icon-circle">
                    <FaExclamationTriangle className="error-warning-icon" />
                  </div>
                  <h2 className="error-card-title">Analysis Failed</h2>
                  <p className="error-card-body">
                    We couldn't analyze your resume at the moment.<br/>Please try again.
                  </p>
                  <div className="error-card-actions">
                    <button 
                      className="upload-cancel-btn" 
                      onClick={() => { setAnalysisFailed(false); setError(null); }}
                      disabled={isUploading}
                    >
                      Back
                    </button>
                    <button
                      className="upload-choose-btn primary-theme-btn"
                      disabled={isUploading}
                      onClick={handleAnalyze}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : !selectedFile ? (
                <div 
                  className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                  />
                  
                  <div className="upload-artwork">
                    <FaCloudUploadAlt className="upload-cloud-icon" />
                  </div>

                  <p className="upload-drop-text">
                    Drop your PDF or DOCX here.<br />
                    or <button className="upload-browse-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Browse</button>
                  </p>
                </div>
              ) : (
                <div className="selected-file-preview">
                  <div className="file-preview-card">
                    <div className="file-preview-icon">
                      {renderFileIcon(selectedFile.extension)}
                    </div>
                    <div className="file-preview-info">
                      <h3 className="file-preview-name" title={selectedFile.name}>{selectedFile.name}</h3>
                      <p className="file-preview-size">{selectedFile.size}</p>
                    </div>
                    <button 
                      className="file-preview-remove" 
                      onClick={() => { setSelectedFile(null); setAnalysisFailed(false); setShowLoginPrompt(false); }}
                      disabled={isUploading}
                      aria-label="Remove selected file"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}

              {!analysisFailed && !isUploading && (
                <>
                  <div className="ai-consent-section">
                    <label className="ai-consent-label">
                      <input
                        type="checkbox"
                        checked={aiConsent}
                        onChange={(e) => setAiConsent(e.target.checked)}
                        disabled={isUploading}
                      />
                      <span>
                        I give my consent to use my Resume Data for analyzations. 
                      </span>
                    </label>
                  </div>

                  {showLoginPrompt && !user && (
                    <div className="unauth-login-card" role="region" aria-label="Authentication Required">
                      <div className="unauth-card-header">
                        <FaLock className="unauth-lock-icon" />
                        <h3 className="unauth-card-title">Login Required</h3>
                      </div>
                      <p className="unauth-card-body">
                        Please login first to analyze your resume.
                      </p>
                      <div className="unauth-google-wrapper">
                        <GoogleLogin
                          onSuccess={handleGoogleLoginSuccess}
                          onError={() => console.error("Google login failed from prompt")}
                          theme="outline"
                          size="large"
                          text="continue_with"
                          shape="pill"
                          width="230"
                        />
                      </div>
                    </div>
                  )}

                  {error && <div className="upload-error-message">{error}</div>}

                  <div className="upload-file-list-actions">
                    <button 
                      className="upload-cancel-btn" 
                      onClick={() => navigate("/")}
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      className="upload-choose-btn primary-theme-btn"
                      disabled={!selectedFile || !aiConsent || isUploading}
                      onClick={handleAnalyze}
                    >
                      Analyze Resume
                    </button>
                  </div>
                </>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

