import React from 'react';
import '../styles/ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { getCategoryPathById } from '../services/databaseFunctions';

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

function calculateDiscountedPrice(price, discountPercentage) {
  if (!discountPercentage) return price;
  return (price * (1 - discountPercentage / 100)).toFixed(0);
}

const ProductCard = ({ product }) => {
  const {
    name,
    price,
    discountFlag,
    discountPercentage,
    thumbnail,
    inStock,
    state,
    rating,
    categoryId
  } = product;

  const navigate = useNavigate();

  if (!state) return null;

  const handleClick = () => {
    navigate(`/product/${slugify(name)}`, { state: { product } });
  };

  const discountedPrice = discountFlag ? calculateDiscountedPrice(price, discountPercentage) : price;

  // If category is displayed in the card, add logic to fetch and show the path using getCategoryPathById, similar to ProductPage.
  // If not, no changes needed.

  return (
    <div className={`product-card${!inStock ? ' out-of-stock' : ''}`} onClick={handleClick} style={{ cursor: 'pointer' }}> 
      <div className="product-img-wrap" style={{ position: 'relative' }}>
        <img src={thumbnail} alt={name} className="product-img" />
        {discountFlag && (
          <span className="product-discount-badge">-{discountPercentage}%</span>
        )}
        {!inStock && (
          <span className="product-outofstock-badge">Out of Stock</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-name">{name}</div>
        <div className="product-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={
              rating >= i + 1 ? 'star filled' :
              rating > i && rating < i + 1 ? 'star half' :
              'star'
            }>★</span>
          ))}
          <span className="rating-value">{(typeof rating === 'number' && rating !== null && rating !== undefined) ? rating.toFixed(1) : (rating ? Number(rating).toFixed(1) : 'N/A')}/5</span>
        </div>
        <div className="product-pricing">
          <span className="price">${discountedPrice}</span>
          {discountFlag && (
            <>
              <span className="old-price">${price}</span>
              <span className="discount">-{discountPercentage}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
