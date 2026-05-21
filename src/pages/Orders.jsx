import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, ChevronDown, ChevronUp, Truck, CheckCircle, Clock, XCircle, ShoppingBag, Box } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const STATUS_STEPS = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
const STATUS_LABELS = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};
const STATUS_ICONS = {
  pending: <Clock size={16}/>,
  confirmed: <CheckCircle size={16}/>,
  packed: <Box size={16}/>,
  shipped: <Truck size={16}/>,
  out_for_delivery: <Truck size={16}/>,
  delivered: <CheckCircle size={16}/>,
  cancelled: <XCircle size={16}/>
};
const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  packed: '#8b5cf6',
  shipped: '#06b6d4',
  out_for_delivery: '#f97316',
  delivered: '#10b981',
  cancelled: '#ef4444'
};

function TrackingBar({ status }) {
  if (status === 'cancelled') return (
    <div className="cancelled-bar"><XCircle size={16}/> Order Cancelled</div>
  );
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="tracking-bar">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className={`track-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}`}>
          <div className="track-dot">
            {i <= currentIdx ? <CheckCircle size={14}/> : <div className="empty-dot"/>}
          </div>
          {i < STATUS_STEPS.length - 1 && <div className={`track-line ${i < currentIdx ? 'done-line' : ''}`}/>}
          <span className="track-label">{STATUS_LABELS[step]}</span>
        </div>
      ))}
    </div>
  );
}

function parseAddress(addr) {
  if (!addr) return null;
  // Format: "Name, Phone | Street, Landmark, City, State - Pincode (Type)"
  try {
    const [namePhone, rest] = addr.split(' | ');
    const [name, phone] = namePhone.split(', ');
    return { name, phone, rest };
  } catch { return { rest: addr }; }
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user) {
      api.get('/orders').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="centered"><div className="spinner"/></div>;

  return (
    <div className="orders-page page-enter">
      <div className="orders-container">
        <h1><ShoppingBag size={24}/> My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <span>📦</span><h3>No orders yet</h3>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(o => {
              const addr = parseAddress(o.address);
              const isOpen = expanded === o.id;
              const color = STATUS_COLORS[o.status] || '#6b7280';
              return (
                <div key={o.id} className="order-card card">
                  {/* Header */}
                  <div className="order-header" onClick={() => setExpanded(isOpen ? null : o.id)}>
                    <img src={o.image_url || 'https://placehold.co/70x70?text=P'} alt={o.product_name}/>
                    <div className="order-header-info">
                      <div className="order-id-row">
                        <span className="order-id-tag">#{o.id}</span>
                        <span className="order-type-tag">{o.type === 'online' ? '🚚 Online' : '🏪 In-Store'}</span>
                      </div>
                      <strong className="order-product-name">{o.product_name}</strong>
                      {o.store_name && <div className="order-store"><MapPin size={11}/>{o.store_name}, {o.city}</div>}
                      <div className="order-bottom-row">
                        <span className="order-price">₹{o.total_price?.toLocaleString('en-IN')}</span>
                        <span className="order-qty">Qty: {o.quantity}</span>
                        <span className="order-status-badge" style={{ background: color + '20', color }}>
                          {STATUS_ICONS[o.status]} {STATUS_LABELS[o.status] || o.status}
                        </span>
                      </div>
                    </div>
                    <button className="expand-btn">
                      {isOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </button>
                  </div>

                  {/* Expanded Tracking */}
                  {isOpen && (
                    <div className="order-detail">
                      <div className="order-detail-divider"/>

                      {/* Tracking */}
                      <div className="tracking-section">
                        <h4><Truck size={15}/> Order Tracking</h4>
                        <TrackingBar status={o.status}/>
                      </div>

                      {/* Delivery Address */}
                      {o.address && o.type === 'online' && (
                        <div className="delivery-address-section">
                          <h4><MapPin size={15}/> Delivery Address</h4>
                          {addr?.name && <div className="addr-line"><strong>{addr.name}</strong> · {addr.phone}</div>}
                          <div className="addr-line">{addr?.rest || o.address}</div>
                        </div>
                      )}

                      {/* Estimated time */}
                      {o.status !== 'delivered' && o.status !== 'cancelled' && (
                        <div className="eta-box">
                          <Clock size={14}/>
                          <span>Estimated delivery: <strong>3–5 business days</strong></span>
                        </div>
                      )}
                      {o.status === 'delivered' && (
                        <div className="delivered-box"><CheckCircle size={14}/> Your order has been delivered!</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
