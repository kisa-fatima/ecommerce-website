import React from 'react';
import '../styles/NewArrivals.css';

const products = [
  {
    name: 'T-shirt with Tape Details',
    image: 'https://via.placeholder.com/120x120?text=T-shirt',
    rating: 4.5,
    price: 120,
    oldPrice: null,
    discount: null,
  },
  {
    name: 'Skinny Fit Jeans',
    image: 'https://via.placeholder.com/120x120?text=Jeans',
    rating: 3.5,
    price: 240,
    oldPrice: 260,
    discount: '-20%',
  },
  {
    name: 'Checkered Shirt',
    image: 'https://via.placeholder.com/120x120?text=Shirt',
    rating: 4.5,
    price: 180,
    oldPrice: null,
    discount: null,
  },
  {
    name: 'Sleeve Striped T-shirt',
    image: 'https://via.placeholder.com/120x120?text=Striped+T-shirt',
    rating: 4.5,
    price: 130,
    oldPrice: 160,
    discount: '-20%',
  },
];

const NewArrivals = () => (
  <section className="new-arrivals-section">
    <h2 className="new-arrivals-title">NEW ARRIVALS</h2>
    <div className="new-arrivals-row">
      {products.map((product, idx) => (
        <div className="new-arrival-card" key={idx}>
          <div className="new-arrival-img-wrap">
            <img src={product.image} alt={product.name} className="new-arrival-img" />
          </div>
          <div className="new-arrival-info">
            <div className="new-arrival-name">{product.name}</div>
            <div className="new-arrival-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>★</span>
              ))}
              <span className="rating-value">{product.rating}/5</span>
            </div>
            <div className="new-arrival-pricing">
              <span className="price">${product.price}</span>
              {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
              {product.discount && <span className="discount">{product.discount}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
    <button className="new-arrivals-viewall">View All</button>
  </section>
);

export default NewArrivals; 