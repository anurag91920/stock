// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaGithub, FaChartLine } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer" role="contentinfo" aria-label="Website footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-column footer-about">
            <Link to="/" className="footer-logo" aria-label="Stock Analyzer Home">
              <FaChartLine aria-hidden="true" />
              <span>Stock Analyzer</span>
            </Link>
            <p className="footer-description">
              Your one-stop solution for stock market analysis, news, and
              data-driven insights.
            </p>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/watchlist" className="footer-link">Watchlist</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Connect With Us</h3>
            <p className="footer-text">Follow us on social media for updates</p>
            <div className="social-links">
              <a 
                href="https://twitter.com/stockanalyzer" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter" 
                className="social-link"
              >
                <FaTwitter aria-hidden="true" />
              </a>
              <a 
                href="https://linkedin.com/company/stockanalyzer" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="social-link"
              >
                <FaLinkedin aria-hidden="true" />
              </a>
              <a 
                href="https://github.com/stockanalyzer" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub" 
                className="social-link"
              >
                <FaGithub aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Get In Touch</h3>
            <ul className="footer-links">
              <li><a href="mailto:support@stockanalyzer.com" className="footer-link">support@stockanalyzer.com</a></li>
              <li className="footer-text">123 Stock Street</li>
              <li className="footer-text">New York, NY 10001</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Stock Analyzer. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
            <span className="footer-legal-separator">•</span>
            <Link to="/terms" className="footer-legal-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
