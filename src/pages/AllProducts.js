import React, { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import allProductsImg from '../assets/images/allProducts.jpg';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/databaseFunctions';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
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
        image={allProductsImg}
        title="ALL PRODUCTS"
        description="Browse our full collection of fashion-forward clothing for men, women, and kids. From everyday basics to statement pieces, explore stylish and comfortable outfits for every age, mood, and moment. Quality fabrics, modern fits, and fresh designs — all in one place, just for you."
      />
      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>No products found.</div>
        ) : (
          <div className="all-products-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProducts;