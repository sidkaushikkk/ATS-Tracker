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
  Check, 
  ShieldCheck, 
  Briefcase, 
  Layers 
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./AnalyzePage.css";

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
  }, []);

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

  // Retrieve passed file metadata or construct a fallback for direct visits
  const file = location.state?.selectedFile || {
    name: "Resume_Sid_Kaushik.pdf",
    size: "142.8 KB",
    fileObject: null
  };

  const [fileUrl, setFileUrl] = useState(null);

  // Generate object URL for the raw fileObject if available
  useEffect(() => {
    if (file?.fileObject) {
      const url = URL.createObjectURL(file.fileObject);
      setFileUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  // Master State for all Animated Metric Numbers
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
    const targets = {
      overall: 92,
      formatting: 95,
      keywords: 90,
      readability: 91,
      structure: 93
    };

    const duration = 1600; // 1.6s duration
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
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
  }, []);

  // Semicircular Arc Dash Offset calculation
  // Total arc length of M 10 60 A 50 50 0 0 1 110 60 is exactly PI * r = 3.14159 * 50 = 157.08
  const arcLength = 157.08;
  const strokeDashoffset = arcLength - (arcLength * (scores.overall / 100));

  // Interactive Job Roles Selection
  const [selectedRoles, setSelectedRoles] = useState(new Set(["Frontend Developer"]));

  const toggleRoleSelection = (role) => {
    setSelectedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(role)) {
        newSet.delete(role);
      } else {
        newSet.add(role);
      }
      return newSet;
    });
  };

  // Keyword Match Visbility Tracker
  const [keywordSectionRef, isKeywordSectionVisible] = useIntersectionObserver();

  // Predefined keyword list
  const keywords = [
    { name: "React", value: 95 },
    { name: "JavaScript", value: 92 },
    { name: "CSS", value: 88 },
    { name: "Node.js", value: 84 },
    { name: "MongoDB", value: 81 },
    { name: "Express", value: 78 },
    { name: "Git", value: 90 },
    { name: "Problem Solving", value: 85 }
  ];

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
              <li>
                <div className="bullet-circle success">✓</div>
                <span>Strong professional summary outlining key areas of expertise.</span>
              </li>
              <li>
                <div className="bullet-circle success">✓</div>
                <span>Good technical skills listing targeting modern frontend frameworks.</span>
              </li>
              <li>
                <div className="bullet-circle success">✓</div>
                <span>Clean formatting, readable margins, and distinct sections.</span>
              </li>
              <li>
                <div className="bullet-circle success">✓</div>
                <span>Relevant projects included detailing stack and live URL integrations.</span>
              </li>
              <li>
                <div className="bullet-circle success">✓</div>
                <span>Well-structured education history containing degrees and scores.</span>
              </li>
            </ul>
          </AnimatedSection>
          <AnimatedSection className="obs-col shadow-card-block">
            <div className="card-block-header orange-theme">
              <AlertTriangle size={22} className="block-icon" />
              <h2>Problems Found</h2>
            </div>
            <ul className="observations-bullet-list">
              <li>
                <div className="bullet-circle warning">!</div>
                <span>Missing quantified achievements inside work history lines.</span>
              </li>
              <li>
                <div className="bullet-circle warning">!</div>
                <span>Generic experience descriptions lacking clear action words.</span>
              </li>
              <li>
                <div className="bullet-circle warning">!</div>
                <span>Skills could be better categorized to avoid scanning overload.</span>
              </li>
              <li>
                <div className="bullet-circle warning">!</div>
                <span>Limited ATS keywords matching targeted developer listings.</span>
              </li>
              <li>
                <div className="bullet-circle warning">!</div>
                <span>Projects lack measurable impact metrics (e.g. speed increase, scale).</span>
              </li>
            </ul>
          </AnimatedSection>
            <br/>
          <AnimatedSection className="obs-col shadow-card-block">
            <div className="card-block-header blue-theme">
              <Lightbulb size={22} className="block-icon" />
              <h2>Suggestions</h2>
            </div>
            <ul className="observations-bullet-list">
              <li>
                <div className="bullet-circle suggestion">ℹ</div>
                <span>Add measurable achievements using percentages and metric growth.</span>
              </li>
              <li>
                <div className="bullet-circle suggestion">ℹ</div>
                <span>Improve action verbs (e.g. designed, spearheaded, optimized).</span>
              </li>
              <li>
                <div className="bullet-circle suggestion">ℹ</div>
                <span>Increase keyword density of key libraries (e.g. state management).</span>
              </li>
              <li>
                <div className="bullet-circle suggestion">ℹ</div>
                <span>Tailor resume per application to match job descriptions.</span>
              </li>
              <li>
                <div className="bullet-circle suggestion">ℹ</div>
                <span>Expand project descriptions to details of scalability challenges.</span>
              </li>
              <li>
                <div className="bullet-circle suggestion">ℹ</div>
                <span>Add relevant certifications to bolster specialized credentials.</span>
              </li>
            </ul>
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
                  <span className="kw-value">{kw.value}%</span>
                </div>
                <div className="kw-progress-track">
                  <div
                    className="kw-progress-fill"
                    style={{
                      width: isKeywordSectionVisible ? `${kw.value}%` : "0%",
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

        {/* SECTION 4: Suitable Job Roles */}
        <AnimatedSection className="job-roles-section glass-panel">
          <div className="title-with-icon">
            <Briefcase size={24} className="section-hdr-icon" />
            <h2>Suitable Job Roles</h2>
          </div>
          <p className="section-subtitle-description">
            Our algorithm matched your profile against the following core titles. Click to select/highlight matching targets.
          </p>

          <div className="job-roles-grid">
            {[
              "Frontend Developer",
              "React Developer",
              "Full Stack Developer",
              "Web Developer",
              "Software Engineer Intern",
              "JavaScript Developer",
              "UI Developer"
            ].map((role) => {
              const isSelected = selectedRoles.has(role);
              return (
                <div
                  key={role}
                  className={`role-select-card ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleRoleSelection(role)}
                >
                  <div className="role-checkbox">
                    {isSelected && <Check size={12} className="check-svg" />}
                  </div>
                  <span className="role-card-text">{role}</span>
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* SECTION 5: Overall Recommendation */}
        <AnimatedSection className="recommendation-callout-card">
          <div className="recommendation-badge">
            <Award size={18} />
            <span>Overall Recommendation</span>
          </div>
          <p className="recommendation-description-paragraph">
            "This resume is well structured and ATS-friendly. Adding quantified achievements, stronger keywords, and more impactful project descriptions can further improve its chances of passing ATS filters and attracting recruiters."
          </p>
        </AnimatedSection>

        {/* SECTION 6: Bottom Actions */}
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
