import "./Navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <ul className="nav-links">

        <li>
          Resume Analyzer
        </li>

        <li>
          Generate Resume
        </li>

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