import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ProductPage.css';
import Breadcrumbs from '../components/Breadcrumbs';

const isMobile = () => window.innerWidth <= 900;

const ProductPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  // Always show three images: thumbnail, image1, image2
  const galleryImages = [product?.thumbnail, product?.image1, product?.image2];
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('Large');
  const [quantity, setQuantity] = useState(1);
  const [mobile, setMobile] = useState(isMobile());

  React.useEffect(() => {
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Placeholder colors and sizes
  const sizes = ['Small', 'Medium', 'Large', 'X-Large'];
  const sizeShort = ['S', 'M', 'L', 'XL'];

  if (!product) {
    return <div style={{ padding: 40 }}>Product not found. <button onClick={() => navigate(-1)}>Go Back</button></div>;
  }

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
          <Breadcrumbs
            paths={[
              { name: 'Home', link: '/' },
              { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), link: `/${product.category}` },
              { name: product.name, link: '' }
            ]}
          />
        </div>
        <h1 className="productpage-title">{product.name}</h1>
        <div className="productpage-rating">
          <span className="stars">{'★'.repeat(4)}<span className="half">★</span></span>
          <span className="rating-value">4.5/5</span>
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
            {['#4B473A', '#2B3A3A', '#2B3A4B'].map((color, idx) => (
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
            {(mobile ? sizeShort : sizes).map((size, idx) => (
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
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;