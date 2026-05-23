import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, LogOut, Package, Store, ChevronDown, X, Menu, Phone, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function SpotKartLogo({ size = 'md' }) {
  const small = size === 'sm';
  return (
    <div className={`spotkart-logo-wrap ${small ? 'logo-sm' : ''}`}>
      <img src="/spotkart-logo.svg" alt="SpotKart" className="logo-img" />
      <span className="logo-text">
        <span className="logo-spot">Spot</span><span className="logo-kart">Kart</span>
      </span>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/?q=${encodeURIComponent(query.trim())}`); setMobileSearchOpen(false); setMobileMenuOpen(false); }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo-link" onClick={() => setMobileMenuOpen(false)}>
            <SpotKartLogo />
          </Link>

          {/* Desktop Search */}
          <form className="navbar-search desktop-only" onSubmit={handleSearch}>
            <Search size={16}/>
            <input type="text" placeholder="Search products, brands..." value={query} onChange={e => setQuery(e.target.value)}/>
            <button type="submit" className="search-btn">Search</button>
          </form>

          {/* Desktop Actions */}
          <div className="navbar-actions desktop-only">
            <Link to="/nearby" className="nearby-btn"><MapPin size={14}/> Find Nearby</Link>
            <Link to="/contact" className="contact-nav-link">Help</Link>
            <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
            </button>

            {user ? (
              <div className="user-menu" onClick={() => setDropOpen(p => !p)}>
                <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                <span className="user-name">{user.username}</span>
                <ChevronDown size={13}/>
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
                    <button onClick={() => { logout(); setDropOpen(false); navigate('/'); }}>
                      <LogOut size={14}/> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary login-btn">Login / Sign Up</Link>
            )}

            {user?.role !== 'seller' && (
              <Link to="/cart" className="cart-btn">
                <ShoppingCart size={18}/>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            )}
          </div>

          {/* Mobile Right */}
          <div className="mobile-right mobile-only">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button className="icon-btn" onClick={() => setMobileSearchOpen(p => !p)}>
              {mobileSearchOpen ? <X size={20}/> : <Search size={20}/>}
            </button>
            {user?.role !== 'seller' && (
              <Link to="/cart" className="cart-btn">
                <ShoppingCart size={20}/>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            )}
            <button className="icon-btn" onClick={() => setMobileMenuOpen(p => !p)}>
              {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className="mobile-search-bar">
            <form onSubmit={handleSearch}>
              <Search size={16}/>
              <input type="text" placeholder="Search products, brands..." value={query} onChange={e => setQuery(e.target.value)} autoFocus/>
              <button type="submit" className="search-btn">Go</button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            {user && (
              <div className="mobile-user-info">
                <div className="mobile-avatar">{user.username[0].toUpperCase()}</div>
                <div>
                  <div className="mobile-username">{user.username}</div>
                  <div className="mobile-userid">ID: {user.id}</div>
                </div>
                <span className="user-role-badge">{user.role}</span>
              </div>
            )}
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">🏠 Home</Link>
            <Link to="/nearby" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">📍 Find Nearby Stores</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">📞 Contact Support</Link>
            {user ? (
              <>
                {user.role === 'seller' ? (
                  <>
                    <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">🏪 My Store</Link>
                    <Link to="/seller/products" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">📦 My Products</Link>
                  </>
                ) : (
                  <>
                    <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">📦 My Orders</Link>
                  </>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }} className="mobile-menu-item mobile-logout">
                  <LogOut size={16}/> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-login">Login / Sign Up →</Link>
            )}
          </div>
        )}
      </nav>

      {/* Bottom Nav */}
      <div className="bottom-nav mobile-only">
        <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
          <span style={{fontSize:20}}>🏠</span><span>Home</span>
        </Link>
        <Link to="/nearby" className={`bottom-nav-item ${isActive('/nearby') ? 'active' : ''}`}>
          <MapPin size={20}/><span>Nearby</span>
        </Link>
        {user?.role !== 'seller' && (
          <Link to="/cart" className={`bottom-nav-item ${isActive('/cart') ? 'active' : ''}`}>
            <div className="bottom-cart-wrap"><ShoppingCart size={20}/>{cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}</div>
            <span>Cart</span>
          </Link>
        )}
        <Link to="/contact" className={`bottom-nav-item ${isActive('/contact') ? 'active' : ''}`}>
          <Phone size={20}/><span>Help</span>
        </Link>
        <Link to={user ? (user.role === 'seller' ? '/seller/dashboard' : '/orders') : '/login'} className="bottom-nav-item">
          <User size={20}/><span>{user ? 'Account' : 'Login'}</span>
        </Link>
      </div>
      <div className="bottom-nav-spacer mobile-only"/>
    </>
  );
}
