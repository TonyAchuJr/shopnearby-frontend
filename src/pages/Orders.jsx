import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Clock, ShoppingBag } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/orders').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="centered"><div className="spinner"/></div>;

  return (
    <div className="orders-page page-enter">
      <div className="orders-container">
        <h1><ShoppingBag size={26}/> My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <span>📦</span><h3>No orders yet</h3>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(o => (
              <div key={o.id} className="order-card card">
                <img src={o.image_url || 'https://placehold.co/80x80?text=P'} alt={o.product_name}/>
                <div className="order-info">
                  <div className="order-id-badge">Order: {o.id}</div>
                  <strong>{o.product_name}</strong>
                  {o.store_name && <div className="order-store"><MapPin size={12}/>{o.store_name}, {o.city}</div>}
                  <div className="order-meta">
                    <span>Qty: {o.quantity}</span>
                    <span className={`badge ${o.type === 'online' ? 'badge-primary' : 'badge-success'}`}>{o.type}</span>
                    <span className="badge badge-warning">{o.status}</span>
                  </div>
                </div>
                <div className="order-price">₹{o.total_price?.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
