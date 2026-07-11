import "./HomeSections.css";

function ReportPreview() {
  const metrics = [
    { label: "Formatting", pct: 95 },
    { label: "Keywords",   pct: 82 },
    { label: "Skills",     pct: 90 },
    { label: "Grammar",    pct: 93 },
    { label: "Experience", pct: 88 },
  ];

  const suggestions = [
    "Add React keyword",
    "Quantify internship achievements",
    "Improve Professional Summary",
  ];

  return (
    <section className="hs-section hs-section-alt">
      <h2 className="hs-heading">Sample ATS Analysis</h2>
      <p className="hs-subtext">A preview of what your report looks like</p>

      <div className="report-wrapper">
        {/* Report Card */}
        <div className="report-card">
          <div className="report-overall">
            <div className="report-score-circle">
              <span>87/100</span>
            </div>
            <div className="report-overall-label">
              <p>Overall ATS Score</p>
              <strong>Great — Minor fixes needed</strong>
            </div>
          </div>

          <div className="report-metrics">
            {metrics.map((m) => (
              <div className="metric-row" key={m.label}>
                <span className="metric-label">{m.label}</span>
                <div className="metric-bar-bg">
                  <div
                    className="metric-bar-fill"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
                <span className="metric-pct">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions Card */}
        <div className="suggestions-card">
          <h3>💬 Suggested Improvements</h3>
          <ul>
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ReportPreview;
