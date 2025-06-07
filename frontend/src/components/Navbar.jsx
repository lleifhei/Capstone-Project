import React from "react";
import "./Navbar.css";
import { FaBars, FaSearch, FaIcons } from "react-icons/fa";

const Navbar = ({ token }) => {
  
  const navigateToHome = () => {
    window.location.href = "/";
  };

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
          {token ? (
            <div>
              <a href="/profile">Profile</a>
            </div>
          ) : (
            <div>
              <a href="/login">Log In</a>
              <a href="/register">Sign Up</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
