import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars } from 'react-icons/fa';
import { Drawer, Menu } from 'antd';
import '../styles/Global.css';
import ProfileDropdown from './ProfileDropdown';
import { useSelector } from 'react-redux';
import { getAllProducts } from '../services/databaseFunctions';

function Header() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in by looking for userName in localStorage
  const userName = localStorage.getItem('userName');
  const isLoggedIn = !!userName;
  const cart = useSelector(state => state.cart.items);
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  useEffect(() => {
    getAllProducts().then(setAllProducts);
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const results = allProducts.filter(p =>
      p.name && p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    setSearchResults(results.slice(0, 8));
    setShowDropdown(results.length > 0);
  }, [search, allProducts]);

  // Hide dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  const handleSearchChange = e => {
    setSearch(e.target.value);
  };

  const handleResultClick = product => {
    setSearch('');
    setShowDropdown(false);
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    }
  };

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
      <form className="header__search-container" onSubmit={handleSearchSubmit} style={{ position: 'relative' }} autoComplete="off">
        <span className="header__search-icon"><FaSearch /></span>
        <input
          className="header__search"
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={handleSearchChange}
          ref={searchInputRef}
          onFocus={() => search.trim() && setShowDropdown(true)}
        />
        {showDropdown && (
          <div
            className="header-search-dropdown"
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: 38,
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              zIndex: 1000,
              maxHeight: 340,
              overflowY: 'auto',
              padding: 0,
            }}
          >
            {searchResults.map(product => (
              <div
                key={product.id}
                className="header-search-result"
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f3f3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
                onClick={() => handleResultClick(product)}
              >
                <img src={product.thumbnail || product.image1 || product.image2} alt={product.name} style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 6, background: '#f7f7f7' }} />
                <span style={{ fontWeight: 500, fontSize: 15 }}>{product.name}</span>
                <span style={{ marginLeft: 'auto', color: '#888', fontWeight: 600, fontSize: 15 }}>${product.price}</span>
              </div>
            ))}
            {searchResults.length === 0 && (
              <div style={{ padding: 16, color: '#888', textAlign: 'center' }}>No products found.</div>
            )}
          </div>
        )}
      </form>
      </div>
      {/* Icons on the right */}
      <div className="header__icons">
        <span className="header__icon header__icon--search"><FaSearch /></span>
        <Link to="/cart" className="header__icon" title="Cart" style={{ position: 'relative' }}>
          <FaShoppingCart color="#111" />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -8,
              background: '#ff3b3b',
              color: '#fff',
              borderRadius: '50%',
              fontSize: 12,
              minWidth: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              padding: '0 5px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
            }}>{cartCount}</span>
          )}
        </Link>
        {isLoggedIn ? (
          <ProfileDropdown userName={userName} />
        ) : (
          <Link to="/login" className="header__icon" title="Profile"><FaUser color="#111" /></Link>
        )}
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
