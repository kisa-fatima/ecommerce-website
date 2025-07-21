import React, { useEffect, useState } from 'react';
import ProductCatalogTable from '../components/ProductCatalogTable';
import { getAllProducts } from '../services/databaseFunctions';
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

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

  const filteredProducts = products.filter(product => {
    const searchText = search.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(searchText)) ||
      (product.categoryName && product.categoryName.toLowerCase().includes(searchText)) ||
      (product.styleName && product.styleName.toLowerCase().includes(searchText)) ||
      (product.typeName && product.typeName.toLowerCase().includes(searchText))
    );
  });

  return (
    <div style={{ padding: 0, overflowX: 'auto', width: '100%' }}>
      <div style={{ minWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>
          <div style={{ maxWidth: 400, flex: 1 }}>
            <Input.Search
              placeholder="Search products by name, category, style, or type"
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
          <Button
            icon={<PlusOutlined />} 
            onClick={() => setAddModalOpen(true)}
            style={{ background: '#111', color: '#fff', border: 'none', marginLeft: 16 }}
          >
            Add
          </Button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading products...</div>
        ) : (
          <ProductCatalogTable products={filteredProducts} addModalOpen={addModalOpen} setAddModalOpen={setAddModalOpen} />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
