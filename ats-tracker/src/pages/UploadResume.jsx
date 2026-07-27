import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegFilePdf, FaRegFileWord, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useAuth } from "../lib/AuthContext.jsx";
import "./UploadResume.css";

export function UploadResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);
  
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle escape to close or go back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

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

  const handleAnalyze = async () => {
    if (!selectedFile || !selectedFile.fileObject) return;
    
    if (!user) {
      setError("Please login first to analyze your resume.");
      return;
    }

    if (!aiConsent) {
      setError("You must consent to AI analysis to continue.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", selectedFile.fileObject);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        const analysisData = await res.json();
        navigate("/analysis", { 
          state: { 
            analysisData, 
            fileName: selectedFile.name, 
            fileObject: selectedFile.fileObject 
          } 
        });
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to analyze resume.");
      }
    } catch (error) {
      console.error("Error uploading resume", error);
      setError("An error occurred during upload. Please check your connection.");
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

      <div className="upload-model-overlay" onClick={() => navigate("/")}>
        <div 
          className="upload-model-card" 
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Upload Resume Modal"
        >
          <button 
            className="upload-close-button" 
            onClick={() => navigate("/")} 
            aria-label="Close dialog"
          >
            ×
          </button>

          <main className="upload-model-body single-column">
            <section className="upload-section">
              <h1 className="upload-title">Upload Resume</h1>
              
              {!selectedFile ? (
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
                      onClick={() => setSelectedFile(null)}
                      disabled={isUploading}
                      aria-label="Remove selected file"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}

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
                  {isUploading ? "Analyzing resume..." : "Analyze Resume"}
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
