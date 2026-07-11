import "./HomeSections.css";

function Features() {
  const cards = [
    {
      emoji: "🎯",
      title: "ATS Compatibility Score",
      desc: "Get an instant score showing how well your resume passes ATS filters.",
    },
    {
      emoji: "🔑",
      title: "Keyword Matching",
      desc: "Identifies missing keywords from the job description automatically.",
    },
    {
      emoji: "📐",
      title: "Resume Formatting Check",
      desc: "Detects formatting issues that confuse ATS parsers.",
    },
    {
      emoji: "🧩",
      title: "Missing Skills Detection",
      desc: "Highlights key skills absent from your resume based on your target role.",
    },
    {
      emoji: "✏️",
      title: "Grammar Analysis",
      desc: "Catches grammar mistakes and weak phrasing that hurt your chances.",
    },
    {
      emoji: "💡",
      title: "AI Resume Suggestions",
      desc: "Receive actionable AI-powered tips to improve every section.",
    },
  ];

  return (
    <section className="hs-section hs-section-alt">
      <h2 className="hs-heading">Features</h2>

      <div className="feat-grid">
        {cards.map((card) => (
          <div className="feat-card" key={card.title}>
            <div className="feat-emoji">{card.emoji}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
