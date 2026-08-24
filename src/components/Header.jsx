import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ArrowRight } from 'lucide-react';

const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Header({ onOpenCarta, onOpenOrder, cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll class to header for a premium sticky glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleMenuClick = (e, targetHash) => {
    if (onOpenCarta && targetHash === '#menu') {
      e.preventDefault();
      setIsOpen(false);
      onOpenCarta();
    }
  };

  const handleOrderClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onOpenOrder) onOpenOrder();
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <a href="#" className="logo-brand animate-fade-in">
            <img
              src="/galeria/logo.webp"
              alt="Tierra de Nadie Toro Logo"
              className="header-logo-img"
              width="40"
              height="40"
            />
            <span className="logo-text">TDN</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a
              href="#menu"
              className="nav-link animate-fade-in-down delay-100"
              onClick={(e) => handleMenuClick(e, '#menu')}
            >
              Carta
            </a>
            <a href="#nosotros" className="nav-link animate-fade-in-down delay-200">Nosotros</a>

            <a href="#galeria" className="nav-link animate-fade-in-down delay-400">Galeria</a>
            <a href="#faq-contacto" className="nav-link animate-fade-in-down delay-300">FAQ</a>
            <button
              type="button"
              className="nav-link highlight animate-fade-in-down delay-500"
              onClick={handleOrderClick}
            >
              PEDIR ONLINE
            </button>
          </nav>

          {/* Right side actions */}
          <div className="header-actions animate-fade-in delay-300">
            <button className="cart-btn" aria-label="Carrito de compras" onClick={handleOrderClick}>
              <ShoppingCart size={22} className="cart-icon" />
              <span className={`cart-badge ${cartCount > 0 ? 'active-badge' : ''}`}>{cartCount}</span>
            </button>

            <button
              className={`mobile-menu-btn ${isOpen ? 'active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu principal"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer (Sibling outside header) */}
      <div className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="drawer-brand-wrapper">
            <img
              src="/galeria/logo.webp"
              alt="TDN Logo"
              className="drawer-logo-img"
              width="32"
              height="32"
            />
            <span className="drawer-logo-text">TDN BURGER</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav-links">
          <a
            href="#menu"
            className="mobile-nav-link"
            onClick={(e) => handleMenuClick(e, '#menu')}
          >
            <span className="link-num">01</span>
            <span className="link-text">MENÚ / CARTA</span>
          </a>
          <a href="#nosotros" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
            <span className="link-num">02</span>
            <span className="link-text">NOSOTROS</span>
          </a>
          <a href="#faq-contacto" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
            <span className="link-num">03</span>
            <span className="link-text">FAQ</span>
          </a>
          <a href="#galeria" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
            <span className="link-num">04</span>
            <span className="link-text">GALERÍA</span>
          </a>
          <button
            type="button"
            className="mobile-nav-link highlight"
            onClick={handleOrderClick}
          >
            PEDIR ONLINE
          </button>
        </nav>

        <div className="mobile-drawer-footer">
          <div className="drawer-social-label">
            <span>SEGUINOS</span>
            <ArrowRight size={15} className="drawer-social-arrow" />
          </div>
          <div className="drawer-socials">
            <a
              href="https://www.instagram.com/tierradenadie25/"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-social-link"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="https://www.facebook.com/tdnoran/"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-social-link"
              aria-label="Facebook"
            >
              <FacebookIcon size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for closing menu */}
      <div
        className={`mobile-backdrop ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}
