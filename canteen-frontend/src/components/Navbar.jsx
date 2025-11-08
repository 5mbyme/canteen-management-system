import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = ({ isAuthenticated, logout }) => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Tiwari's Canteen
          <span>Chase the flavours</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>

          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/cart" className="nav-link">
                  Cart ({cartItems.length})
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/signin" className="nav-link">Sign In</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
