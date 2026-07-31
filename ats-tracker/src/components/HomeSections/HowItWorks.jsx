import "./HomeSections.css";

function HowItWorks() {
  const steps = [
    {
      emoji: "📄",
      title: "Upload Resume",
      desc: "Upload your resume in PDF or DOCX format.",
    },
    {
      emoji: "🤖",
      title: "AI & ATS Analysis",
      desc: "Our ATS engine checks formatting, keywords and readability.",
    },
    {
      emoji: "📈",
      title: "Get Detailed Report",
      desc: "Receive your ATS score and improvement suggestions.",
    },
  ];

  return (
    <section className="hs-section hs-section-first hs-section-hiw">
      <h2 className="hs-heading">How It Works</h2>

      <div className="hiw-steps">
        {steps.map((step) => (
          <>
            <div className="hiw-card" key={step.title}>
              <div className="hiw-emoji">{step.emoji}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
