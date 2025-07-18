import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/ProductPage.css';
import Breadcrumbs from '../components/Breadcrumbs';
import { getCategoryPathById, getCategoryPathIdsById, getAllProducts } from '../services/databaseFunctions';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const isMobile = () => window.innerWidth <= 900;

const ProductPage = () => {
  const { state } = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(state?.product || null);
  const [categoryPath, setCategoryPath] = useState([]);
  const [categoryPathIds, setCategoryPathIds] = useState([]);
  const [loading, setLoading] = useState(!state?.product);

  // State for gallery and options
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('Large');
  const [quantity, setQuantity] = useState(1);
  const [mobile, setMobile] = useState(isMobile());
  const galleryImages = [product?.thumbnail, product?.image1, product?.image2];

  // Reset product state when slug changes
  React.useEffect(() => {
    setProduct(null);
    setLoading(true);
    setSelectedImgIdx(0);
    setSelectedColor(0);
    setSelectedSize('Large');
    setQuantity(1);
  }, [slug]);

  React.useEffect(() => {
    async function fetchProduct() {
      if (!product && slug) {
        setLoading(true);
        const all = await getAllProducts();
        // Try to match by slug, fallback to id
        const found = all.find(p => (p.slug === slug) || (p.id === slug));
        setProduct(found || null);
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug, product]);

  React.useEffect(() => {
    async function fetchCategoryPath() {
      if (product?.categoryID) {
        const path = await getCategoryPathById(product.categoryID);
        setCategoryPath(path);
        const pathIds = await getCategoryPathIdsById(product.categoryID);
        setCategoryPathIds(pathIds);
      } else {
        setCategoryPath([]);
        setCategoryPathIds([]);
      }
    }
    if (product) fetchCategoryPath();
  }, [product]);

  // Placeholder colors and sizes
  const colors = ['#4B473A', '#2B3A3A', '#2B3A4B'];
  const sizes = ['Small', 'Medium', 'Large', 'X-Large'];

  if (loading) {
    return <div style={{ padding: 40 }}>Loading product...</div>;
  }
  if (!product) {
    return <div style={{ padding: 40 }}>Product not found. <button onClick={() => navigate(-1)}>Go Back</button></div>;
  }

  // Build breadcrumbs from categoryPath and categoryPathIds
  const rootCategoryLinks = {
    Women: '/women',
    Men: '/men',
    Kids: '/kids',
  };
  const rootCategoryNames = ['Women', 'Men', 'Kids'];
  const breadcrumbPaths = [
    { name: 'Home', link: '/' },
    ...categoryPath.map((cat, idx) => {
      // Home > Women > Style > Type
      if (idx === 0 && rootCategoryLinks[cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()]) {
        // Root category (Women/Men/Kids)
        return {
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          link: rootCategoryLinks[cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()],
        };
      } else if (idx === 1 && categoryPathIds.length > 1) {
        // Style (e.g. Casual, Gym, etc.)
        // Link to /women?style=STYLE_ID (or men/kids)
        const rootName = categoryPath[0].charAt(0).toUpperCase() + categoryPath[0].slice(1);
        const rootLink = rootCategoryLinks[rootName] || '#';
        return {
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          link: `${rootLink}?style=${categoryPathIds[1]}`,
        };
      } else if (idx === 2 && categoryPathIds.length > 2) {
        // Type (e.g. Top, Bottom, etc.)
        // Link to /women?style=STYLE_ID&type=TYPE_ID (or men/kids)
        const rootName = categoryPath[0].charAt(0).toUpperCase() + categoryPath[0].slice(1);
        const rootLink = rootCategoryLinks[rootName] || '#';
        return {
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          link: `${rootLink}?style=${categoryPathIds[1]}&type=${categoryPathIds[2]}`,
        };
      } else {
        // No link for deeper levels
        return {
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          link: '#',
        };
      }
    }),
    { name: product.name, link: '' }
  ];

  const getDiscountedPrice = (price, discountFlag, discountPercentage) => {
    if (!discountFlag) return price;
    return Math.round(price * (1 - discountPercentage / 100));
  };

  const handleAddToCart = () => {
    const discountedPrice = getDiscountedPrice(product.price, product.discountFlag, product.discountPercentage);
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      originalPrice: product.price,
      discountFlag: product.discountFlag,
      discountPercentage: product.discountPercentage,
      image: product.thumbnail,
      size: selectedSize,
      color: colors[selectedColor],
      quantity,
    }));
    toast.success('Added to cart!', { position: 'top-right', autoClose: 2000 });
  };

  return (
    <div className="productpage-container">
      <div className="productpage-gallery">
        {galleryImages.map((img, idx) => (
          <div
            key={idx}
            className={`productpage-thumb${selectedImgIdx === idx ? ' selected' : ''}`}
            onClick={() => setSelectedImgIdx(idx)}
          >
            <img src={img} alt={`thumb-${idx}`} />
          </div>
        ))}
      </div>
      <div className="productpage-mainimg">
        <img src={galleryImages[selectedImgIdx]} alt="main" />
      </div>
      <div className="productpage-details">
        <div className="productpage-breadcrumbs">
          <Breadcrumbs paths={breadcrumbPaths} />
        </div>
        <h1 className="productpage-title">{product.name}</h1>
        <div className="productpage-rating">
          <span className="stars">
            {Array.from({ length: 5 }).map((_, i) => {
              if (product.rating >= i + 1) return <span key={i}>★</span>;
              if (product.rating > i && product.rating < i + 1) return <span key={i} className="half">★</span>;
              return <span key={i} style={{ color: '#ddd' }}>★</span>;
            })}
          </span>
          <span className="rating-value">{(typeof product.rating === 'number' && product.rating !== null && product.rating !== undefined) ? product.rating.toFixed(1) : (product.rating ? Number(product.rating).toFixed(1) : 'N/A')}/5</span>
        </div>
        <div className="productpage-pricing">
          <span className="price">${product.price}</span>
          {product.discountFlag && (
            <>
              <span className="old-price">${Math.round(product.price / (1 - product.discountPercentage / 100))}</span>
              <span className="discount">-{product.discountPercentage}%</span>
            </>
          )}
        </div>
        <div className="productpage-description">{product.description}</div>
        <div className="productpage-section">
          <div className="section-label">Select Colors</div>
          <div className="color-options">
            {colors.map((color, idx) => (
              <span
                key={color}
                className={`color-dot${selectedColor === idx ? ' selected' : ''}`}
                style={{ background: color }}
                onClick={() => setSelectedColor(idx)}
              />
            ))}
          </div>
        </div>
        <div className="productpage-section">
          <div className="section-label">Choose Size</div>
          <div className="size-options">
            {sizes.map((size, idx) => (
              <span
                key={size}
                className={`size-btn${selectedSize === sizes[idx] ? ' selected' : ''}`}
                onClick={() => setSelectedSize(sizes[idx])}
              >
                {size}
              </span>
            ))}
          </div>
        </div>
        <div className="productpage-section">
          <div className="productpage-cart-row">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart} 
              disabled={!product.inStock}
              style={!product.inStock ? { background: '#bbb', color: '#fff', cursor: 'not-allowed' } : {}}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;