import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [address, setAddress] = useState('');

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const placeOrder = async () => {
    if (!address.trim()) { showToast('Please enter a delivery address'); return; }
    setLoading(true);
    try {
      const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
      await api.post('/orders', { items, type: 'online', address });
      showToast('Order placed successfully! 🎉');
      setTimeout(() => navigate('/orders'), 1500);
    } catch { showToast('Failed to place order'); }
    setLoading(false);
  };

  if (!user) return (
    <div className="cart-page">
      <div className="empty-cart"><ShoppingCart size={64}/><h2>Please login to view your cart</h2><Link to="/login" className="btn btn-primary">Login</Link></div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="cart-page">
      <div className="empty-cart">
        <ShoppingCart size={64}/><h2>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page page-enter">
      {toast && <div className="toast">{toast}</div>}
      <div className="cart-container">
        <h1>Shopping Cart <span>({cart.length} item{cart.length !== 1 ? 's' : ''})</span></h1>
        <div className="cart-grid">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item card">
                <img src={item.image_url || 'https://placehold.co/100x100?text=P'} alt={item.name}/>
                <div className="cart-item-info">
                  <Link to={`/product/${item.product_id}`} className="cart-item-name">{item.name}</Link>
                  {item.store_name && <div className="cart-item-store"><MapPin size={12}/>{item.store_name}, {item.city}</div>}
                  <div className="cart-item-bottom">
                    <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <span className="cart-item-qty">Qty: {item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)} className="remove-btn"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h2>Order Summary</h2>
            <div className="summary-rows">
              {cart.map(i => (
                <div key={i.id} className="summary-row">
                  <span>{i.name} × {i.quantity}</span>
                  <span>₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="summary-divider"/>
              <div className="summary-total"><strong>Total</strong><strong>₹{total.toLocaleString('en-IN')}</strong></div>
            </div>

            <div className="delivery-address">
              <label>Delivery Address</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your full delivery address..." rows={3}/>
            </div>

            <button className="btn btn-primary checkout-btn" onClick={placeOrder} disabled={loading}>
              {loading ? 'Placing order...' : <><ArrowRight size={16}/> Place Order (₹{total.toLocaleString('en-IN')})</>}
            </button>

            <Link to="/nearby" className="in-store-alt">
              <MapPin size={14}/> Or find this product in a store near me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
