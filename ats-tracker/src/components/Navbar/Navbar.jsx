import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>

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
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;