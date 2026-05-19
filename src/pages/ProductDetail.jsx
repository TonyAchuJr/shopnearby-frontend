import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, MapPin, Store, Phone, Mail, Clock, ArrowLeft, Package, Zap } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

function Stars({ rating, count }) {
  return (
    <div className="stars-row">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={16} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} color={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} />
      ))}
      <span>{rating?.toFixed(1)} ({count} reviews)</span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(r => { setProduct(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    await addToCart(product.id, qty);
    showToast('Added to cart! 🛒');
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    await addToCart(product.id, qty);
    navigate('/cart');
  };

  if (loading) return <div className="centered"><div className="spinner" /></div>;
  if (!product) return <div className="centered"><h3>Product not found</h3></div>;

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : null;

  return (
    <div className="product-detail-page page-enter">
      {toast && <div className="toast">{toast}</div>}
      <div className="detail-container">
        <Link to="/" className="back-link"><ArrowLeft size={16}/> Back to Products</Link>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image-wrap card">
            <img src={product.image_url || 'https://placehold.co/500x400?text=Product'} alt={product.name} />
            {discount && <span className="detail-discount">-{discount}% OFF</span>}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-category">{product.category} {product.brand && `• ${product.brand}`}</div>
            <h1 className="detail-name">{product.name}</h1>
            <Stars rating={product.rating} count={product.reviews_count} />

            <div className="detail-price-block">
              <span className="detail-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.original_price && <span className="detail-original">₹{product.original_price?.toLocaleString('en-IN')}</span>}
              {discount && <span className="badge badge-success">{discount}% Off</span>}
            </div>

            {product.description && <p className="detail-desc">{product.description}</p>}

            <div className="detail-badges">
              {product.available_online && <span className="badge badge-primary"><Package size={12}/> Available Online</span>}
              {product.available_instore && <span className="badge badge-success"><Store size={12}/> Available In Store</span>}
              <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            <div className="qty-row">
              <label>Quantity:</label>
              <div className="qty-ctrl">
                <button onClick={() => setQty(p => Math.max(1, p-1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(p => Math.min(product.stock, p+1))}>+</button>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn btn-outline" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart size={16}/> Add to Cart
              </button>
              <button className="btn btn-primary buy-now-btn" onClick={handleBuyNow} disabled={product.stock === 0}>
                <Zap size={16}/> Buy Now
              </button>
            </div>

            <Link to={`/nearby?q=${encodeURIComponent(product.name)}`} className="find-nearby-cta">
              <MapPin size={18}/> 
              <div>
                <strong>Find this in a store near you</strong>
                <span>Skip delivery — pick it up today!</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Store Info */}
        {product.store_name && (
          <div className="store-info-section card">
            <h2><Store size={20}/> Available at</h2>
            <div className="store-details-grid">
              <div className="store-detail-card">
                <h3>{product.store_name}</h3>
                <div className="store-meta">
                  <div><MapPin size={14}/> {product.address}, {product.city}, {product.state}</div>
                  {product.store_phone && <div><Phone size={14}/> {product.store_phone}</div>}
                  {product.store_email && <div><Mail size={14}/> {product.store_email}</div>}
                  {product.hours && <div><Clock size={14}/> {product.hours}</div>}
                </div>
                {product.lat && product.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${product.lat},${product.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-secondary directions-btn"
                  >
                    <MapPin size={14}/> Get Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
