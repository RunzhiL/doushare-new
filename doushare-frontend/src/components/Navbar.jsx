import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from "./NotificationBell";
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/my-borrows" className="navbar-link">My Borrows</Link>
          <Link to="/my-items" className="navbar-link">My Items</Link>
          <Link to="/add-item" className="navbar-link">Add Item</Link>
          <Link to="/approve-requests" className="navbar-link">Requests</Link>
        </div>

        <div className="navbar-right">
          <NotificationBell />
          <Link to="/profile" className="navbar-link">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
