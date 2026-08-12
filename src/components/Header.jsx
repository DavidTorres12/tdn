import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

export default function Header() {
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

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <a href="#" className="logo-text animate-fade-in">
          TIERRA DE NADIE
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="#menu" className="nav-link animate-fade-in-down delay-100">Menu</a>
          <a href="#nosotros" className="nav-link animate-fade-in-down delay-200">Nosotros</a>
          <a href="#faq-contacto" className="nav-link animate-fade-in-down delay-300">FAQ</a>
          <a href="#galeria" className="nav-link animate-fade-in-down delay-400">Galeria</a>
          <a href="#pedir" className="nav-link highlight animate-fade-in-down delay-500">PEDIR ONLINE</a>
        </nav>

        {/* Right side actions */}
        <div className="header-actions animate-fade-in delay-300">
          <button className="cart-btn" aria-label="Carrito de compras">
            <ShoppingCart size={22} className="cart-icon" />
            <span className="cart-badge">0</span>
          </button>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu principal"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer glass-effect ${isOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <a href="#menu" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Menu</a>
          <a href="#nosotros" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Nosotros</a>
          <a href="#faq-contacto" className="mobile-nav-link" onClick={() => setIsOpen(false)}>FAQ</a>
          <a href="#galeria" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Galeria</a>
          <a href="#pedir" className="mobile-nav-link highlight" onClick={() => setIsOpen(false)}>PEDIR ONLINE</a>
        </nav>
      </div>
    </header>
  );
}
