import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import "./Navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
        closeMenu();
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="logo" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Content Wrapper */}
        <div className={`nav-content-wrapper ${isMenuOpen ? "is-open" : ""}`}>
          <div className="nav-button">
            <ul className="nav-links">
              <li>
                <Link to="/upload-resume" onClick={closeMenu}>
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/generate-resume" onClick={closeMenu}>
                  Generate Resume
                </Link>
              </li>
              <li>
                <a href="/about-ats.html" onClick={closeMenu}>
                  ATS
                </a>
              </li>
            </ul>
          </div>

          <div className="buttons">
            {user ? (
              <>
                <button
                  className="login-personal"
                  onClick={() => {
                    navigate("/dashboard");
                    closeMenu();
                  }}
                >
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
                    shape="rectangular"
                    width="220"
                    locale="en"
                    logo_alignment="left"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;