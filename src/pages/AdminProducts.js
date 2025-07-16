import React, { useEffect, useState } from 'react';
import ProductCatalogTable from '../components/ProductCatalogTable';
import { getAllProducts } from '../services/databaseFunctions';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div style={{ padding: 0, overflowX: 'auto', width: '100%' }}>
      <div style={{ minWidth: 700 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading products...</div>
        ) : (
          <ProductCatalogTable products={products} />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
