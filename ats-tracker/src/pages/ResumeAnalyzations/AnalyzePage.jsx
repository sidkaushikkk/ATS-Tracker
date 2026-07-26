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
  Layers,
  Search,
  PenTool
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./AnalyzePage.css";

function getMatchTone(match) {
  if (match >= 90) return "excellent";
  if (match >= 80) return "strong";
  if (match >= 70) return "good";
  return "potential";
}

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
  const fileObject = selectedFile?.fileObject ?? location.state?.fileObject ?? null;
  const file = {
    name: selectedFile?.name ?? location.state?.fileName ?? "Resume.pdf",
    size: selectedFile?.size ?? "Unknown Size",
  };
  
  const analysisData = location.state?.analysisData;
  const [fileUrl, setFileUrl] = useState(null);

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

  useEffect(() => {
    if (!analysisData) {
      navigate("/upload-resume");
      return;
    }

    const sScores = analysisData.sectionScores || {};
    
    // AI or fallback scores
    const targets = {
      overall: analysisData.overallScore || 0,
      formatting: sScores.contact || Math.min(100, (analysisData.overallScore || 0) + 5),
      keywords: sScores.skills || Math.min(100, (analysisData.overallScore || 0) + 2),
      readability: sScores.atsReadability || Math.min(100, (analysisData.overallScore || 0) + 8),
      structure: sScores.experience || Math.min(100, (analysisData.overallScore || 0) + 3)
    };

    const duration = 1600;
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

  const arcLength = 157.08;
  const strokeDashoffset = arcLength - (arcLength * (scores.overall / 100));

  const [keywordSectionRef] = useIntersectionObserver();
  const [jobRolesSectionRef, isJobRolesSectionVisible] = useIntersectionObserver();

  if (!analysisData) return null;

  const isAI = analysisData.analysisSource === 'ai';
  const scoreTypeLabel = analysisData.analysisType === 'application_match' ? 'Application Match Score' : 'General Resume Quality Score';

  // AI lists
  const strengths = analysisData.strengths || [];
  const missingKeywords = analysisData.missingKeywords || [];
  const bulletRewrites = analysisData.bulletRewrites || [];
  
  // Fallback lists
  const observations = analysisData.keyObservations || [];
  const problems = analysisData.problems || [];
  const suggestions = analysisData.suggestions || [];
  
  // Shared lists
  const keywords = analysisData.matchedKeywords || [];
  const suitableJobRoles = analysisData.recommendedRoles || [];

  return (
    <div className="analyze-page-wrapper">
      <Navbar />

      <div className="analyze-container">
        
        {/* HERO SECTION */}
        <section className="analysis-hero-grid">
          
          <div className="document-viewer-card glass-panel">
            <div className="doc-viewer-header">
              <div className="doc-viewer-file-details">
                <div className="file-icon-badge">PDF</div>
                <div className="file-info-text">
                  <h3 className="file-display-name" title={file.name}>{file.name}</h3>
                  <span className="file-display-size">{file.size}</span>
                </div>
              </div>
            </div>

            <div className="doc-viewer-container">
              <div className={`moving-scan-line ${isAnalysisReady ? "is-analysis-ready" : ""}`}></div>
              <div className={`document-glow-overlay ${isAnalysisReady ? "is-analysis-ready" : ""}`}></div>

              {fileUrl ? (
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0`} className="pdf-iframe-viewer" title="Viewer" />
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="score-details-card glass-panel">
            <h2 className="score-panel-title">
              {isAI ? '✨ AI Analysis Results' : '⚙️ Fallback Analysis Results'}
            </h2>

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
                  
                  <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#eef2f6" strokeWidth="10" strokeLinecap="round" />
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

                <div className="gauge-text-overlay">
                  <span className="gauge-number-value">{scores.overall}</span>
                  <span className="gauge-total-divider">/ 100</span>
                </div>
              </div>

              <div className="score-labels-group">
                <h3 className="score-main-lbl">{scoreTypeLabel}</h3>
                <span className={`score-badge ${getMatchTone(scores.overall)}-badge`}>
                  {scores.overall >= 80 ? 'Excellent' : scores.overall >= 60 ? 'Good' : 'Needs Work'}
                </span>
              </div>
            </div>

            <div className="metric-cards-grid">
              <div className="mini-metric-card">
                <span className="mini-card-title">{isAI ? 'Contact Info' : 'Formatting'}</span>
                <div className="mini-card-score-row">
                  <span className="mini-card-num">{scores.formatting}%</span>
                  <span className="dot-indicator green"></span>
                </div>
              </div>
              <div className="mini-metric-card">
                <span className="mini-card-title">Skills</span>
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
                <span className="mini-card-title">Experience</span>
                <div className="mini-card-score-row">
                  <span className="mini-card-num">{scores.structure}%</span>
                  <span className="dot-indicator green"></span>
                </div>
              </div>
            </div>

            <div className="analysis-status-strip">
              <div className="status-badge-circle">
                <ShieldCheck size={20} className="status-checkmark" />
              </div>
              <div className="status-strip-text">
                <p className="status-bold-msg">Resume successfully analyzed.</p>
                <p className="status-sub-msg">Powered by {isAI ? 'Gemini 2.5 AI' : 'Rule-Based Engine'}.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: Insights & Problems */}
        <div className="analysis-details-grid">
          
          <AnimatedSection className="obs-col shadow-card-block">
            <div className="card-block-header green-theme">
              <CheckCircle size={22} className="block-icon" />
              <h2>{isAI ? 'Key Strengths' : 'Key Observations'}</h2>
            </div>
            <ul className="observations-bullet-list">
              {isAI ? strengths.map((str, i) => (
                <li key={i}>
                  <div className="bullet-circle success">✓</div>
                  <span><strong>{str.title}:</strong> {str.evidence}</span>
                </li>
              )) : observations.map((obs, i) => (
                <li key={i}>
                  <div className="bullet-circle success">✓</div>
                  <span>{obs}</span>
                </li>
              ))}
              {(isAI ? strengths.length === 0 : observations.length === 0) && <li><span>No specific observations found.</span></li>}
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
                  <span>
                    <strong>{prob.title || 'Observation'} ({prob.severity || 'medium'}):</strong> {prob.evidence || prob}
                    {prob.recommendation && <div><em>Fix: {prob.recommendation}</em></div>}
                  </span>
                </li>
              ))}
              {problems.length === 0 && <li><span>No major problems found!</span></li>}
            </ul>
          </AnimatedSection>

          {isAI ? (
            <AnimatedSection className="obs-col shadow-card-block">
              <div className="card-block-header purple-theme">
                <PenTool size={22} className="block-icon" />
                <h2>Bullet Rewrites</h2>
              </div>
              <ul className="observations-bullet-list">
                {bulletRewrites.map((rw, i) => (
                  <li key={i}>
                    <div className="bullet-circle suggestion">ℹ</div>
                    <div>
                      <div style={{ textDecoration: 'line-through', color: '#64748b' }}>{rw.original}</div>
                      <div style={{ color: '#16a34a', marginTop: '4px' }}>✨ {rw.suggested}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Reason: {rw.reason}</div>
                    </div>
                  </li>
                ))}
                {bulletRewrites.length === 0 && <li><span>No specific rewrites suggested.</span></li>}
              </ul>
            </AnimatedSection>
          ) : (
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
          )}

          <AnimatedSection className="obs-col shadow-card-block">
            <div className="card-block-header blue-theme">
              <Briefcase size={22} className="block-icon" />
              <h2>{isAI ? 'Gemini Suggested Roles' : 'Suitable Job Roles'}</h2>
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
                    <span className={`job-role-match-label ${matchTone}`}>{jobRole.reason || jobRole.level}</span>
                  </div>
                );
              })}
              {suitableJobRoles.length === 0 && <div>No roles suggested.</div>}
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
          </div>

          <div className="keyword-bars-grid" ref={keywordSectionRef}>
            {keywords.map((kw) => (
              <div key={kw.name} className="keyword-bar-item">
                <div className="kw-bar-labels">
                  <span className="kw-name">{kw.name}</span>
                </div>
              </div>
            ))}
          </div>

          {isAI && missingKeywords.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <div className="title-with-icon" style={{ marginBottom: '16px' }}>
                <Search size={24} className="section-hdr-icon" style={{ color: '#ef4444' }} />
                <h2 style={{ color: '#ef4444' }}>Missing Keywords</h2>
              </div>
              <div className="keyword-bars-grid">
                {missingKeywords.map((kw) => (
                  <div key={kw.name} className="keyword-bar-item" style={{ background: '#fef2f2', border: '1px solid #fee2e2' }}>
                    <div className="kw-bar-labels">
                      <span className="kw-name" style={{ color: '#b91c1c' }}>{kw.name}</span>
                      <span style={{ fontSize: '12px', color: '#dc2626' }}>{kw.importance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimatedSection>

        {/* SECTION 3: Resume Breakdown */}
        {isAI && analysisData.sectionScores && (
          <AnimatedSection className="breakdown-section glass-panel">
            <div className="title-with-icon">
              <Layers size={24} className="section-hdr-icon" />
              <h2>Detailed Breakdown</h2>
            </div>
            
            <div className="breakdown-cards-grid">
              {Object.entries(analysisData.sectionScores).map(([key, val]) => (
                <div className="breakdown-card" key={key}>
                  <span className="breakdown-card-num">{val} <span className="slash-ten">/ 100</span></span>
                  <span className="breakdown-card-label" style={{ textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="breakdown-meter">
                    <div className={`breakdown-fill ${val >= 80 ? 'green' : val >= 60 ? 'orange' : 'red'}`} style={{ width: `${val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* SECTION 4: Overall Recommendation */}
        <AnimatedSection className="recommendation-callout-card">
          <div className="recommendation-badge">
            <Award size={18} />
            <span>Overall Summary & Recommendation</span>
          </div>
          <p className="recommendation-description-paragraph">
            {analysisData.summary || "This resume has been analyzed using fallback metrics. Add more quantified achievements and relevant keywords to improve your score."}
          </p>
          {isAI && analysisData.disclaimer && (
            <p style={{ marginTop: '12px', fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
              {analysisData.disclaimer}
            </p>
          )}
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
