import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock,  FaRedo } from "react-icons/fa";
import { useAuth } from "../../lib/AuthContext";
import "./EmailLoginModal.css";

export default function EmailLoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle countdown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/auth/email/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP.");
      
      setStep(2);
      setCooldown(60);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/auth/email/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP.");

      if (data.user) {
        login(data.user);
        onClose();
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div 
        className="email-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Login with Email"
      >
        <div className="email-modal-header">
          <div className="email-modal-icon">
            {step === 1 ? <FaEnvelope /> : <FaLock />}
          </div>
          <h2 className="email-modal-title">
            {step === 1 ? "Login with Gmail" : "Verify Your Email"}
          </h2>
          <p className="email-modal-subtitle">
            {step === 1 
              ? "Enter your email address to receive a secure login code." 
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {error && <div className="email-modal-error">{error}</div>}

        {step === 1 ? (
          <form className="email-modal-form" onSubmit={handleSendOtp}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <button 
              type="submit" 
              className="email-submit-btn"
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="email-modal-form" onSubmit={handleVerifyOtp}>
            <div className="input-group">
              <label>6-Digit Code</label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
                required
              />
            </div>
            <button 
              type="submit" 
              className="email-submit-btn"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify and Login"}
            </button>

            <div className="email-modal-footer">
              <button 
                type="button"
                className="resend-btn"
                disabled={cooldown > 0 || isLoading}
                onClick={handleSendOtp}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : <><FaRedo /> Resend Code</>}
              </button>
              <button 
                type="button" 
                className="change-email-btn"
                onClick={() => { setStep(1); setOtp(""); setError(null); }}
              >
                Change Email
              </button>
            </div>
            <p className="email-expiry-text">Code expires in 10 minutes.</p>
          </form>
        )}
      </div>
    </div>
  );
}
