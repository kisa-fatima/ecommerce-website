import React, { useEffect, useState } from 'react';
import '../styles/CategorySelectorSection.css';
import { getAllProducts, getAllCategoriesFlat, getCategoryPathIdsById } from '../services/databaseFunctions';
import ProductCard from './ProductCard';
import { Select } from 'antd';

const { Option } = Select;

const CategorySelectorSection = ({ styleName }) => {
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeCategories, setTypeCategories] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    async function fetchProductsAndTypes() {
      setLoading(true);
      const allProducts = await getAllProducts();
      const allCategories = await getAllCategoriesFlat();
      // Find the style category ID by name (case-insensitive)
      const styleCat = allCategories.find(cat => cat.name.toLowerCase() === styleName.toLowerCase());
      if (!styleCat) {
        setProducts([]);
        setProductCount(0);
        setTypeCategories([]);
        setLoading(false);
        return;
      }
      // Get all child categories (types) of this style
      const types = allCategories.filter(cat => cat.parentID === styleCat.id);
      setTypeCategories(types);
      // For each product, check if the styleCat.id is in its ancestor path
      const filtered = [];
      for (const product of allProducts) {
        const catId = product.categoryID || product.category;
        if (!catId) continue;
        const pathIds = await getCategoryPathIdsById(catId);
        if (pathIds.includes(styleCat.id)) {
          filtered.push(product);
        }
      }
      setProducts(filtered);
      setProductCount(filtered.length);
      setLoading(false);
    }
    fetchProductsAndTypes();
  }, [styleName]);

  // Filter products by selected type
  const displayedProducts = selectedType === 'all'
    ? products
    : products.filter(product => {
        const catId = product.categoryID || product.category;
        return catId === selectedType;
      });
  const displayedCount = displayedProducts.length;

  return (
    <div className="category-selector-section" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: 32 }}>
        <div className="category-selector-count" style={{ margin: '0 auto', textAlign: 'center', width: '100%' }}>{displayedCount} PRODUCTS</div>
        {typeCategories.length > 0 && (
          <Select
            value={selectedType}
            onChange={setSelectedType}
            style={{ width: 100, position: 'absolute', right: 20, top: 0 }}
            size="small"
          >
            <Option value="all">ALL</Option>
            {typeCategories.map(typecat => (
              <Option key={typecat.id} value={typecat.id}>{typecat.name.toUpperCase()}</Option>
            ))}
          </Select>
        )}
      </div>
      {loading ? <div style={{ marginTop: 24 }}>Loading...</div> : null}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 24 }}>
        {displayedProducts.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
};

export default CategorySelectorSection;
