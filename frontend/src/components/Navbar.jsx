import React from "react";
import "./Navbar.css";
import { FaBars, FaSearch } from "react-icons/fa";

const Navbar = () => {
  const navigateToLogin = () => {
    window.location.href = "/login";
  };
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
          <h1 className="logo">Sound Judgment</h1>
        </div>
        <div className="navbar-right">
          <button onClick={navigateToLogin}>MY PROFILE/LOGIN</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
