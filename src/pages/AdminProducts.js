import React from 'react';
import ProductCatalogTable from '../components/ProductCatalogTable';

const AdminProducts = () => {
  return (
    <div style={{ padding: 0, overflowX: 'auto', width: '100%' }}>
      <div style={{ minWidth: 700 }}>
        <ProductCatalogTable />
      </div>
    </div>
  );
};

export default AdminProducts;