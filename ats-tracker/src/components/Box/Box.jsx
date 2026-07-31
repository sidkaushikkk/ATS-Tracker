import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Box.css";

function Box() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) % 8000;

            if (elapsed < 1000) {
                setScore(0);
            } else if (elapsed < 5000) {
                // Linear or eased progress from 1s to 5s (4000ms duration)
                const pct = (elapsed - 1000) / 4000;
                // Ease out quadratic for natural counter feel
                const easedPct = 1 - (1 - pct) * (1 - pct);
                setScore(Math.round(easedPct * 92));
            } else if (elapsed < 7000) {
                setScore(92);
            } else {
                // Resetting back down to 0
                const pct = (elapsed - 7000) / 1000;
                setScore(Math.max(0, Math.round((1 - pct) * 92)));
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Radial Gauge SVG Calculations
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * score) / 100;

    return (
        <section className="Box">
            {/* Ambient Background Glows */}
            <div className="hero-ambient-glow glow-1"></div>
            <div className="hero-ambient-glow glow-2"></div>

            <div className="content">
                {/* <div className="hero-badge">
                    <span className="badge-dot"></span>
                    <span>AI-Powered ATS Resume Tracker</span>
                </div> */}

                <h2>
                    <span className="line line1">Does your <span className="highlight">RESUME</span> really</span>
                    <span className="line line2">stand out?</span>
                </h2>

                <p>
                    Over <span className="p-highlight">75% of resumes</span> are filtered out by <span className="p-highlight">Applicant Tracking Systems</span> before reaching a recruiter. Find out how your resume performs—and how to improve it.
                </p>

                <div className="box-buttons">
                    <button className="genAnalysis-button" onClick={() => navigate("/upload-resume")}>
                        Generate Analysis
                        <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <a href="/about-ats.html">
                        <button className="abtATS-button">About ATS</button>
                    </a>
                </div>

                <div className="generate-resume">
                    <p>
                        Don't have a resume?{" "}
                        <button className="genResume-button" onClick={() => navigate("/generate-resume")}>
                            Generate Resume
                        </button>
                    </p>
                </div>
            </div>

            <div className="image">
                <div className="ats-dashboard-wrapper">
                    {/* Floating Glass Card 1 (Top Right) - Desktop Only */}
                    <div className="floating-card float-card-1">
                        <div className="float-card-icon badge-green">↑</div>
                        <div className="float-card-text">
                            <span className="float-val">+18% Match</span>
                            <span className="float-lbl">Targeting Senior Roles</span>
                        </div>
                    </div>

                    {/* Floating Glass Card 2 (Bottom Left) - Desktop Only */}
                    <div className="floating-card float-card-2">
                        <div className="float-card-icon badge-blue">✓</div>
                        <div className="float-card-text">
                            <span className="float-val">24/24 Passed</span>
                            <span className="float-lbl">ATS Parsing Rules</span>
                        </div>
                    </div>

                    {/* Main Dashboard Panel */}
                    <div className="dashboard-main-card">
                        {/* Header Bar */}
                        <div className="dash-header">
                            <div className="dash-dots">
                                <span className="dot dot-red"></span>
                                <span className="dot dot-yellow"></span>
                                <span className="dot dot-green"></span>
                            </div>
                            <div className="dash-status-badge">
                                <span className="status-live-dot"></span>
                                Live ATS Scan
                            </div>
                        </div>

                        {/* Top Grid: Resume Preview & ATS Score */}
                        <div className="dash-grid-top">
                            {/* Resume Preview Panel */}
                            <div className="resume-preview-panel">
                                <div className="scanning-beam"></div>
                                <div className="preview-header">
                                    <div className="preview-avatar">AM</div>
                                    <div className="preview-info">
                                        <div className="preview-name">Alex Morgan</div>
                                        <div className="preview-role">Software Engineer</div>
                                    </div>
                                </div>
                                <div className="preview-sections">
                                    <div className="preview-sec sec-pass">
                                        <span>Experience</span>
                                        <span className="check-icon">✓</span>
                                    </div>
                                    <div className="preview-sec sec-pass">
                                        <span>Core Skills</span>
                                        <span className="check-icon">✓</span>
                                    </div>
                                    <div className="preview-sec sec-pass">
                                        <span>Education</span>
                                        <span className="check-icon">✓</span>
                                    </div>
                                </div>
                            </div>

                            {/* Score Gauge & Strength */}
                            <div className="score-panel">
                                <div className="score-gauge-box">
                                    <svg className="score-svg-gauge" viewBox="0 0 80 80">
                                        <circle className="gauge-bg" cx="40" cy="40" r={radius} />
                                        <circle
                                            className="gauge-fill"
                                            cx="40"
                                            cy="40"
                                            r={radius}
                                            style={{
                                                strokeDasharray: circumference,
                                                strokeDashoffset: strokeDashoffset
                                            }}
                                        />
                                    </svg>
                                    <div className="score-center-val">
                                        <span className="val-number">{score}</span>
                                        <span className="val-symbol">%</span>
                                    </div>
                                </div>

                                <div className="score-meta">
                                    <div className="score-status-text">
                                        {score === 0 ? "Ready" : score < 92 ? "Scanning..." : "Optimized!"}
                                    </div>
                                    <div className="strength-meter">
                                        <div className="strength-label">
                                            <span>Resume Strength</span>
                                            <span className="strength-val">Top 8%</span>
                                        </div>
                                        <div className="strength-bar-bg">
                                            <div className="strength-bar-fill" style={{ width: `${score}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Keywords Row */}
                        <div className="keywords-panel">
                            <div className="kw-group">
                                <span className="kw-label green-lbl">Matched Keywords</span>
                                <div className="kw-tags">
                                    <span className="kw-tag tag-matched">React</span>
                                    <span className="kw-tag tag-matched">Node.js</span>
                                    <span className="kw-tag tag-matched">JavaScript</span>
                                    <span className="kw-tag tag-matched">REST APIs</span>
                                </div>
                            </div>
                            <div className="kw-group">
                                <span className="kw-label coral-lbl">Missing Keywords</span>
                                <div className="kw-tags">
                                    <span className="kw-tag tag-missing">+ AWS</span>
                                    <span className="kw-tag tag-missing">+ Docker</span>
                                    <span className="kw-tag tag-missing">+ GraphQL</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Suggestions Card */}
                        <div className="ai-suggestion-box">
                            <div className="ai-suggest-icon">💡</div>
                            <div className="ai-suggest-content">
                                <span className="ai-suggest-title">AI Suggestion</span>
                                <p className="ai-suggest-text">Add 3 action metrics to experience to boost score by +14%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Box;
