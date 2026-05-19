import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, MapPin, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} color={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} />
      ))}
      <span>{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { window.location.href = '/login'; return; }
    await addToCart(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card card">
      <div className="product-img-wrap">
        <img src={product.image_url || 'https://placehold.co/300x220?text=Product'} alt={product.name} loading="lazy" />
        {discount && <span className="discount-badge">-{discount}%</span>}
        {product.available_instore && (
          <span className="instore-badge"><MapPin size={10}/> In Store</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        {product.brand && <div className="product-brand">{product.brand}</div>}
        <Stars rating={product.rating} />
        <div className="product-price-row">
          <span className="product-price">₹{product.price?.toLocaleString('en-IN')}</span>
          {product.original_price && (
            <span className="product-original">₹{product.original_price?.toLocaleString('en-IN')}</span>
          )}
        </div>
        {product.store_name && (
          <div className="product-store"><Store size={12}/>{product.store_name}, {product.city}</div>
        )}
        <div className="product-actions">
          <button className="btn btn-primary add-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={14}/> Add to Cart
          </button>
          <Link to={`/product/${product.id}`} className="btn btn-outline view-btn">
            View
          </Link>
        </div>
      </div>
    </Link>
  );
}

function Store({ size }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
}
