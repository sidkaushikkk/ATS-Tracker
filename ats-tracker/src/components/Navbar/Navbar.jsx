import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../lib/AuthContext";
import EmailLoginModal from "./EmailLoginModal";
import "./Navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.user) {
        login(data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className="nav-button">
      <ul className="nav-links">
        <li>
          <Link to="/upload-resume">Resume Analyzer</Link>
        </li>
        <li>
          <Link to="/generate-resume">Generate Resume</Link>       
        </li>
        <li>
          <a href="/about-ats.html">ATS</a>
        </li>
      </ul>
      </div>
      <div className="buttons">
        {user ? (
          <>
            <button className="login-personal" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
            <button className="register" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="auth-buttons-wrapper">
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.error("Login failed from Google button")}
                theme="outline"
                size="large"
                text="signin_with"
                shape="pill"
                width="220"
              />
            </div>
          </div>
        )}
      </div>
      <EmailLoginModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    </nav>
  );
}

export default Navbar;