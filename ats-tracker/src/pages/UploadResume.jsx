import { useState } from "react";
import UploadModel from "../components/UploadModel.jsx";
import "./UploadResume.css";

export function UploadResume() {
  const [isOpen, setIsOpen] = useState(true);

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
          </div>
        )}

        {isOpen && (
          <UploadModel onClose={() => setIsOpen(false)} />
        )}
      </main>
    </div>
  );
}
