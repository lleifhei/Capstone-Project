import React from "react";
import { useState } from "react";
import "./Navbar.css";
import { FaBars, FaSearch, FaIcons } from "react-icons/fa";

const Navbar = ({ token }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <form className="search-form" onSubmit={handleSearch}>
              <button type="submit" className="search-button">
                    <FaSearch />
              </button>
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </form>
        </div>
        <div className="navbar-center">

          <a href="/">Sound Judgment</a>
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
