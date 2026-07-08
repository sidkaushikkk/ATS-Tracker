import { Link } from "react-router-dom";import "./Navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <ul className="nav-links">

        <li>
         <a> Resume Analyzer </a>
        </li>

        <li>
        <Link to="/generate-resume">Generate Resume</Link>        </li>

        <li>
          <a href="/about-ats.html">ATS</a>
        </li>

      </ul>

      <div className="buttons">
        <button className="login">Login with personal account</button>
        <button className="signup">Login with college mail</button>
        <button className="register">Register</button>
      </div>

    </nav>
  );
}

export default Navbar;