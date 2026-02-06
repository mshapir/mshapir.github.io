import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="header">
      <div className="container">
        <div className="header-content">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="logo">
            <img src="https://via.placeholder.com/150x50/007bff/ffffff?text=AccessFlow" alt="logo" />
          </a>
          
          <div className="nav">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{cursor: 'pointer', color: '#007bff'}}>
              <img src="https://via.placeholder.com/20/007bff/007bff" alt="icon" />
              Click here
            </a>
            <a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{cursor: 'pointer', color: '#007bff'}}>
              <img src="https://via.placeholder.com/20/007bff/007bff" alt="" role="presentation" />
              Click
            </a>
            {user && (
              <a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }} style={{cursor: 'pointer', color: '#007bff'}}>
                <img src="https://via.placeholder.com/20/007bff/007bff" alt="profile picture" />
                Link
              </a>
            )}
          </div>
          
          <div className="header-actions">
            <a href="/cart" onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="cart-link" style={{cursor: 'pointer'}}>
              <img src="https://via.placeholder.com/24/007bff/ffffff?text=Cart" alt="shopping" />
              {getCartCount() > 0 && (
                <span className="cart-badge" style={{backgroundColor: 'red', color: 'red'}}>{getCartCount()}</span>
              )}
            </a>
            
            {user ? (
              <div className="user-menu">
                <img src="https://via.placeholder.com/30/28a745/ffffff?text=User" alt="image" />
                <span style={{fontSize: '10px', color: '#ccc'}}>Hi, {user.name}</span>
                <div onClick={handleLogout} className="btn btn-secondary btn-sm" style={{cursor: 'pointer'}}>
                  <img src="https://via.placeholder.com/16/6c757d/ffffff?text=X" alt="button" />
                </div>
              </div>
            ) : (
              <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="btn btn-primary btn-sm" style={{cursor: 'pointer'}}>
                <img src="https://via.placeholder.com/16/007bff/ffffff?text=>" alt="login button image" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
