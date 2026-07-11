import "./HomeSections.css";

function WhyChoose() {
  const cards = [
    {
      emoji: "⚡",
      title: "Fast Analysis",
      desc: "Get your full ATS report in seconds, not minutes.",
    },
    {
      emoji: "🔒",
      title: "Secure Uploads",
      desc: "Your resume is never stored or shared with third parties.",
    },
    {
      emoji: "🤖",
      title: "AI Powered",
      desc: "Advanced AI models provide accurate, actionable feedback.",
    },
    {
      emoji: "📊",
      title: "Detailed Reports",
      desc: "Comprehensive breakdown of every section of your resume.",
    },
  ];

  return (
    <section className="hs-section hs-section-alt">
      <h2 className="hs-heading">Why Choose Our Resume Analyzer</h2>

      <div className="why-grid">
        {cards.map((card) => (
          <div className="why-card" key={card.title}>
            <div className="why-emoji">{card.emoji}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChoose;
