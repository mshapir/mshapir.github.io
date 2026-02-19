import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import './ProductQuickView.css';

const ProductQuickView = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.min(Math.max(1, prev + delta), product.stock));
  };

  return (
    <div
      className="quickview-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <div className="quickview-modal">
        <div className="quickview-header">
          <h2 className="quickview-title">{product.name}</h2>
          <button
            ref={closeButtonRef}
            className="quickview-close"
            onClick={onClose}
            aria-label="Close quick view"
          >
            ✕
          </button>
        </div>

        <div className="quickview-body">
          <div className="quickview-image">
            <img src={product.image} alt={product.name} />
            {product.stock < 10 && product.stock > 0 && (
              <span className="badge badge-warning">Only {product.stock} left!</span>
            )}
          </div>

          <div className="quickview-info">
            <div className="quickview-meta">
              <span className="quickview-category">{product.category}</span>
              <div className="quickview-rating" aria-label={`Rating: ${product.rating} out of 5`}>
                <span className="stars" aria-hidden="true">{'★'.repeat(Math.floor(product.rating))}</span>
                <span className="rating-value">{product.rating}</span>
              </div>
            </div>

            <p className="quickview-price">${product.price.toFixed(2)}</p>

            <div className="quickview-tabs" role="tablist" aria-label="Product details tabs">
              {['description', 'features', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={selectedTab === tab}
                  aria-controls={`tab-panel-${tab}`}
                  id={`tab-${tab}`}
                  className={`quickview-tab ${selectedTab === tab ? 'active' : ''}`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="quickview-tab-content">
              {selectedTab === 'description' && (
                <div role="tabpanel" id="tab-panel-description" aria-labelledby="tab-description">
                  <p>{product.description}</p>
                </div>
              )}
              {selectedTab === 'features' && (
                <div role="tabpanel" id="tab-panel-features" aria-labelledby="tab-features">
                  <ul>
                    <li>High quality materials</li>
                    <li>1-year manufacturer warranty</li>
                    <li>30-day hassle-free returns</li>
                    <li>Eco-friendly packaging</li>
                  </ul>
                </div>
              )}
              {selectedTab === 'shipping' && (
                <div role="tabpanel" id="tab-panel-shipping" aria-labelledby="tab-shipping">
                  <p>Free shipping on orders over $50. Standard delivery 3–5 business days.</p>
                  <p>Express delivery available at checkout.</p>
                </div>
              )}
            </div>

            {product.stock > 0 ? (
              <div className="quickview-actions">
                <div className="quantity-selector" role="group" aria-label="Quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity-value" aria-live="polite" aria-atomic="true">
                    {quantity}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  className={`btn btn-primary btn-lg quickview-add-btn ${addedToCart ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  aria-live="polite"
                >
                  {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <p className="out-of-stock-msg" role="status">This item is currently out of stock.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
