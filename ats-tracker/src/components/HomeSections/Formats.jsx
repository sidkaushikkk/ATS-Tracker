import "./HomeSections.css";

function Formats() {
  const formats = ["PDF", "DOCX", "TXT"];
  const badges  = ["Instant Analysis", "Fast Upload", "Secure Processing"];

  return (
    <section className="hs-section">
      <h2 className="hs-heading">Supported Resume Formats</h2>

      <div className="formats-boxes">
        {formats.map((fmt) => (
          <div className="fmt-box" key={fmt}>{fmt}</div>
        ))}
      </div>

      <div className="formats-badges">
        {badges.map((b) => (
          <span className="fmt-badge" key={b}>{b}</span>
        ))}
      </div>
    </section>
  );
}

export default Formats;
