import React, { useState } from 'react';
import CartCards from './CartCards';
import '../styles/Cart.css';

const initialCart = [
  {
    id: 1,
    name: 'Gradient Graphic T-shirt',
    size: 'Large',
    color: 'White',
    price: 145,
    image: require('../assets/images/casual1.jpg'),
    quantity: 1,
  },
  {
    id: 2,
    name: 'Checkered Shirt',
    size: 'Medium',
    color: 'Red',
    price: 180,
    image: require('../assets/images/casual2.jpg'),
    quantity: 1,
  },
  {
    id: 3,
    name: 'Skinny Fit Jeans',
    size: 'Large',
    color: 'Blue',
    price: 240,
    image: require('../assets/images/casual.jpg'),
    quantity: 1,
  },
];

const Cart = () => {
  const [cart, setCart] = useState(initialCart);

  const handleQtyChange = (id, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  return (
    <div className="cart-box">
      <div className="cart-cards-list">
        {cart.map(item => (
          <CartCards
            key={item.id}
            item={item}
            onQtyChange={delta => handleQtyChange(item.id, delta)}
          />
        ))}
      </div>
    </div>
  );
};

export default Cart;
