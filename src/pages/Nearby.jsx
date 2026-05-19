import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search, Navigation, Store, Phone, Clock, Package, ExternalLink } from 'lucide-react';
import api from '../api';
import './Nearby.css';

export default function Nearby() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get('q')) handleSearch();
  }, []);

  const getLocation = () => {
    setLocating(true); setLocError('');
    if (!navigator.geolocation) { setLocError('Geolocation not supported by your browser'); setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => { setLocError('Location access denied. Results will not be distance-sorted.'); setLocating(false); }
    );
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true); setSearched(true);
    try {
      const params = { q: query };
      if (location) { params.lat = location.lat; params.lng = location.lng; }
      const res = await api.get('/products/nearby-stores', { params });
      setStores(res.data);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="nearby-page page-enter">
      <div className="nearby-hero">
        <h1><MapPin size={32}/> Find Stores Near You</h1>
        <p>Search for a product and discover local stores where you can buy it today — no delivery wait!</p>

        <form onSubmit={handleSearch} className="nearby-search">
          <div className="search-input-wrap">
            <Search size={18}/>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search product, category, brand..."
            />
          </div>
          <button type="button" onClick={getLocation} className="btn btn-outline locate-btn" disabled={locating}>
            <Navigation size={16}/> {locating ? 'Getting location...' : location ? 'Location Set ✓' : 'Use My Location'}
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Find Stores'}
          </button>
        </form>

        {locError && <p className="loc-error">⚠️ {locError}</p>}
        {location && <p className="loc-success">📍 Location detected — showing nearest stores first</p>}
      </div>

      <div className="nearby-results">
        {!searched && (
          <div className="nearby-intro">
            <div className="intro-cards">
              <div className="intro-card"><span>🔍</span><h3>Search</h3><p>Enter a product name or category above</p></div>
              <div className="intro-card"><span>📍</span><h3>Locate</h3><p>Allow location to sort by distance</p></div>
              <div className="intro-card"><span>🚶</span><h3>Visit</h3><p>Walk into the store and buy it today!</p></div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-center">
            <div className="spinner"/>
            <p>Finding stores...</p>
          </div>
        )}

        {searched && !loading && stores.length === 0 && (
          <div className="empty-state">
            <span>🏪</span>
            <h3>No stores found</h3>
            <p>Try a different search term or check back later</p>
          </div>
        )}

        {stores.length > 0 && (
          <>
            <div className="results-header">
              <h2>{stores.length} store{stores.length !== 1 ? 's' : ''} found{query ? ` for "${query}"` : ''}</h2>
              {location && <span className="badge badge-primary">Sorted by distance</span>}
            </div>
            <div className="stores-list">
              {stores.map((store, i) => (
                <div key={i} className="store-card card">
                  <div className="store-card-header">
                    <div className="store-icon"><Store size={24}/></div>
                    <div>
                      <h3>{store.store_name}</h3>
                      <div className="store-location"><MapPin size={13}/>{store.city}, {store.state}</div>
                    </div>
                    {store.distance_km && (
                      <div className="distance-badge">
                        <Navigation size={14}/> {store.distance_km} km
                      </div>
                    )}
                  </div>

                  <div className="store-card-body">
                    <div className="store-contact">
                      <div><MapPin size={13}/> {store.address}</div>
                      {store.phone && <div><Phone size={13}/> {store.phone}</div>}
                      {store.hours && <div><Clock size={13}/> {store.hours}</div>}
                    </div>

                    <div className="store-product">
                      <img src={store.image_url || 'https://placehold.co/80x80?text=P'} alt={store.product_name}/>
                      <div>
                        <div className="product-in-store-name">{store.product_name}</div>
                        <div className="product-in-store-price">₹{store.price?.toLocaleString('en-IN')}</div>
                        <span className="badge badge-success"><Package size={10}/> In Stock</span>
                      </div>
                    </div>
                  </div>

                  <div className="store-card-actions">
                    {store.lat && store.lng && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        <MapPin size={14}/> Get Directions
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.store_name + ' ' + store.city)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      <ExternalLink size={14}/> View on Maps
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
