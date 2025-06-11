import React from "react";
import { useState } from "react";
import "./Navbar.css";
import { FaBars, FaSearch, FaIcons } from "react-icons/fa";
import { Link } from "react-router-dom";

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
              <Link to={`/search?q=${encodeURIComponent(searchQuery)}`} className="search-button">
                    <FaSearch />
              </Link>
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
          <Link to="/">Sound Judgment</Link>
        </div>
        <div className="navbar-right">
          {token ? (
            <div>
              <Link to="/profile">Profile</Link>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
