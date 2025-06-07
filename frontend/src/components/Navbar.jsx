import React from "react";
import "./Navbar.css";
import { FaBars, FaSearch, FaIcons } from "react-icons/fa";

const Navbar = ({ token }) => {
  
  const navigateToHome = () => {
    window.location.href = "/";
  }
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <button onClick={navigateToHome} className="menu-button">
            <FaBars className="Home"/>
          </button>
        </div>
        <div className="navbar-center">
          <button onClick={navigateToHome} className="logo">
          Sound Judgment
          </button>
        </div>
        <div className="navbar-right">
          <button onClick={navigateToLogin}>MY PROFILE/LOGIN</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
