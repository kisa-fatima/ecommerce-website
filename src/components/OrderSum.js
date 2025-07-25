import React from 'react';
import '../styles/OrderSum.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const OrderSum = ({ showCheckoutBtn = true }) => {
  const cart = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 15;
  const total = subtotal + delivery;
  const navigate = useNavigate();
  const isCartEmpty = cart.length === 0;

  const handleCheckoutClick = () => {
    if (!user) {
      toast.error('You must be logged in to checkout.', { position: 'top-right' });
      return;
    }
    navigate('/checkout');
  };

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
      {showCheckoutBtn && (
        <button 
          className="order-summary-checkout-btn"
          onClick={handleCheckoutClick}
          disabled={isCartEmpty}
          style={isCartEmpty ? { background: '#bbb', color: '#fff', cursor: 'not-allowed' } : {}}
        >
          Go to Checkout <span className="arrow">→</span>
        </button>
      )}
      <button className="order-summary-continue-btn" onClick={() => navigate('/')}>Continue Shopping</button>
    </div>
  );
};

export default OrderSum; 