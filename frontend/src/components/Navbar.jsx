import './Navbar.css';
import { FaBars, FaSearch } from 'react-icons/fa';

const Navbar = ({ token }) => {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <FaSearch className="icon" />
        </div>

        <div className="navbar-center">
          <h1 className="logo">Change Title</h1>
        </div>

        <div className="navbar-right">
        {token ? (
            <div>
              <a href="/profile">Profile</a>
            </div>
        ) : (
          <div>
            <a href="/login">Log In</a>
            <a href="/register">Sign In</a>
        </div>
        )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
