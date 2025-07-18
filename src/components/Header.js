import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars } from 'react-icons/fa';
import { Drawer, Menu } from 'antd';
import '../styles/Global.css';

function Header() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <header className="header">
      {/* Hamburger and Logo for mobile */}
      <div className="header__mobile-left">
        <span className="header__hamburger" onClick={showDrawer}>
          <FaBars />
        </span>
        <div className="header__logo">SHOP.CO</div>
      </div>
      {/* Center section for desktop/tablet */}
      <div className="header__center">
      <div className="header__logo">SHOP.CO</div>
      <nav className="header__nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Home</NavLink>
        <NavLink to="/women" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Women</NavLink>
        <NavLink to="/men" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Men</NavLink>
        <NavLink to="/kids" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Kids</NavLink>
          <NavLink to="/all-products" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>All Products</NavLink>
      </nav>
      <div className="header__search-container">
        <span className="header__search-icon"><FaSearch /></span>
        <input className="header__search" type="text" placeholder="Search for products..." />
      </div>
      </div>
      {/* Icons on the right */}
      <div className="header__icons">
        <span className="header__icon header__icon--search"><FaSearch /></span>
        <Link to="/cart" className="header__icon" title="Cart"><FaShoppingCart color="#111" /></Link>
        <Link to="/login" className="header__icon" title="Profile"><FaUser color="#111" /></Link>
      </div>
      {/* Drawer for mobile menu */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu mode="vertical" onClick={closeDrawer}>
          <Menu.Item key="home">
            <NavLink to="/" end className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Home</NavLink>
          </Menu.Item>
          <Menu.Item key="women">
            <NavLink to="/women" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Women</NavLink>
          </Menu.Item>
          <Menu.Item key="men">
            <NavLink to="/men" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Men</NavLink>
          </Menu.Item>
          <Menu.Item key="kids">
            <NavLink to="/kids" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Kids</NavLink>
          </Menu.Item>
          <Menu.Item key="all-products">
            <NavLink to="/all-products" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>All Products</NavLink>
          </Menu.Item>
        </Menu>
      </Drawer>
    </header>
  );
}

export default Header;
