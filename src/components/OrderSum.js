import React from 'react';
import '../styles/OrderSum.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderSum = () => {
  const cart = useSelector(state => state.cart.items);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 15;
  const total = subtotal + delivery;
  const navigate = useNavigate();
  const isCartEmpty = cart.length === 0;

  return (
    <div className="order-summary-box">
      <h2 className="order-summary-title">Order Summary</h2>
      <div className="order-summary-row">
        <span>Subtotal</span>
        <span className="order-summary-value">${subtotal}</span>
      </div>
      <div className="order-summary-row">
        <span>Delivery Fee</span>
        <span className="order-summary-value">${delivery}</span>
      </div>
      <div className="order-summary-row order-summary-total">
        <span>Total</span>
        <span className="order-summary-total-value">${total}</span>
      </div>
      <button 
        className="order-summary-checkout-btn"
        onClick={() => navigate('/checkout')}
        disabled={isCartEmpty}
        style={isCartEmpty ? { background: '#bbb', color: '#fff', cursor: 'not-allowed' } : {}}
      >
        Go to Checkout <span className="arrow">→</span>
      </button>
      <button className="order-summary-continue-btn" onClick={() => navigate('/')}>Continue Shopping</button>
    </div>
  );
};

export default OrderSum; 