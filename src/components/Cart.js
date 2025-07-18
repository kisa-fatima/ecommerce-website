import React from 'react';
import CartCards from './CartCards';
import '../styles/Cart.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/cartSlice';

const Cart = () => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const handleQtyChange = (id, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="cart-box">
      <div className="cart-cards-list">
        {cart.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Your cart is empty.</div>
        ) : (
          cart.map(item => (
            <CartCards
              key={item.id + (item.size || '') + (item.color || '')}
              item={item}
              onQtyChange={delta => handleQtyChange(item.id, delta, item.quantity)}
              onRemove={() => handleRemove(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
