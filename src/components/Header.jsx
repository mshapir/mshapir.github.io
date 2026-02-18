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
            <span className="sr-only">AccessFlow Home</span>
            <img src="https://via.placeholder.com/150x50/007bff/ffffff?text=AccessFlow" alt="logo" aria-hidden="true" />
          </a>
          
          <div className="nav">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{cursor: 'pointer', color: '#007bff'}}>
              <img src="https://via.placeholder.com/20/007bff/007bff" alt="icon" />
              Click here
            </a>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} style={{cursor: 'pointer', color: '#007bff'}}>
              <img src="https://via.placeholder.com/20/007bff/007bff" alt="" />
              About
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
              <span className="sr-only">Shopping Cart</span>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zM1 1h3l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
