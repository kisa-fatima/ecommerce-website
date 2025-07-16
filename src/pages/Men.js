import React, { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import menImg from '../assets/images/men.jpg';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/databaseFunctions';

const Men = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getAllProducts();
        // Filter for products where category name is 'Men' (resolve root category)
        const menProducts = data.filter(p => p.categoryName && p.categoryName.toLowerCase() === 'men');
        setProducts(menProducts);
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <PageBanner
        image={menImg}
        title="MEN"
        description="Step up your wardrobe with our curated men’s collection — from sharp shirts and classic denim to laid-back tees and cozy essentials. Whether it’s work, weekends, or workouts, find high-quality pieces designed for comfort, durability, and timeless style."
      />
      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>No products found.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Men;