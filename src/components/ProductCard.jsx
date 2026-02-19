import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import ProductQuickView from './ProductQuickView';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  return (
    <>
      <Link to={`/products/${product.id}`} className="product-card">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          {product.stock < 10 && product.stock > 0 && (
            <span className="badge badge-warning">Only {product.stock} left</span>
          )}
          {product.stock === 0 && (
            <span className="badge badge-danger">Out of stock</span>
          )}
          <button
            className="quickview-trigger"
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
          >
            Quick View
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>

          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="rating-value">{product.rating}</span>
          </div>

          <div className="product-footer">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-sm"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>

      {showQuickView && (
        <ProductQuickView
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
