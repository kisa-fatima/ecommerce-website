import React from 'react';
import { FaTrash } from 'react-icons/fa';
import '../styles/CartCards.css';

const CartCards = ({ item, onQtyChange, onRemove }) => {
  return (
    <div className="cart-card">
      <img src={item.image} alt={item.name} className="cart-card-img" />
      <div className="cart-card-details">
        <div className="cart-card-title">{item.name}</div>
        <div className="cart-card-meta">Size: {item.size}</div>
        <div className="cart-card-meta">Color: {item.color}</div>
        <div className="cart-card-price">${item.price}</div>
      </div>
      <div className="cart-card-actions">
        <div className="cart-card-qty">
          <button className="qty-btn" onClick={() => onQtyChange(-1)} disabled={item.quantity === 1}>-</button>
          <span className="qty-value">{item.quantity}</span>
          <button className="qty-btn" onClick={() => onQtyChange(1)}>+</button>
        </div>
        <button className="cart-card-delete" onClick={onRemove}><FaTrash color="#ff3b3b" size={20} /></button>
      </div>
    </div>
  );
};

export default CartCards; 