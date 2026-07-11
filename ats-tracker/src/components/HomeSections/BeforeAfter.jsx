import "./HomeSections.css";

function BeforeAfter() {
  return (
    <section className="hs-section">
      <h2 className="hs-heading">Before vs After Optimization</h2>

      <div className="ba-wrapper">
        {/* Before */}
        <div className="ba-card before">
          <h3>Before</h3>
          <div className="ba-score">❌ ATS Score 48</div>
          <ul className="ba-points">
            <li>📝 Weak Summary</li>
            <li>🔍 Missing Keywords</li>
            <li>📄 Poor Formatting</li>
          </ul>
        </div>

        {/* After */}
        <div className="ba-card after">
          <h3>After</h3>
          <div className="ba-score">✅ ATS Score 92</div>
          <ul className="ba-points">
            <li>💼 Strong Summary</li>
            <li>🔑 Optimized Keywords</li>
            <li>📐 ATS Friendly Layout</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default BeforeAfter;
