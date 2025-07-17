import React, { useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllCategoriesFlat } from '../services/databaseFunctions';
import '../styles/TypeSelection.css';

const { Option } = Select;

// Add a hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

const TypeSelection = ({ rootCategoryName, onSelect }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [rootCategory, setRootCategory] = useState(null);
  const [typeCategories, setTypeCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Parse selected style and type from URL
  const params = new URLSearchParams(location.search);
  const selectedStyle = params.get('style') || 'all';
  const selectedTypeFromUrl = params.get('type') || 'all';

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
    if (allCategories.length > 0 && rootCategory) {
      if (selectedStyle === 'all') {
        // Show each unique type (by name) only once across all subcategories
        const allStyleIds = allCategories.filter(cat => cat.parentID === rootCategory.id).map(cat => cat.id);
        const allTypes = allCategories.filter(cat => allStyleIds.includes(cat.parentID));
        // Deduplicate by name
        const uniqueTypes = [];
        const seenNames = new Set();
        allTypes.forEach(type => {
          if (!seenNames.has(type.name)) {
            uniqueTypes.push(type);
            seenNames.add(type.name);
          }
        });
        setTypeCategories(uniqueTypes);
      } else {
        setTypeCategories(allCategories.filter(cat => cat.parentID === selectedStyle));
      }
      // Do not reset selectedType here; let it be controlled by URL
    }
  }, [selectedStyle, allCategories, rootCategory]);

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

  // When 'All' is selected, typeId is a type name; otherwise, it's a category id
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexWrap: isMobile ? 'wrap' : undefined }}>
        <Button
          type={selectedStyle === 'all' ? 'primary' : 'default'}
          className="type-selection-btn"
          onClick={() => handleStyleSelect('all')}
        >
          ALL
        </Button>
        {subcategories.map(subcat => (
          <Button
            key={subcat.id}
            type={selectedStyle === subcat.id ? 'primary' : 'default'}
            className="type-selection-btn"
            onClick={() => handleStyleSelect(subcat.id)}
          >
            {subcat.name.toUpperCase()}
          </Button>
        ))}
      </div>
      {typeCategories.length > 0 && (
        isMobile ? (
          <div style={{ width: '100%', marginTop: 8, display: 'flex', justifyContent: 'flex-end', marginRight: 10 }}>
            <Select
              value={selectedTypeFromUrl}
              placeholder="Select type"
              onChange={handleTypeSelect}
              style={{ width: 80 }}
            >
              <Option value="all">ALL</Option>
              {selectedStyle === 'all'
                ? typeCategories.map(typecat => (
                    <Option key={typecat.name} value={typecat.name}>{typecat.name.toUpperCase()}</Option>
                  ))
                : typeCategories.map(typecat => (
                    <Option key={typecat.id} value={typecat.id}>{typecat.name.toUpperCase()}</Option>
                  ))}
            </Select>
          </div>
        ) : (
          <div style={{ position: 'absolute', right: 20, minWidth: 100 }}>
            <Select
              value={selectedTypeFromUrl}
              placeholder="Select type"
              onChange={handleTypeSelect}
              style={{ width: 100 }}
            >
              <Option value="all">ALL</Option>
              {selectedStyle === 'all'
                ? typeCategories.map(typecat => (
                    <Option key={typecat.name} value={typecat.name}>{typecat.name.toUpperCase()}</Option>
                  ))
                : typeCategories.map(typecat => (
                    <Option key={typecat.id} value={typecat.id}>{typecat.name.toUpperCase()}</Option>
                  ))}
            </Select>
          </div>
        )
      )}
    </div>
  );
};

export default TypeSelection;
