import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, MapPin, Sliders } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../api';
import './Home.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Kitchen', 'Bags', 'Accessories', 'Books', 'Sports', 'Toys', 'Beauty'];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || '',
    available_instore: searchParams.get('available_instore') || '',
    page: searchParams.get('page') || 1,
  });

  useEffect(() => {
    api.get('/products/categories').then(r => {
      setCategories(r.data.categories);
      setBrands(r.data.brands);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v));
      const res = await api.get('/products', { params });
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {}
    setLoading(false);
  };

  const setFilter = (key, value) => {
    setFilters(p => ({ ...p, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ q: '', category: '', brand: '', min_price: '', max_price: '', sort: '', available_instore: '', page: 1 });
  };

  const activeFilterCount = [filters.category, filters.brand, filters.min_price, filters.max_price, filters.available_instore, filters.sort].filter(Boolean).length;

  return (
    <div className="home-page page-enter">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Find It Online.<br/><span className="hero-accent">Buy It Near You.</span></h1>
          <p>Search products & discover where to buy them in your local stores — skip the wait, shop today!</p>
          <div className="hero-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for phones, clothes, gadgets..."
              value={filters.q}
              onChange={e => setFilter('q', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchProducts()}
            />
            <button className="btn btn-primary" onClick={fetchProducts}>Search</button>
          </div>
          <Link to="/nearby" className="nearby-hero-btn">
            <MapPin size={16}/> Find Stores Near Me
          </Link>
        </div>
        <div className="hero-visual">
          <div className="hero-stat"><span>🛍️</span><strong>--</strong> Products</div>
          <div className="hero-stat"><span>🏪</span><strong>--</strong> Local Stores</div>
          <div className="hero-stat"><span>⚡</span><strong>Same Day</strong> Pickup</div>
        </div>
      </div>

      {/* Category chips */}
      <div className="shop-layout">
        <div className="category-chips">
          <button className={`chip ${!filters.category ? 'chip-active' : ''}`} onClick={() => setFilter('category', '')}>All</button>
          {categories.map(c => (
            <button key={c} className={`chip ${filters.category === c ? 'chip-active' : ''}`} onClick={() => setFilter('category', c)}>{c}</button>
          ))}
        </div>

        <div className="shop-toolbar">
          <div className="results-info">
            {loading ? 'Searching...' : `${total} product${total !== 1 ? 's' : ''} found`}
            {filters.q && <span className="search-term">for "{filters.q}"</span>}
          </div>
          <div className="toolbar-right">
            <label className="instore-toggle">
              <input type="checkbox" checked={filters.available_instore === '1'}
                onChange={e => setFilter('available_instore', e.target.checked ? '1' : '')} />
              <span>In-Store Only</span>
            </label>
            <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)} className="sort-select">
              <option value="">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
            <button className="filter-toggle-btn" onClick={() => setShowFilters(p => !p)}>
              <Sliders size={16}/> Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel card">
            <div className="filter-header">
              <h3><Filter size={16}/> Filters</h3>
              <button onClick={clearFilters} className="btn btn-ghost"><X size={14}/> Clear All</button>
            </div>
            <div className="filter-grid">
              <div className="filter-group">
                <label>Category</label>
                <select value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Brand</label>
                <select value={filters.brand} onChange={e => setFilter('brand', e.target.value)}>
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Min Price (₹)</label>
                <input type="number" value={filters.min_price} onChange={e => setFilter('min_price', e.target.value)} placeholder="0" className="filter-input" />
              </div>
              <div className="filter-group">
                <label>Max Price (₹)</label>
                <input type="number" value={filters.max_price} onChange={e => setFilter('max_price', e.target.value)} placeholder="999999" className="filter-input" />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <span>🔍</span>
            <h3>No products found</h3>
            <p>Try different keywords or <button onClick={clearFilters}>clear filters</button></p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            {[...Array(pages)].map((_, i) => (
              <button key={i} className={`page-btn ${filters.page == i+1 ? 'page-active' : ''}`}
                onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
