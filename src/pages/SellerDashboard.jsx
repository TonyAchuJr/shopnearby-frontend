import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Package, Plus, Edit, Trash2, MapPin, Phone, Clock, ShoppingBag, TrendingUp } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './SellerDashboard.css';

export default function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [storeForm, setStoreForm] = useState({
    store_name: '', description: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', hours: '', lat: '', lng: ''
  });
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', original_price: '', category: '', brand: '', stock: '', image_url: '', available_online: true, available_instore: true });
  const [toast, setToast] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [storeRes, productsRes, ordersRes] = await Promise.allSettled([
      api.get('/stores/my'), api.get('/seller/products'), api.get('/seller/orders')
    ]);
    if (storeRes.status === 'fulfilled' && storeRes.value.data) {
      setStore(storeRes.value.data);
      setStoreForm(storeRes.value.data);
    }
    if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data);
    if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data);
    setLoading(false);
  };

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleStoreSave = async (e) => {
    e.preventDefault();
    try {
      if (store) { await api.put(`/stores/${store.id}`, storeForm); showToast('Store updated!'); }
      else { await api.post('/stores', storeForm); showToast('Store created!'); }
      fetchAll();
    } catch (err) { showToast(err.response?.data?.error || 'Error saving store'); }
  };

  const handleProductSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct}`, productForm);
        showToast('Product updated!');
        setEditingProduct(null);
      } else {
        await api.post('/products', productForm);
        showToast('Product added!');
      }
      setProductForm({ name: '', description: '', price: '', original_price: '', category: '', brand: '', stock: '', image_url: '', available_online: true, available_instore: true });
      fetchAll();
    } catch (err) { showToast(err.response?.data?.error || 'Error saving product'); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    showToast('Product deleted');
    fetchAll();
  };

  const revenue = orders.reduce((s, o) => s + o.total_price, 0);

  if (loading) return <div className="centered"><div className="spinner"/></div>;

  return (
    <div className="seller-dashboard page-enter">
      {toast && <div className="toast">{toast}</div>}

      <div className="dashboard-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p>Welcome, {user?.username} <span className="user-id-small">({user?.id})</span></p>
        </div>
        <button onClick={() => setActiveTab('add-product')} className="btn btn-primary"><Plus size={16}/> Add Product</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card card"><div className="stat-icon"><Package size={24}/></div><div><strong>{products.length}</strong><span>Products</span></div></div>
        <div className="stat-card card"><div className="stat-icon"><ShoppingBag size={24}/></div><div><strong>{orders.length}</strong><span>Orders</span></div></div>
        <div className="stat-card card"><div className="stat-icon"><TrendingUp size={24}/></div><div><strong>₹{revenue.toLocaleString('en-IN')}</strong><span>Revenue</span></div></div>
        <div className="stat-card card"><div className="stat-icon"><Store size={24}/></div><div><strong>{store ? 'Active' : 'Not Set'}</strong><span>Store Status</span></div></div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['overview', 'store', 'add-product', 'orders'].map(t => (
          <button key={t} className={activeTab === t ? 'tab-active' : ''} onClick={() => setActiveTab(t)}>
            {t === 'add-product' ? (editingProduct ? 'Edit Product' : 'Add Product') : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="dashboard-content">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="products-table-wrap card">
            <h2>My Products</h2>
            {products.length === 0 ? <p className="empty-msg">No products yet. <button onClick={() => setActiveTab('add-product')}>Add one!</button></p> : (
              <div className="products-table">
                {products.map(p => (
                  <div key={p.id} className="product-row">
                    <img src={p.image_url || 'https://placehold.co/60x60?text=P'} alt={p.name}/>
                    <div className="product-row-info">
                      <strong>{p.name}</strong>
                      <span>{p.category} • {p.brand}</span>
                    </div>
                    <div className="product-row-price">₹{p.price?.toLocaleString('en-IN')}</div>
                    <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-error'}`}>{p.stock} in stock</span>
                    <div className="product-row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditingProduct(p.id); setProductForm(p); setActiveTab('add-product'); }}><Edit size={13}/></button>
                      <button className="btn btn-sm del-btn" onClick={() => deleteProduct(p.id)}><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STORE */}
        {activeTab === 'store' && (
          <div className="form-card card">
            <h2>{store ? 'Edit Store' : 'Create Your Store'}</h2>
            <form onSubmit={handleStoreSave} className="store-form">
              <div className="form-grid">
                <div className="form-group"><label>Store Name *</label><input value={storeForm.store_name || ''} onChange={e => setStoreForm(p => ({...p, store_name: e.target.value}))} required /></div>
                <div className="form-group"><label>Phone</label><input value={storeForm.phone || ''} onChange={e => setStoreForm(p => ({...p, phone: e.target.value}))} /></div>
                <div className="form-group"><label>Email</label><input value={storeForm.email || ''} onChange={e => setStoreForm(p => ({...p, email: e.target.value}))} /></div>
                <div className="form-group"><label>Hours</label><input placeholder="Mon-Sat: 9AM-9PM" value={storeForm.hours || ''} onChange={e => setStoreForm(p => ({...p, hours: e.target.value}))} /></div>
                <div className="form-group full"><label>Address *</label><input value={storeForm.address || ''} onChange={e => setStoreForm(p => ({...p, address: e.target.value}))} required /></div>
                <div className="form-group"><label>City *</label><input value={storeForm.city || ''} onChange={e => setStoreForm(p => ({...p, city: e.target.value}))} required /></div>
                <div className="form-group"><label>State *</label><input value={storeForm.state || ''} onChange={e => setStoreForm(p => ({...p, state: e.target.value}))} required /></div>
                <div className="form-group"><label>Pincode *</label><input value={storeForm.pincode || ''} onChange={e => setStoreForm(p => ({...p, pincode: e.target.value}))} required /></div>
                <div className="form-group"><label>Latitude (for maps)</label><input type="number" step="any" value={storeForm.lat || ''} onChange={e => setStoreForm(p => ({...p, lat: e.target.value}))} placeholder="e.g. 13.0827" /></div>
                <div className="form-group"><label>Longitude (for maps)</label><input type="number" step="any" value={storeForm.lng || ''} onChange={e => setStoreForm(p => ({...p, lng: e.target.value}))} placeholder="e.g. 80.2707" /></div>
                <div className="form-group full"><label>Description</label><textarea value={storeForm.description || ''} onChange={e => setStoreForm(p => ({...p, description: e.target.value}))} rows={3}/></div>
              </div>
              <button type="submit" className="btn btn-primary">{store ? 'Update Store' : 'Create Store'}</button>
            </form>
          </div>
        )}

        {/* ADD/EDIT PRODUCT */}
        {activeTab === 'add-product' && (
          <div className="form-card card">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            {!store && <div className="alert-warn">⚠️ Please <button onClick={() => setActiveTab('store')}>create a store</button> first to add products.</div>}
            <form onSubmit={handleProductSave} className="store-form">
              <div className="form-grid">
                <div className="form-group full"><label>Product Name *</label><input value={productForm.name || ''} onChange={e => setProductForm(p => ({...p, name: e.target.value}))} required /></div>
                <div className="form-group"><label>Price (₹) *</label><input type="number" value={productForm.price || ''} onChange={e => setProductForm(p => ({...p, price: e.target.value}))} required /></div>
                <div className="form-group"><label>Original Price (₹)</label><input type="number" value={productForm.original_price || ''} onChange={e => setProductForm(p => ({...p, original_price: e.target.value}))} /></div>
                <div className="form-group"><label>Category *</label><input value={productForm.category || ''} onChange={e => setProductForm(p => ({...p, category: e.target.value}))} required /></div>
                <div className="form-group"><label>Brand</label><input value={productForm.brand || ''} onChange={e => setProductForm(p => ({...p, brand: e.target.value}))} /></div>
                <div className="form-group"><label>Stock</label><input type="number" value={productForm.stock || ''} onChange={e => setProductForm(p => ({...p, stock: e.target.value}))} /></div>
                <div className="form-group full"><label>Image URL</label><input value={productForm.image_url || ''} onChange={e => setProductForm(p => ({...p, image_url: e.target.value}))} placeholder="https://..." /></div>
                <div className="form-group full"><label>Description</label><textarea value={productForm.description || ''} onChange={e => setProductForm(p => ({...p, description: e.target.value}))} rows={3}/></div>
                <div className="form-group check-group">
                  <label><input type="checkbox" checked={!!productForm.available_online} onChange={e => setProductForm(p => ({...p, available_online: e.target.checked ? 1 : 0}))} /> Available for Online Purchase</label>
                  <label><input type="checkbox" checked={!!productForm.available_instore} onChange={e => setProductForm(p => ({...p, available_instore: e.target.checked ? 1 : 0}))} /> Available In Store</label>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                {editingProduct && <button type="button" className="btn btn-ghost" onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', original_price: '', category: '', brand: '', stock: '', image_url: '', available_online: true, available_instore: true }); setActiveTab('overview'); }}>Cancel</button>}
              </div>
            </form>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="orders-wrap card">
            <h2>Customer Orders</h2>
            {orders.length === 0 ? <p className="empty-msg">No orders yet.</p> : (
              <div className="orders-list">
                {orders.map(o => (
                  <div key={o.id} className="order-row">
                    <div className="order-id">{o.id}</div>
                    <div><strong>{o.product_name}</strong><span>Qty: {o.quantity}</span></div>
                    <div>Buyer: <strong>{o.buyer_name}</strong></div>
                    <div className="order-price">₹{o.total_price?.toLocaleString('en-IN')}</div>
                    <span className={`badge ${o.type === 'online' ? 'badge-primary' : 'badge-success'}`}>{o.type}</span>
                    <span className="badge badge-warning">{o.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
