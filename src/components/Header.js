import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      </div>
      {/* Icons on the right */}
      <div className="header__icons">
        <span className="header__icon header__icon--search"><FaSearch /></span>
        <span className="header__icon" title="Cart"><FaShoppingCart /></span>
        <span className="header__icon" title="Profile"><FaUser /></span>
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
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="women">
            <Link to="/women">Women</Link>
          </Menu.Item>
          <Menu.Item key="men">
            <Link to="/men">Men</Link>
          </Menu.Item>
          <Menu.Item key="kids">
            <Link to="/kids">Kids</Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    </header>
  );
}

export default Header;
