import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegFilePdf, FaCheckCircle, FaExchangeAlt } from "react-icons/fa";
import UploadModel from "../components/UploadModel.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import "./UploadResume.css";

export function UploadResume() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);

  const handleProceed = async () => {
    if (selectedFile && selectedFile.fileObject) {
      setIsUploading(true);
      if (!user) {
        alert("Please login first to analyze your resume.");
        setIsUploading(false);
        return;
      }

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
          navigate("/analysis", { state: { analysisData, fileName: selectedFile.name, fileObject: selectedFile.fileObject } });
        } else {
          alert("Failed to analyze resume.");
        }
      } catch (error) {
        console.error("Error uploading resume", error);
        alert("An error occurred during upload.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="upload-resume-page">
      {/* Background decoration representing the mockup page */}
      <div className="bg-decoration wave-left"></div>
      <div className="bg-decoration wave-right"></div>
      
      {/* Mockup Top Header Navigation bar */}
      <header className="mockup-page-header">
        <div className="mockup-logo">
          <span className="logo-dot"></span>
          <span className="logo-text">ATS Tracker</span>
        </div>
      </header>

      {/* Main content area */}
      <main className="upload-resume-content">
        {!isOpen && (
          <div className="closed-state-container">
            {selectedFile ? (
              <div className="selected-file-state">
                <div className="selected-file-header">
                  <div className="selected-file-icon">
                    <FaRegFilePdf />
                  </div>
                  <div className="selected-file-info">
                    <h3 className="selected-file-name" title={selectedFile.name}>
                      {selectedFile.name}
                    </h3>
                    <p className="selected-file-size">{selectedFile.size}</p>
                  </div>
                </div>

                <div className="upload-success-alert">
                  <FaCheckCircle className="success-alert-icon" />
                  <span>Resume uploaded successfully!</span>
                </div>

                <div className="selected-file-actions">
                  <button 
                    className="change-file-btn" 
                    onClick={() => {
                      setSelectedFile(null);
                      setIsOpen(true);
                    }}
                  >
                    <FaExchangeAlt /> Change File
                  </button>
                  <button 
                    className="proceed-btn" 
                    onClick={handleProceed}
                    disabled={isUploading}
                  >
                    {isUploading ? "Analyzing..." : "Proceed to Analysis"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="closed-state-title">File Upload Model Closed</h2>
                <p className="closed-state-desc">
                  You can trigger Resume Upload by clicking the button below.
                </p>
                <button 
                  className="open-model-trigger-btn" 
                  onClick={() => setIsOpen(true)}
                >
                  Open Upload Box
                </button>
              </>
            )}
          </div>
        )}

        {isOpen && (
          <UploadModel 
            onClose={() => setIsOpen(false)} 
            onSelect={(file) => {
              setSelectedFile(file);
              setIsOpen(false);
            }} 
          />
        )}
      </main>
    </div>
  );
}
