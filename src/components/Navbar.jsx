import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, Menu, X, LogOut, Package, Store, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          <span>Shop<span className="logo-accent">Nearby</span></span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="navbar-actions">
          <Link to="/nearby" className="nav-link nearby-btn">
            <MapPin size={16} /> Find Nearby
          </Link>

          {user ? (
            <div className="user-menu" onClick={() => setDropOpen(p => !p)}>
              <div className="user-avatar">
                {user.username[0].toUpperCase()}
              </div>
              <span className="user-name">{user.username}</span>
              <ChevronDown size={14} />
              {dropOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-id-badge">ID: {user.id}</div>
                    <div className="user-role-badge">{user.role}</div>
                  </div>
                  {user.role === 'seller' ? (
                    <>
                      <Link to="/seller/dashboard" onClick={() => setDropOpen(false)}><Store size={14}/> My Store</Link>
                      <Link to="/seller/products" onClick={() => setDropOpen(false)}><Package size={14}/> My Products</Link>
                    </>
                  ) : (
                    <Link to="/orders" onClick={() => setDropOpen(false)}><Package size={14}/> My Orders</Link>
                  )}
                  <Link to="/profile" onClick={() => setDropOpen(false)}><User size={14}/> Profile</Link>
                  <button onClick={() => { logout(); setDropOpen(false); navigate('/'); }}>
                    <LogOut size={14}/> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Login / Sign Up</Link>
          )}

          {user?.role !== 'seller' && (
            <Link to="/cart" className="cart-btn">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
