import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="contact-page page-enter">

      {/* Hero */}
      <div className="contact-hero">
        <h1>We're Here to Help 👋</h1>
        <p>Having trouble with the website? Can't find a product? We respond within 24 hours.</p>
      </div>

      <div className="contact-container">

        {/* Contact Cards */}
        <div className="contact-cards">

          <div className="contact-card card">
            <div className="contact-card-icon" style={{ background: '#fff4ef' }}>
              <Mail size={28} color="#FF6B35" />
            </div>
            <h3>Email Us</h3>
            <p>Send us an email anytime. We reply within 24 hours.</p>
            <a href="mailto:support@shopnearby.com" className="contact-link">
              support@shopnearby.com
            </a>
          </div>

          <div className="contact-card card">
            <div className="contact-card-icon" style={{ background: '#f0fdf4' }}>
              <Phone size={28} color="#10b981" />
            </div>
            <h3>Call Us</h3>
            <p>Available Monday to Saturday, 9AM to 6PM IST.</p>
            <a href="tel:+919876543210" className="contact-link">
              +91 98765 43210
            </a>
          </div>

          <div className="contact-card card">
            <div className="contact-card-icon" style={{ background: '#eff6ff' }}>
              <MessageCircle size={28} color="#3b82f6" />
            </div>
            <h3>WhatsApp</h3>
            <p>Chat with us directly on WhatsApp for quick help.</p>
            <a
              href="https://wa.me/919876543210?text=Hi, I need help with ShopNearby"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="contact-card card">
            <div className="contact-card-icon" style={{ background: '#fdf4ff' }}>
              <Clock size={28} color="#a855f7" />
            </div>
            <h3>Support Hours</h3>
            <p>Monday – Saturday</p>
            <span className="contact-link">9:00 AM – 6:00 PM IST</span>
          </div>

        </div>

        {/* Contact Form + Info */}
        <div className="contact-grid">

          {/* Form */}
          <div className="contact-form-wrap card">
            <h2>Send Us a Message</h2>
            <p className="form-subtitle">Fill the form below and we will get back to you as soon as possible.</p>

            {submitted ? (
              <div className="success-message">
                <CheckCircle size={48} color="#10b981" />
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Our team will reply to <strong>{form.email}</strong> within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <select value={form.subject} onChange={set('subject')} required>
                    <option value="">Select a subject...</option>
                    <option value="order">Problem with my Order</option>
                    <option value="product">Product not found</option>
                    <option value="store">Store / Seller issue</option>
                    <option value="account">Account / Login problem</option>
                    <option value="payment">Payment issue</option>
                    <option value="website">Website error / Bug</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Describe your issue or question in detail..."
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="faq-wrap">
            <h2>Common Questions</h2>
            <div className="faq-list">
              {[
                {
                  q: 'Why are no products showing on the home page?',
                  a: 'Products are added by sellers. If no sellers have registered in your area yet, the list may be empty. Try searching by category or brand.'
                },
                {
                  q: 'How do I find stores near me?',
                  a: 'Click the "Find Nearby" button, allow location access, search for a product and we will show stores near you sorted by distance.'
                },
                {
                  q: 'How do I sell my products on ShopNearby?',
                  a: 'Register as a Seller, create your store with your address, then add your products. Buyers can find your store online and visit in person.'
                },
                {
                  q: 'I cannot login to my account. What do I do?',
                  a: 'Make sure you are using the correct email and password. If you forgot your password, contact us and we will help reset it manually.'
                },
                {
                  q: 'Is ShopNearby free to use?',
                  a: 'Yes! ShopNearby is completely free for both buyers and sellers. No hidden charges.'
                },
                {
                  q: 'How do I report a wrong store address?',
                  a: 'Use the contact form on this page and select "Store / Seller issue". We will investigate and fix it within 24 hours.'
                },
              ].map((item, i) => (
                <div key={i} className="faq-item card">
                  <h4>❓ {item.q}</h4>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="contact-banner card">
          <div>
            <h3>Still need help?</h3>
            <p>Our support team is available 6 days a week to assist you.</p>
          </div>
          <div className="banner-actions">
            <a href="mailto:support@shopnearby.com" className="btn btn-primary">
              <Mail size={16} /> Email Support
            </a>
            <a href="https://wa.me/919876543210?text=Hi, I need help with ShopNearby" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <MessageCircle size={16} /> WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
