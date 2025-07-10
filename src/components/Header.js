import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import '../styles/Global.css';

function Header() {
  return (
    <header className="header">
      <div className="header__logo">SHOP.CO</div>
      <nav className="header__nav">
        <Link to="/" className="header__link">Home</Link>
        <Link to="/women" className="header__link">Women</Link>
        <Link to="/men" className="header__link">Men</Link>
        <Link to="/kids" className="header__link">Kids</Link>
      </nav>
      <div className="header__search-container">
        <span className="header__search-icon"><FaSearch /></span>
        <input className="header__search" type="text" placeholder="Search for products..." />
      </div>
      <div className="header__icons">
        <span className="header__icon" title="Cart"><FaShoppingCart /></span>
        <span className="header__icon" title="Profile"><FaUser /></span>
      </div>
    </header>
  );
}

export default Header;
