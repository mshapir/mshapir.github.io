import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        {/* No alt text on hero image */}
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop" className="hero-image" />
        <div className="hero-overlay">
          {/* Div instead of h1 for heading */}
          <div className="hero-title">About AccessFlow</div>
          <div className="hero-subtitle">Your trusted e-commerce partner</div>
        </div>
      </div>

      <div className="about-content">
        {/* Wrong heading hierarchy - skipping h2, using divs */}
        <div className="section-title">Our Story</div>
        <div className="text-content">
          {/* Low contrast text */}
          <span style={{ color: '#999' }}>
            Founded in 2024, AccessFlow has been dedicated to providing quality products to our customers. 
            We believe in innovation, customer satisfaction, and building a better shopping experience for everyone.
          </span>
        </div>

        {/* Image without alt text */}
        <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop" className="content-image" />

        {/* Div acting as heading instead of proper h3 */}
        <div className="section-title">Meet Our Team</div>
        
        <div className="team-grid">
          {/* Images without alt text, names in divs instead of proper headings */}
          <div className="team-card">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" />
            <div className="team-name">John Smith</div>
            <div className="team-role">CEO</div>
          </div>
          
          <div className="team-card">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" />
            <div className="team-name">Sarah Johnson</div>
            <div className="team-role">CTO</div>
          </div>
          
          <div className="team-card">
            <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop" />
            <div className="team-name">Mike Chen</div>
            <div className="team-role">Designer</div>
          </div>
        </div>

        {/* Div acting as heading */}
        <div className="section-title">Connect With Us</div>
        
        {/* Links without descriptive text or aria-labels, just icons */}
        <div className="social-links">
          {/* onclick on div instead of button/link */}
          <div className="social-icon" onClick={() => window.open('https://twitter.com')}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
          </div>
          
          <div className="social-icon" onClick={() => window.open('https://facebook.com')}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#4267B2">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </div>
          
          <div className="social-icon" onClick={() => window.open('https://instagram.com')}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#E1306C">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className="social-icon" onClick={() => window.open('https://linkedin.com')}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#0077B5">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </div>
        </div>

        {/* Button without proper role or label */}
        <div className="cta-section">
          {/* Div styled as button instead of actual button */}
          <div className="cta-button" onClick={() => alert('Newsletter!')}>
            Subscribe to Newsletter
          </div>
          
          {/* Form without labels */}
          <div className="newsletter-form">
            {/* Input without label */}
            <input type="text" placeholder="Enter your email" className="email-input" />
            {/* Div instead of button */}
            <div className="submit-btn" onClick={() => alert('Subscribed!')}>
              →
            </div>
          </div>
        </div>

        {/* Decorative image without alt (but actually conveying information) */}
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&h=400&fit=crop" className="footer-image" />
        
        {/* Low contrast text */}
        <div style={{ color: '#ccc', backgroundColor: '#fff', padding: '20px', textAlign: 'center' }}>
          © 2024 AccessFlow. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;
