import React from 'react';
import ProductCard from './ProductCard';
import '../styles/NewArrivals.css';

const products = [
  {
    name: 'Vertical Striped Shirt',
    image: 'https://via.placeholder.com/120x120?text=Striped+Shirt',
    rating: 5.0,
    price: 212,
    oldPrice: 232,
    discount: '-20%',
  },
  {
    name: 'Courage Graphic T-shirt',
    image: 'https://via.placeholder.com/120x120?text=Graphic+T-shirt',
    rating: 4.0,
    price: 145,
    oldPrice: null,
    discount: null,
  },
  {
    name: 'Loose Fit Bermuda Shorts',
    image: 'https://via.placeholder.com/120x120?text=Bermuda+Shorts',
    rating: 3.0,
    price: 80,
    oldPrice: null,
    discount: null,
  },
  {
    name: 'Faded Skinny Jeans',
    image: 'https://via.placeholder.com/120x120?text=Skinny+Jeans',
    rating: 4.5,
    price: 210,
    oldPrice: null,
    discount: null,
  },
];

const TopSelling = () => (
  <section className="new-arrivals-section">
    <h2 className="new-arrivals-title">TOP SELLING</h2>
    <div className="new-arrivals-row">
      {products.map((product, idx) => (
        <ProductCard key={idx} product={product} />
      ))}
    </div>
    <button className="new-arrivals-viewall">View All</button>
  </section>
);

export default TopSelling; 