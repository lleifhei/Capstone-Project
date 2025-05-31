import './Navbar.css';
import { FaBars, FaSearch } from 'react-icons/fa';

const Navbar = () => {
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
          <a href="#">LOG IN</a>
          <a href="#">SIGN IN</a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
