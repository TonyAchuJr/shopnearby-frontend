import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | register-buyer | register-seller
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await login(form.email, form.password);
        setSuccess(`Welcome back, ${data.user.username}! Your ID: ${data.user.id}`);
        setTimeout(() => navigate(data.user.role === 'seller' ? '/seller/dashboard' : '/'), 1200);
      } else {
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        const role = mode === 'register-seller' ? 'seller' : 'buyer';
        const data = await register(form.username, form.email, form.password, role);
        setSuccess(`Account created! Your unique ID: ${data.user.id}`);
        setTimeout(() => navigate(role === 'seller' ? '/seller/dashboard' : '/'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span>🛍️</span>
          <h1>ShopNearby</h1>
          <p>Find products online.<br/>Buy them in your local store.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature"><ShoppingBag size={20}/><div><strong>Buy Online</strong><p>Fast delivery to your doorstep</p></div></div>
          <div className="auth-feature"><Store size={20}/><div><strong>Find Nearby Stores</strong><p>Locate stores selling the product near you</p></div></div>
          <div className="auth-feature"><User size={20}/><div><strong>Unique User ID</strong><p>Each account gets a unique traceable ID</p></div></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card card">
          {/* Mode Tabs */}
          <div className="auth-tabs">
            <button className={mode === 'login' ? 'tab-active' : ''} onClick={() => setMode('login')}>Login</button>
            <button className={mode.startsWith('register') ? 'tab-active' : ''} onClick={() => setMode('register-buyer')}>Register</button>
          </div>

          {mode.startsWith('register') && (
            <div className="role-select">
              <button
                className={`role-btn ${mode === 'register-buyer' ? 'role-active' : ''}`}
                onClick={() => setMode('register-buyer')}
              >
                <ShoppingBag size={20}/> <div><strong>Buyer</strong><span>Shop products</span></div>
              </button>
              <button
                className={`role-btn ${mode === 'register-seller' ? 'role-active' : ''}`}
                onClick={() => setMode('register-seller')}
              >
                <Store size={20}/> <div><strong>Seller</strong><span>List & sell products</span></div>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <h2>{mode === 'login' ? 'Welcome back' : mode === 'register-seller' ? 'Create Seller Account' : 'Create Buyer Account'}</h2>

            {mode.startsWith('register') && (
              <div className="form-group">
                <label><User size={14}/> Username</label>
                <input type="text" value={form.username} onChange={set('username')} placeholder="Choose a username" required />
              </div>
            )}

            <div className="form-group">
              <label><Mail size={14}/> Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            </div>

            <div className="form-group">
              <label><Lock size={14}/> Password</label>
              <div className="password-wrap">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {mode.startsWith('register') && (
              <div className="form-group">
                <label><Lock size={14}/> Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="••••••••" required />
              </div>
            )}

            {error && <div className="auth-error"><AlertCircle size={14}/>{error}</div>}
            {success && <div className="auth-success">✅ {success}</div>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>

            {mode === 'login' && (
              <p className="auth-hint">
                Demo: <strong>buyer@demo.com</strong> / buyer123 or <strong>seller@demo.com</strong> / seller123
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
