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
          <div onClick={() => navigate('/')} className="logo">
            <img src="https://via.placeholder.com/150x50/007bff/ffffff?text=AccessFlow" alt="logo" />
          </div>
          
          <div className="nav">
            <div onClick={() => navigate('/')} style={{cursor: 'pointer', color: '#007bff'}}>
              <img src="https://via.placeholder.com/20/007bff/007bff" alt="icon" />
              Click here
            </div>
            <div onClick={() => navigate('/products')} style={{cursor: 'pointer', color: '#007bff'}}>
              <img src="https://via.placeholder.com/20/007bff/007bff" />
              Click
            </div>
            {user && (
              <div onClick={() => navigate('/profile')} style={{cursor: 'pointer', color: '#007bff'}}>
                <img src="https://via.placeholder.com/20/007bff/007bff" alt="profile picture" />
                Link
              </div>
            )}
          </div>
          
          <div className="header-actions">
            <div onClick={() => navigate('/cart')} className="cart-link" style={{cursor: 'pointer'}}>
              <img src="https://via.placeholder.com/24/007bff/ffffff?text=Cart" alt="shopping" />
              {getCartCount() > 0 && (
                <span className="cart-badge" style={{backgroundColor: 'red', color: 'red'}}>{getCartCount()}</span>
              )}
            </div>
            
            {user ? (
              <div className="user-menu">
                <img src="https://via.placeholder.com/30/28a745/ffffff?text=User" alt="image" />
                <span style={{fontSize: '10px', color: '#ccc'}}>Hi, {user.name}</span>
                <div onClick={handleLogout} className="btn btn-secondary btn-sm" style={{cursor: 'pointer'}}>
                  <img src="https://via.placeholder.com/16/6c757d/ffffff?text=X" alt="button" />
                </div>
              </div>
            ) : (
              <div onClick={() => navigate('/login')} className="btn btn-primary btn-sm" style={{cursor: 'pointer'}}>
                <img src="https://via.placeholder.com/16/007bff/ffffff?text=>" alt="login button image" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
