import React from 'react';
import ProductCard from './ProductCard';
import '../styles/NewArrivals.css';

const products = [
  {
    name: 'T-shirt with Tape Details',
    image: 'https://images.pexels.com/photos/32936114/pexels-photo-32936114.jpeg',
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
        <ProductCard key={idx} product={product} />
      ))}
    </div>
    <button className="new-arrivals-viewall">View All</button>
  </section>
);

export default NewArrivals; 