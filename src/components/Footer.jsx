import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <div className="footer-logo">🛍️ Shop<span>Nearby</span></div>
          <p>Find products online and buy them in your local store. Skip the delivery wait!</p>
          <div className="footer-contact-quick">
            <a href="mailto:support@shopnearby.com"><Mail size={14}/> support@shopnearby.com</a>
            <a href="tel:+919876543210"><Phone size={14}/> +91 98765 43210</a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"><MessageCircle size={14}/> WhatsApp Us</a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/nearby">Find Nearby Stores</Link>
          <Link to="/login">Login / Register</Link>
          <Link to="/contact">Contact Support</Link>
        </div>

        <div className="footer-links">
          <h4>For Sellers</h4>
          <Link to="/login">Seller Login</Link>
          <Link to="/seller/dashboard">Seller Dashboard</Link>
          <Link to="/contact">Report an Issue</Link>
        </div>

        <div className="footer-links">
          <h4>Support Hours</h4>
          <p className="footer-hours">Monday – Saturday</p>
          <p className="footer-hours">9:00 AM – 6:00 PM IST</p>
          <br/>
          <Link to="/contact" className="contact-support-btn">
            📞 Contact Support
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2024 ShopNearby. All rights reserved.</p>
        <p>Need help? <Link to="/contact">Visit our support page</Link> or email <a href="mailto:support@shopnearby.com">support@shopnearby.com</a></p>
      </div>
    </footer>
  );
}
