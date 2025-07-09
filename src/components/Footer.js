import React from 'react';
import '../styles/Global.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="footer-newsletter-text">
          <h2>STAY UPTO DATE ABOUT<br/>OUR LATEST OFFERS</h2>
        </div>
        <form className="footer-newsletter-form">
          <input type="email" placeholder="Enter your email address" className="footer-input" />
          <button type="submit" className="footer-btn">Subscribe to Newsletter</button>
        </form>
      </div>
      <div className="footer-main">
        <div className="footer-brand">
          <h3>SHOP.CO</h3>
          <p>We have clothes that suits your style and which you’re proud to wear. From women to men.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest-p"></i></a>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <h4>COMPANY</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Works</a></li>
              <li><a href="#">Career</a></li>
            </ul>
          </div>
          <div>
            <h4>HELP</h4>
            <ul>
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Delivery Details</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4>FAQ</h4>
            <ul>
              <li><a href="#">Account</a></li>
              <li><a href="#">Manage Deliveries</a></li>
              <li><a href="#">Orders</a></li>
              <li><a href="#">Payments</a></li>
            </ul>
          </div>
          <div>
            <h4>RESOURCES</h4>
            <ul>
              <li><a href="#">Free eBooks</a></li>
              <li><a href="#">Development Tutorial</a></li>
              <li><a href="#">How to - Blog</a></li>
              <li><a href="#">Youtube Playlist</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Shop.co © 2000-2023, All Rights Reserved</span>
        <div className="footer-payments">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Mastercard-logo.svg" alt="Mastercard" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Apple_Pay_logo.svg" alt="Apple Pay" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Google_Pay_Logo.svg" alt="Google Pay" /> 
        </div>
      </div>
    </footer>
  );
};

export default Footer; 