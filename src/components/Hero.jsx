import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-grid">

        {/* Left Side: Copy and Call to Actions */}
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in-up delay-100">TDN BURGER</h1>

          <div className="hero-slogan-container animate-fade-in-up delay-200">
            <h2 className="hero-slogan-line">ANTOJO REAL.</h2>
            <h2 className="hero-slogan-line">SIN FILTROS.</h2>
          </div>

          <div className="hero-actions-container animate-fade-in-up delay-300">
            <a href="#menu" className="btn-outline">
              VER CARTA
            </a>
            <a href="#pedir" className="btn-primary">
              PEDIR ONLINE <ArrowRight size={18} className="btn-icon" />
            </a>
          </div>

          <p className="hero-footer-text animate-fade-in-up delay-400">
            CALIDAD NO NEGOCIABLE
          </p>
        </div>

        {/* Right Side: Review Badge */}
        <div className="hero-visuals">

          {/* Review Badge */}
          <div className="review-badge glass-effect animate-scale-in delay-500">
            <div className="rating-score">9.5</div>
            <div className="rating-details">
              <div className="rating-stars">
                <Star size={14} className="star-filled" />
                <Star size={14} className="star-filled" />
                <Star size={14} className="star-filled" />
                <Star size={14} className="star-filled" />
                <Star size={14} className="star-empty" />
              </div>
              <div className="rating-label">Review</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
