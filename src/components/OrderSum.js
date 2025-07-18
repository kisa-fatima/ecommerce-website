import React from 'react';
import '../styles/OrderSum.css';

const OrderSum = () => {
  const subtotal = 565;
  const discount = 113;
  const delivery = 15;
  const total = subtotal - discount + delivery;

  return (
    <div className="order-summary-box">
      <h2 className="order-summary-title">Order Summary</h2>
      <div className="order-summary-row">
        <span>Subtotal</span>
        <span className="order-summary-value">${subtotal}</span>
      </div>
      <div className="order-summary-row">
        <span>Discount (-20%)</span>
        <span className="order-summary-discount">-${discount}</span>
      </div>
      <div className="order-summary-row">
        <span>Delivery Fee</span>
        <span className="order-summary-value">${delivery}</span>
      </div>
      <div className="order-summary-row order-summary-total">
        <span>Total</span>
        <span className="order-summary-total-value">${total}</span>
      </div>
      <div className="order-summary-promo-row">
        <input className="order-summary-promo-input" placeholder="Add promo code" disabled />
        <button className="order-summary-promo-btn" disabled>Apply</button>
      </div>
      <button className="order-summary-checkout-btn">Go to Checkout <span className="arrow">→</span></button>
    </div>
  );
};

export default OrderSum; 