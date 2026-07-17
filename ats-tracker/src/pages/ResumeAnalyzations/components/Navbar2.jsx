import "./Navbar2.css";
import logo from "../../../assets/logo.png";
// import { Link } from "react-router-dom";


export default function Navbar2(){

    return (
    <nav className="navbar">

      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
    <div>
        <button className="gen-resume">Generate Resume</button>
        <button className="logout">Logout</button>
    </div>
    </nav>
    )
}