import React from "react";
import "./Navbar.css";
import { FaBars, FaSearch } from "react-icons/fa";

const Navbar = ({ token }) => {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <button className="menu-button">
            <FaBars />
          </button>
        </div>
        <div className="navbar-center">
          <a href="/">Sound Judgement</a>
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
