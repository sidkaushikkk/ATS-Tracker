import "./HomeSections.css";

function ATSReasons() {
  const reasons = [
    {
      icon: "🖼️",
      title: "Images & Tables",
      desc: "ATS cannot parse images or tables — they cause data to be skipped entirely.",
    },
    {
      icon: "🖋️",
      title: "Fancy Fonts",
      desc: "Decorative or uncommon fonts confuse parsers and break text extraction.",
    },
    {
      icon: "🔍",
      title: "Missing Keywords",
      desc: "Resumes lacking job-specific keywords are filtered out automatically.",
    },
    {
      icon: "📉",
      title: "Weak Experience Descriptions",
      desc: "Vague bullet points without metrics fail to match ATS scoring criteria.",
    },
    {
      icon: "📋",
      title: "Wrong Section Headings",
      desc: "Non-standard headings like 'My Journey' confuse ATS category detection.",
    },
    {
      icon: "📄",
      title: "Poor Formatting",
      desc: "Complex layouts, multiple columns, and headers/footers break ATS parsing.",
    },
  ];

  return (
    <section className="hs-section hs-section-dark">
      <h2 className="hs-heading">Common Reasons ATS Rejects Resumes</h2>

      <div className="reasons-list">
        {reasons.map((r) => (
          <div className="reason-row" key={r.title}>
            <span className="reason-icon">{r.icon}</span>
            <span className="reason-title">{r.title}</span>
            <span className="reason-desc">{r.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ATSReasons;
