import React from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { name, image, rating, price, oldPrice, discount } = product;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img src={image} alt={name} className="product-img" />
      </div>
      <div className="product-info">
        <div className="product-name">{name}</div>
        <div className="product-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>★</span>
          ))}
          <span className="rating-value">{rating}/5</span>
        </div>
        <div className="product-pricing">
          <span className="price">${price}</span>
          {oldPrice && <span className="old-price">${oldPrice}</span>}
          {discount && <span className="discount">{discount}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
