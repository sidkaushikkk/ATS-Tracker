import "./HomeSections.css";
import { Link } from "react-router-dom";

function FinalCTA() {
  return (
    <section className="cta-section">
      <h2>Ready to Improve Your Resume?</h2>
      <p>
        Upload your resume and receive detailed ATS feedback within seconds.
      </p>
      <button className="cta-btn"><Link to="/upload-resume">Analyze Resume</Link>       
</button>
    </section>
  );
}

export default FinalCTA;
