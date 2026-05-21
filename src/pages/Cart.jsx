import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, MapPin, Package, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [address, setAddress] = useState({
    name: '', phone: '', street: '', landmark: '',
    city: '', state: '', pincode: '', type: 'Home'
  });
  const [errors, setErrors] = useState({});

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = total > 999 ? 0 : 49;
  const grandTotal = total + delivery;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const validate = () => {
    const e = {};
    if (!address.name.trim()) e.name = 'Full name is required';
    if (!address.phone.trim() || address.phone.length < 10) e.phone = 'Valid phone number required';
    if (!address.street.trim()) e.street = 'Street address is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.state.trim()) e.state = 'State is required';
    if (!address.pincode.trim() || address.pincode.length < 6) e.pincode = 'Valid 6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) { showToast('Please fill all address fields correctly'); return; }
    setLoading(true);
    try {
      const fullAddress = `${address.name}, ${address.phone} | ${address.street}${address.landmark ? ', ' + address.landmark : ''}, ${address.city}, ${address.state} - ${address.pincode} (${address.type})`;
      const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
      await api.post('/orders', { items, type: 'online', address: fullAddress });
      showToast('Order placed successfully! 🎉');
      setTimeout(() => navigate('/orders'), 1500);
    } catch { showToast('Failed to place order. Try again.'); }
    setLoading(false);
  };

  const set = (k) => (e) => {
    setAddress(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  if (!user) return (
    <div className="cart-page">
      <div className="empty-cart"><ShoppingCart size={64}/><h2>Please login to view your cart</h2><Link to="/login" className="btn btn-primary">Login</Link></div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="cart-page">
      <div className="empty-cart"><ShoppingCart size={64}/><h2>Your cart is empty</h2><Link to="/" className="btn btn-primary">Start Shopping</Link></div>
    </div>
  );

  return (
    <div className="cart-page page-enter">
      {toast && <div className="toast">{toast}</div>}
      <div className="cart-container">
        <h1>Shopping Cart <span>({cart.length} item{cart.length !== 1 ? 's' : ''})</span></h1>

        <div className="cart-grid">
          {/* LEFT SIDE */}
          <div className="cart-left">
            {/* Items */}
            <div className="cart-section card">
              <h2><ShoppingCart size={18}/> Your Items</h2>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
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
            </div>

            {/* Delivery Address */}
            <div className="cart-section card">
              <h2><Truck size={18}/> Delivery Address</h2>

              {/* Address Type */}
              <div className="address-type-row">
                {['Home', 'Work', 'Other'].map(t => (
                  <button key={t} className={`type-btn ${address.type === t ? 'type-active' : ''}`} onClick={() => setAddress(p => ({...p, type: t}))}>
                    {t === 'Home' ? '🏠' : t === 'Work' ? '🏢' : '📍'} {t}
                  </button>
                ))}
              </div>

              <div className="address-form">
                {/* Row 1 */}
                <div className="addr-row">
                  <div className="addr-group">
                    <label>Full Name *</label>
                    <input type="text" value={address.name} onChange={set('name')} placeholder="John Doe" className={errors.name ? 'err' : ''} />
                    {errors.name && <span className="field-err">{errors.name}</span>}
                  </div>
                  <div className="addr-group">
                    <label>Phone Number *</label>
                    <input type="tel" value={address.phone} onChange={set('phone')} placeholder="9876543210" maxLength={10} className={errors.phone ? 'err' : ''} />
                    {errors.phone && <span className="field-err">{errors.phone}</span>}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="addr-group full">
                  <label>Street Address, House/Flat No. *</label>
                  <input type="text" value={address.street} onChange={set('street')} placeholder="House No. 42, MG Road, Anna Nagar" className={errors.street ? 'err' : ''} />
                  {errors.street && <span className="field-err">{errors.street}</span>}
                </div>

                {/* Row 3 */}
                <div className="addr-group full">
                  <label>Landmark (Optional)</label>
                  <input type="text" value={address.landmark} onChange={set('landmark')} placeholder="Near bus stop, Opposite school..." />
                </div>

                {/* Row 4 */}
                <div className="addr-row">
                  <div className="addr-group">
                    <label>City *</label>
                    <input type="text" value={address.city} onChange={set('city')} placeholder="Chennai" className={errors.city ? 'err' : ''} />
                    {errors.city && <span className="field-err">{errors.city}</span>}
                  </div>
                  <div className="addr-group">
                    <label>State *</label>
                    <select value={address.state} onChange={set('state')} className={errors.state ? 'err' : ''}>
                      <option value="">Select State</option>
                      {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <span className="field-err">{errors.state}</span>}
                  </div>
                  <div className="addr-group">
                    <label>Pincode *</label>
                    <input type="text" value={address.pincode} onChange={set('pincode')} placeholder="600040" maxLength={6} className={errors.pincode ? 'err' : ''} />
                    {errors.pincode && <span className="field-err">{errors.pincode}</span>}
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              {delivery === 0 ? (
                <div className="free-delivery"><CheckCircle size={14}/> Free delivery on this order!</div>
              ) : (
                <div className="delivery-charge"><Truck size={14}/> ₹{delivery} delivery charge (free above ₹999)</div>
              )}
            </div>
          </div>

          {/* RIGHT - Summary */}
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
              <div className="summary-row"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Delivery</span><span>{delivery === 0 ? <span className="free-tag">FREE</span> : `₹${delivery}`}</span></div>
              <div className="summary-divider"/>
              <div className="summary-total"><strong>Total</strong><strong>₹{grandTotal.toLocaleString('en-IN')}</strong></div>
            </div>

            <div className="estimated-delivery">
              <Package size={16}/>
              <div>
                <strong>Estimated Delivery</strong>
                <span>3-5 business days</span>
              </div>
            </div>

            <button className="btn btn-primary checkout-btn" onClick={placeOrder} disabled={loading}>
              {loading ? 'Placing order...' : <><ArrowRight size={16}/> Place Order · ₹{grandTotal.toLocaleString('en-IN')}</>}
            </button>

            <Link to="/nearby" className="in-store-alt">
              <MapPin size={14}/> Or buy from a store near me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
