import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Box.css";

function Box(){
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

    return (
        <div className="Box">
            <div className="content">
                <h2>
                    <span className="line line1">Does your 
                        <span className="highlight"> RESUME</span>  really</span>
                    <span className="line line2">stand out ?</span>
                </h2>           

                <br/>

                <p>Over <span className="p-highlight">75% of resumes</span> are filtered out by <span className="p-highlight">Applicant Tracking Systems</span> before reaching a recruiter.
                     Find out how your resume performs—and how to improve it.</p>

                <div className="box-buttons">

                    <button className="genAnalysis-button" onClick={() => navigate("/upload-resume")}>Generate Analysis </button>
                    <a href = "/about-ats.html"><button className="abtATS-button">About ATS</button></a>

                </div>

                <br/>
                <br/>
              <div className = "generate-resume">
                  <p>Don't have a resume ? <button className="genResume-button" onClick={() => navigate("/generate-resume")}>Generate Resume</button></p>  
                </div>
            </div>

            <div className="image">
                <div className="ats-animation-container">
                    {/* Background particles */}
                    <div className="particle p-1"></div>
                    <div className="particle p-2"></div>
                    <div className="particle p-3"></div>
                    <div className="particle p-4"></div>
                    <div className="particle p-5"></div>

                    {/* Floating keywords */}
                    <div className="keyword kw-1">React</div>
                    <div className="keyword kw-2">JavaScript</div>
                    <div className="keyword kw-3">HTML</div>
                    <div className="keyword kw-4">CSS</div>
                    <div className="keyword kw-5">Node.js</div>
                    <div className="keyword kw-6">MongoDB</div>
                    <div className="keyword kw-7">Git</div>
                    <div className="keyword kw-8">Problem Solving</div>

                    {/* Main illustration contents */}
                    <div className="animation-content">
                        {/* Resume/Document Card */}
                        <div className="resume-card">
                            <div className="resume-glow"></div>
                            <div className="scanning-beam"></div>

                            <div className="resume-header">
                                <div className="resume-avatar"></div>
                                <div className="resume-title-bars">
                                    <div className="bar bar-title"></div>
                                    <div className="bar bar-subtitle"></div>
                                </div>
                            </div>

                            <div className="resume-sections">
                                <div className="resume-section sec-name">
                                    <div className="section-header">
                                        <span className="section-label">Applicant Info</span>
                                        <span className="checkmark">✓</span>
                                    </div>
                                    <div className="bar bar-sec"></div>
                                </div>

                                <div className="resume-section sec-experience">
                                    <div className="section-header">
                                        <span className="section-label">Work Experience</span>
                                        <span className="checkmark">✓</span>
                                    </div>
                                    <div className="bar bar-sec"></div>
                                    <div className="bar bar-sec short"></div>
                                </div>

                                <div className="resume-section sec-skills">
                                    <div className="section-header">
                                        <span className="section-label">Core Skills</span>
                                        <span className="checkmark">✓</span>
                                    </div>
                                    <div className="bar bar-sec"></div>
                                </div>

                                <div className="resume-section sec-education">
                                    <div className="section-header">
                                        <span className="section-label">Education</span>
                                        <span className="checkmark">✓</span>
                                    </div>
                                    <div className="bar bar-sec short"></div>
                                </div>
                            </div>
                        </div>

                        {/* Score Meter Card */}
                        <div className="score-meter-card">
                            <div className="score-title">ATS SCORE</div>
                            <div className="circle-container">
                                <svg viewBox="0 0 100 100" className="score-svg">
                                    <circle cx="50" cy="50" r="40" className="score-bg-circle" />
                                    <circle cx="50" cy="50" r="40" className="score-progress-circle" />
                                </svg>
                                <div className="score-number-display">
                                    <span className="score-value">{score}</span>
                                    <span className="score-percent">%</span>
                                </div>
                            </div>
                            <div className="score-status">
                                {score === 0 ? "Ready" : score < 92 ? "Scanning..." : "Optimized!"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Box;
