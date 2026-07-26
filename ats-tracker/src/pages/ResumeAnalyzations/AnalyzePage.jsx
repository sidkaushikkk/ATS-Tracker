import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Award, 
  ArrowLeft, 
  UploadCloud, 
  ShieldCheck, 
  Briefcase, 
  Layers 
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./AnalyzePage.css";

function getMatchTone(match) {
  if (match >= 90) return "excellent";
  if (match >= 80) return "strong";
  if (match >= 70) return "good";
  return "potential";
}

// Custom Intersection Observer Hook for animations
function useIntersectionObserver(options = { threshold: 0.1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  });

  return [ref, isVisible];
}

// Reusable Scroll Animated Section Component
function AnimatedSection({ children, className = "" }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`scroll-section ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export default function AnalyzePage() {
  const location = useLocation();
  const navigate = useNavigate();

const selectedFile = location.state?.selectedFile;

const fileObject =
  selectedFile?.fileObject ?? location.state?.fileObject ?? null;

const file = {
  name: selectedFile?.name ?? location.state?.fileName ?? "Resume.pdf",
  size: selectedFile?.size ?? "Unknown Size",
};
  const analysisData = location.state?.analysisData;

  const [fileUrl, setFileUrl] = useState(null);

  // Generate object URL for the raw fileObject if available
  useEffect(() => {
    if (!fileObject) {
      const cleanupId = window.requestAnimationFrame(() => setFileUrl(null));
      return () => window.cancelAnimationFrame(cleanupId);
    }

    const url = URL.createObjectURL(fileObject);
    const cleanupId = window.requestAnimationFrame(() => setFileUrl(url));

    return () => {
      window.cancelAnimationFrame(cleanupId);
      URL.revokeObjectURL(url);
    };
  }, [fileObject]);
  const [scores, setScores] = useState({
    overall: 0,
    formatting: 0,
    keywords: 0,
    readability: 0,
    structure: 0
  });
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);

  // Animate the scores when page loads
  useEffect(() => {
    if (!analysisData) {
      // If directly accessed without data, redirect to upload
      navigate("/upload-resume");
      return;
    }

    const targets = {
      overall: analysisData.overallScore,
      formatting: Math.min(100, analysisData.overallScore + 5),
      keywords: Math.min(100, analysisData.overallScore + 2),
      readability: Math.min(100, analysisData.overallScore + 8),
      structure: Math.min(100, analysisData.overallScore + 3)
    };

    const duration = 1600; // 1.6s duration
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);

      setScores({
        overall: Math.round(easeProgress * targets.overall),
        formatting: Math.round(easeProgress * targets.formatting),
        keywords: Math.round(easeProgress * targets.keywords),
        readability: Math.round(easeProgress * targets.readability),
        structure: Math.round(easeProgress * targets.structure)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnalysisReady(true);
      }
    };

    requestAnimationFrame(animate);
  }, [analysisData, navigate]);

  // Semicircular Arc Dash Offset calculation
  // Total arc length of M 10 60 A 50 50 0 0 1 110 60 is exactly PI * r = 3.14159 * 50 = 157.08
  const arcLength = 157.08;
  const strokeDashoffset = arcLength - (arcLength * (scores.overall / 100));

  // Keyword Match Visbility Tracker
  const [keywordSectionRef, isKeywordSectionVisible] = useIntersectionObserver();
  const [jobRolesSectionRef, isJobRolesSectionVisible] = useIntersectionObserver();

  const keywords = analysisData?.matchedKeywords || [];
  const suitableJobRoles = analysisData?.recommendedRoles || [];
  const observations = analysisData?.keyObservations || [];
  const problems = analysisData?.problems || [];
  const suggestions = analysisData?.suggestions || [];

  return (
    <div className="analyze-page-wrapper">
      <Navbar />

      <div className="analyze-container">
        
        {/* HERO SECTION: Split layout */}
        <section className="analysis-hero-grid">
          
          {/* LEFT PANEL: PDF Viewer Mockup */}
          <div className="document-viewer-card glass-panel">
            <div className="doc-viewer-header">
              <div className="doc-viewer-file-details">
                <div className="file-icon-badge">PDF</div>
                <div className="file-info-text">
                  <h3 className="file-display-name" title={file.name}>
                    {file.name}
                  </h3>
                  <span className="file-display-size">{file.size}</span>
                </div>
              </div>
            </div>

            <div className="doc-viewer-container">
              {/* Scan Overlay Effect */}
              <div className={`moving-scan-line ${isAnalysisReady ? "is-analysis-ready" : ""}`}></div>
              <div className={`document-glow-overlay ${isAnalysisReady ? "is-analysis-ready" : ""}`}></div>

              {fileUrl ? (
                <iframe 
                  src={`${fileUrl}#toolbar=0&navpanes=0`} 
                  className="pdf-iframe-viewer" 
                  title="Resume Document Viewer" 
                />
              ) : (
                <div className="pdf-preview-fallback">
                  <div className="fallback-doc-header">
                    <div className="fallback-doc-avatar"></div>
                    <div className="fallback-doc-bar title-bar"></div>
                    <div className="fallback-doc-bar subtitle-bar"></div>
                  </div>
                  <div className="fallback-doc-body">
                    <div className="fallback-doc-block">
                      <div className="fallback-doc-section-title"></div>
                      <div className="fallback-doc-bar text-bar"></div>
                      <div className="fallback-doc-bar text-bar"></div>
                      <div className="fallback-doc-bar text-bar short"></div>
                    </div>
                    <div className="fallback-doc-block">
                      <div className="fallback-doc-section-title"></div>
                      <div className="fallback-doc-bar text-bar"></div>
                      <div className="fallback-doc-bar text-bar"></div>
                      <div className="fallback-doc-bar text-bar short"></div>
                    </div>
                    <div className="fallback-doc-block">
                      <div className="fallback-doc-section-title"></div>
                      <div className="fallback-doc-bar text-bar"></div>
                      <div className="fallback-doc-bar text-bar short"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: ATS Gauge & Score Metrics */}
          <div className="score-details-card glass-panel">
            <h2 className="score-panel-title">ATS Metrics Dashboard</h2>

            {/* Semicircular Gauge */}
            <div className="gauge-outer-wrapper">
              <div className="gauge-ring-container">
                <svg viewBox="0 0 120 70" className="gauge-arc-svg">
                  <defs>
                    <linearGradient id="arcColorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="60%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer track */}
                  <path
                    d="M 10 60 A 50 50 0 0 1 110 60"
                    fill="none"
                    stroke="#eef2f6"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  
                  {/* Colored progress arc */}
                  <path
                    d="M 10 60 A 50 50 0 0 1 110 60"
                    fill="none"
                    stroke="url(#arcColorGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="157.08"
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>

                {/* Score numbers overlays */}
                <div className="gauge-text-overlay">
                  <span className="gauge-number-value">{scores.overall}</span>
                  <span className="gauge-total-divider">/ 100</span>
                </div>
              </div>

              <div className="score-labels-group">
                <h3 className="score-main-lbl">ATS Score</h3>
                <span className="score-badge excellent-badge">Excellent Resume</span>
              </div>
            </div>

            {/* Four metric cards */}
            <div className="metric-cards-grid">
              <div className="mini-metric-card">
                <span className="mini-card-title">Formatting</span>
                <div className="mini-card-score-row">
                  <span className="mini-card-num">{scores.formatting}%</span>
                  <span className="dot-indicator green"></span>
                </div>
              </div>
              <div className="mini-metric-card">
                <span className="mini-card-title">Keywords</span>
                <div className="mini-card-score-row">
                  <span className="mini-card-num">{scores.keywords}%</span>
                  <span className="dot-indicator green"></span>
                </div>
              </div>
              <div className="mini-metric-card">
                <span className="mini-card-title">Readability</span>
                <div className="mini-card-score-row">
                  <span className="mini-card-num">{scores.readability}%</span>
                  <span className="dot-indicator green"></span>
                </div>
              </div>
              <div className="mini-metric-card">
                <span className="mini-card-title">Structure</span>
                <div className="mini-card-score-row">
                  <span className="mini-card-num">{scores.structure}%</span>
                  <span className="dot-indicator green"></span>
                </div>
              </div>
            </div>

            {/* Success indicator message */}
            <div className="analysis-status-strip">
              <div className="status-badge-circle">
                <ShieldCheck size={20} className="status-checkmark" />
              </div>
              <div className="status-strip-text">
                <p className="status-bold-msg">Resume successfully analyzed.</p>
                <p className="status-sub-msg">Analysis completed successfully.</p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 1: Key Observations, Problems & Suggestions */}
        <div className="analysis-details-grid">
          
          <AnimatedSection className="obs-col shadow-card-block">
            <div className="card-block-header green-theme">
              <CheckCircle size={22} className="block-icon" />
              <h2>Key Observations</h2>
            </div>
            <ul className="observations-bullet-list">
              {observations.map((obs, i) => (
                <li key={i}>
                  <div className="bullet-circle success">✓</div>
                  <span>{obs}</span>
                </li>
              ))}
              {observations.length === 0 && <li><span>No specific observations found.</span></li>}
            </ul>
          </AnimatedSection>
          <AnimatedSection className="obs-col shadow-card-block">
            <div className="card-block-header orange-theme">
              <AlertTriangle size={22} className="block-icon" />
              <h2>Problems Found</h2>
            </div>
            <ul className="observations-bullet-list">
              {problems.map((prob, i) => (
                <li key={i}>
                  <div className="bullet-circle warning">!</div>
                  <span>{prob}</span>
                </li>
              ))}
              {problems.length === 0 && <li><span>No major problems found!</span></li>}
            </ul>
          </AnimatedSection>
          <AnimatedSection className="obs-col shadow-card-block">
            <div className="card-block-header blue-theme">
              <Lightbulb size={22} className="block-icon" />
              <h2>Suggestions</h2>
            </div>
            <ul className="observations-bullet-list">
              {suggestions.map((sugg, i) => (
                <li key={i}>
                  <div className="bullet-circle suggestion">ℹ</div>
                  <span>{sugg}</span>
                </li>
              ))}
              {suggestions.length === 0 && <li><span>No specific suggestions at this time.</span></li>}
            </ul>
          </AnimatedSection>

          <AnimatedSection className="obs-col shadow-card-block">
            <div className="card-block-header blue-theme">
              <Briefcase size={22} className="block-icon" />
              <h2>Suitable Job Roles</h2>
            </div>
            <div className="job-role-match-list" ref={jobRolesSectionRef}>
              {suitableJobRoles.map((jobRole, index) => {
                const matchTone = getMatchTone(jobRole.match);

                return (
                  <div className="job-role-match-item" key={jobRole.role}>
                    <div className="job-role-match-header">
                      <span className="job-role-name">{jobRole.role}</span>
                      <span className={`job-role-match-value ${matchTone}`}>{jobRole.match}%</span>
                    </div>
                    <div className="kw-progress-track">
                      <div
                        className={`kw-progress-fill job-role-progress-fill ${matchTone}`}
                        style={{
                          width: isJobRolesSectionVisible ? `${jobRole.match}%` : "0%",
                          transition: `width 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`
                        }}
                      ></div>
                    </div>
                    <span className={`job-role-match-label ${matchTone}`}>{jobRole.level}</span>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>

        </div>

        {/* SECTION 2: ATS Keyword Match */}
        <AnimatedSection className="keyword-match-section glass-panel">
          <div className="section-header-row">
            <div className="title-with-icon">
              <TrendingUp size={24} className="section-hdr-icon" />
              <h2>ATS Keyword Match</h2>
            </div>
            <span className="keyword-section-status">Optimized Match Rates</span>
          </div>

          <div className="keyword-bars-grid" ref={keywordSectionRef}>
            {keywords.map((kw, index) => (
              <div key={kw.name} className="keyword-bar-item">
                <div className="kw-bar-labels">
                  <span className="kw-name">{kw.name}</span>
                </div>
                <div className="kw-progress-track">
                  <div
                    className="kw-progress-fill"
                    style={{
                      width: isKeywordSectionVisible ? "100%" : "0%",
                      transition: `width 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* SECTION 3: Resume Breakdown */}
        <AnimatedSection className="breakdown-section glass-panel">
          <div className="title-with-icon">
            <Layers size={24} className="section-hdr-icon" />
            <h2>Resume Breakdown</h2>
          </div>
          
          <div className="breakdown-cards-grid">
            <div className="breakdown-card">
              <span className="breakdown-card-num">9 <span className="slash-ten">/ 10</span></span>
              <span className="breakdown-card-label">Education</span>
              <div className="breakdown-meter"><div className="breakdown-fill green" style={{ width: "90%" }}></div></div>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-card-num">10 <span className="slash-ten">/ 10</span></span>
              <span className="breakdown-card-label">Projects</span>
              <div className="breakdown-meter"><div className="breakdown-fill green" style={{ width: "100%" }}></div></div>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-card-num">9 <span className="slash-ten">/ 10</span></span>
              <span className="breakdown-card-label">Skills</span>
              <div className="breakdown-meter"><div className="breakdown-fill green" style={{ width: "90%" }}></div></div>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-card-num">7 <span className="slash-ten">/ 10</span></span>
              <span className="breakdown-card-label">Experience</span>
              <div className="breakdown-meter"><div className="breakdown-fill orange" style={{ width: "70%" }}></div></div>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-card-num">9 <span className="slash-ten">/ 10</span></span>
              <span className="breakdown-card-label">Formatting</span>
              <div className="breakdown-meter"><div className="breakdown-fill green" style={{ width: "90%" }}></div></div>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-card-num">7 <span className="slash-ten">/ 10</span></span>
              <span className="breakdown-card-label">Impact</span>
              <div className="breakdown-meter"><div className="breakdown-fill orange" style={{ width: "70%" }}></div></div>
            </div>
          </div>
        </AnimatedSection>

        {/* SECTION 4: Overall Recommendation */}
        <AnimatedSection className="recommendation-callout-card">
          <div className="recommendation-badge">
            <Award size={18} />
            <span>Overall Recommendation</span>
          </div>
          <p className="recommendation-description-paragraph">
            "This resume is well structured and ATS-friendly. Adding quantified achievements, stronger keywords, and more impactful project descriptions can further improve its chances of passing ATS filters and attracting recruiters."
          </p>
        </AnimatedSection>

        {/* SECTION 5: Bottom Actions */}
        <div className="analysis-page-footer-actions">
          <button 
            className="btn btn-outline footer-action-btn"
            onClick={() => navigate("/upload-resume")}
          >
            <UploadCloud size={18} />
            <span>Upload Another Resume</span>
          </button>
          
          <button 
            className="btn btn-primary footer-action-btn primary-theme-btn"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} />
            <span>Go Back Home</span>
          </button>
        </div>

      </div>
    </div>
  );
}
