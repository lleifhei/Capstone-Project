import React from "react";
import "./Navbar.css";
import { FaBars, FaSearch } from "react-icons/fa";

const Navbar = ({ token }) => {
  const navigateToLogin = () => {
    window.location.href = "/login";
  };
  
  const navigateToHome = () => {
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <button className="menu-button">
            <FaBars />
          </button>
        </div>
        <div className="navbar-center">
          <button onClick={navigateToHome} className="logo">Sound Judgment</button>
        </div>
        <div className="navbar-right">
          {token ? (
            <div>
              <a href="/profile">Profile</a>
            </div>
          ) : (
            <div>
              <a href="/login">Login</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
