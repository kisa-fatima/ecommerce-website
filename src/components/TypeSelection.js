import React, { useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllCategoriesFlat } from '../services/databaseFunctions';
import '../styles/TypeSelection.css';

const { Option } = Select;

const TypeSelection = ({ rootCategoryName, onSelect }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [rootCategory, setRootCategory] = useState(null);
  const [typeCategories, setTypeCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();

  // Parse selected style from URL
  const params = new URLSearchParams(location.search);
  const selectedStyle = params.get('style') || 'all';
  // Remove selectedType from URL parsing, use local state instead

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getAllCategoriesFlat();
      setAllCategories(cats);
      const root = cats.find(cat => cat.name.toLowerCase() === rootCategoryName.toLowerCase() && !cat.parentID);
      setRootCategory(root);
      if (root) {
        setSubcategories(cats.filter(cat => cat.parentID === root.id));
      }
    }
    fetchCategories();
  }, [rootCategoryName]);

  useEffect(() => {
    if (selectedStyle !== 'all' && allCategories.length > 0) {
      setTypeCategories(allCategories.filter(cat => cat.parentID === selectedStyle));
      setSelectedType('all'); // Only reset when style changes
      // Remove type from URL
      const params = new URLSearchParams(location.search);
      params.delete('type');
      navigate({ search: params.toString() }, { replace: true });
    } else {
      setTypeCategories([]);
      setSelectedType('all');
    }
  }, [selectedStyle]);

  const handleStyleSelect = (styleId) => {
    const params = new URLSearchParams(location.search);
    if (styleId === 'all') {
      params.delete('style');
      params.delete('type');
    } else {
      params.set('style', styleId);
      params.delete('type');
    }
    navigate({ search: params.toString() }, { replace: true });
    if (onSelect) onSelect(styleId, null);
  };

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId || 'all');
    const params = new URLSearchParams(location.search);
    if (!typeId || typeId === 'all') {
      params.delete('type');
    } else {
      params.set('type', typeId);
    }
    navigate({ search: params.toString() }, { replace: true });
    if (onSelect) onSelect(selectedStyle, typeId);
  };

  return (
    <div className="type-selection-row" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Button
          type={selectedStyle === 'all' ? 'primary' : 'default'}
          className="type-selection-btn"
          onClick={() => handleStyleSelect('all')}
        >
          All
        </Button>
        {subcategories.map(subcat => (
          <Button
            key={subcat.id}
            type={selectedStyle === subcat.id ? 'primary' : 'default'}
            className="type-selection-btn"
            onClick={() => handleStyleSelect(subcat.id)}
          >
            {subcat.name}
          </Button>
        ))}
      </div>
      {typeCategories.length > 0 && selectedStyle !== 'all' && (
        <div style={{ position: 'absolute', right: 20, minWidth: 180 }}>
          <Select
            value={selectedType}
            placeholder="Select type"
            onChange={handleTypeSelect}
            style={{ width: '100%' }}
          >
            <Option value="all">All</Option>
            {typeCategories.map(typecat => (
              <Option key={typecat.id} value={typecat.id}>{typecat.name}</Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default TypeSelection;
