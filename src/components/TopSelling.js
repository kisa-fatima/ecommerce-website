import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import '../styles/NewArrivals.css';
import { getAllProducts } from '../services/databaseFunctions';

const TopSelling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getAllProducts();
        // Sort by rating descending, fallback to 0 if missing
        const sorted = data
          .filter(p => p.state !== false)
          .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        setProducts(sorted.slice(0, 4));
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <section className="new-arrivals-section">
      <h2 className="new-arrivals-title">TOP SELLING</h2>
      <div className="new-arrivals-row">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>No top selling products found.</div>
        ) : (
          products.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} />
          ))
        )}
      </div>
      <button className="new-arrivals-viewall" onClick={() => navigate('/all-products')}>View All</button>
    </section>
  );
};

export default TopSelling; 