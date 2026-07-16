import  { useState, useEffect, useRef } from "react";
import { FaRegFilePdf, FaRegFileWord, FaRegFileArchive, FaCloudUploadAlt } from "react-icons/fa";
import "./UploadModel.css";

export default function UploadModel({ onClose, onSelect }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(2); // Match mockup where the 3rd item is highlighted
  
  // Initial list matching the mockup files and progress
  const [files, setFiles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const chooseFile = (id) => {
    const chosen = files.find((f) => f.id === id);
    if (chosen && typeof onSelect === "function") onSelect(chosen);
    onClose();
  };

  // Animate initial progress values on mount

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiles((prevFiles) =>
        prevFiles.map((file) => ({
          ...file,
          currentProgress: file.targetProgress
        }))
      );
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleBrowseClick = (e) => {
    e.stopPropagation(); // Avoid triggering dropzone click twice
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Helper to format file sizes
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Process incoming files and simulate their upload progress
  const processFiles = (newFileList) => {
    const newFilesArray = Array.from(newFileList).map((file, idx) => {
      const nameParts = file.name.split(".");
      const ext = nameParts.length > 1 ? nameParts.pop().toLowerCase() : "";
      const uniqueId = `new-file-${Date.now()}-${idx}`;

      return {
        id: uniqueId,
        name: file.name,
        size: formatSize(file.size),
        extension: ext,
        targetProgress: 100,
        currentProgress: 0,
        status: "uploading"
      };
    });

    // Append new files to state
    setFiles((prev) => [...prev, ...newFilesArray]);

    // Simulate progress ticks for each newly added file
    newFilesArray.forEach((newFile) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id
                ? { ...f, currentProgress: 100, status: "success" }
                : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, currentProgress: progress } : f
            )
          );
        }
      }, 200);
    });
  };

  // Render appropriate file type icon and badge label
  const renderFileIcon = (ext) => {
    switch (ext) {
      case "pdf":
        return (
          <div className="upload-file-icon-container pdf">
            <FaRegFilePdf />
            <span className="upload-file-tag-badge">PDF</span>
          </div>
        );
      case "doc":
      case "docx":
      case "docs":
        return (
          <div className="upload-file-icon-container word">
            <FaRegFileWord />
            <span className="upload-file-tag-badge">DOC</span>
          </div>
        );
      case "zip":
      case "rar":
      case "tar":
      case "gz":
        return (
          <div className="upload-file-icon-container zip">
            <FaRegFileArchive />
            <span className="upload-file-tag-badge">ZIP</span>
          </div>
        );
      case "xd":
        return (
          <div className="upload-file-icon-container xd">
            <FaRegFileArchive />
            <span className="upload-file-tag-badge">XD</span>
          </div>
        );
      default:
        return (
          <div className="upload-file-icon-container word">
            <FaRegFileArchive />
            <span className="upload-file-tag-badge">{ext.toUpperCase() || "FILE"}</span>
          </div>
        );
    }
  };

  return (
    <div className="upload-model-overlay" onClick={onClose}>
      <div 
        className="upload-model-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-model="true"
      >

        <button 
          className="upload-close-button" 
          onClick={onClose} 
          aria-label="Close model"
        >×
        </button>

        {/* Model Layout */}
        <main className="upload-model-body">
          {/* Left Column - Drag & Drop Zone */}
          <section className="upload-section">
            <h1 className="upload-title">Upload Files</h1>
            
            <div 
              className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: "none" }}
                multiple
                onChange={handleFileChange}
              />
              
              {/* Custom SVG/CSS Artwork Illustration */}
              <div className="upload-artwork">
                <div className="upload-art-shape pink-folder"></div>
                <div className="upload-art-shape purple-folder"></div>
                <div className="upload-art-shape photo-card-1"></div>
                <div className="upload-art-shape photo-card-2"></div>
                <FaCloudUploadAlt className="upload-cloud-icon" />
              </div>

              <p className="upload-drop-text">
                Drop your files here.<br />
                or <button className="upload-browse-btn" onClick={handleBrowseClick}>Browse</button>
              </p>
            </div>
          </section>

          {/* Right Column - Uploaded Files List */}
          <section className="upload-file-list-section">
            {files.map((file, index) => {
              const isSuccess = file.status === "success" || file.currentProgress === 100;
              return (
                <div 
                  key={file.id} 
                  className={`upload-file-row ${activeIndex === index ? "active" : ""} ${selectedId === file.id ? "selected" : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setSelectedId(file.id)}
                  onDoubleClick={() => chooseFile(file.id)}
                >
                  {renderFileIcon(file.extension)}
                  
                  <div className="upload-file-details">
                    <div className="upload-file-name-container">
                      <span className="upload-file-name" title={file.name}>
                        {file.name}
                      </span>
                      <span className="upload-file-size">
                        {file.size}
                      </span>
                    </div>

                    {/* Progress Bar (Only visible if not 100% or if explicitly needed) */}
                    <div className="upload-progress-bg">
                      <div 
                        className="upload-progress-fill" 
                        style={{ width: `${file.currentProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Far-Right Status Indicator */}
                  <div className="upload-status-indicator">
                    {isSuccess ? (
                      <div className="upload-indicator-success" aria-label="Upload successful">
                        ✓
                      </div>
                    ) : (
                      <div className="upload-indicator-progress" aria-label={`Uploading: ${file.currentProgress}%`}></div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Footer actions for choosing a file */}
            {files.length > 0 && (
              <div className="upload-file-list-actions">
                <button className="upload-cancel-btn" onClick={onClose}>Cancel</button>
                <button
                  className="upload-choose-btn"
                  disabled={!selectedId}
                  onClick={() => chooseFile(selectedId)}
                >
                  Choose file
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
