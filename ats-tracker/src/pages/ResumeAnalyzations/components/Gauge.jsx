import { useEffect, useState } from "react";
import "./Gauge.css";

export default function Gauge() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;

    const timer = setInterval(() => {
      current++;

      if (current >= 92) {
        current = 92;
        clearInterval(timer);
      }

      setProgress(current);
    }, 20);

    return () => clearInterval(timer);
  }, []);

  const radius = 90;
  const circumference = Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="gauge">
      <svg width="220" height="120" viewBox="0 0 220 120">
        {/* Background */}
        <path
          d="M20 110 A90 90 0 0 1 200 110"
          className="track"
        />

        {/* Progress */}
        <path
          d="M20 110 A90 90 0 0 1 200 110"
          className="progress"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>

      <div className="score">
        <h1>{progress}</h1>
        <span>/100</span>
      </div>
    </div>
  );
}