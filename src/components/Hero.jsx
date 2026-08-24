import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

export default function Hero({ onOpenCarta, onOpenOrder }) {
  return (
    <section className="hero-section">
      <div className="hero-grid">

        {/* Left Side: Copy and Call to Actions */}
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in-up delay-100">
            <span className="hero-title-top-row">TDN</span>
            <span className="hero-title-bottom-row">BURGER</span>
          </h1>

          <div className="hero-slogan-container animate-fade-in-up delay-200">
            <h2 className="hero-slogan-line">ANTOJO REAL.</h2>
            <h2 className="hero-slogan-line">SIN FILTROS.</h2>
          </div>

          <div className="hero-actions-container animate-fade-in-up delay-300">
            <button onClick={onOpenCarta} className="btn-outline">
              VER CARTA
            </button>
            <button onClick={onOpenOrder} className="btn-primary">
              PEDIR ONLINE <ArrowRight size={18} className="btn-icon" />
            </button>
          </div>

          <p className="hero-footer-text animate-fade-in-up delay-400">
            CALIDAD NO NEGOCIABLE
          </p>
        </div>

        {/* Right Side: Review Badge */}
        <div className="hero-visuals">

          {/* Review Badge */}
          <div className="review-badge animate-scale-in delay-500">
            <div className="review-badge-glow" />
            <div className="rating-header">
              <span className="rating-tag">CALIFICACIÓN</span>
            </div>
            <div className="rating-score-wrapper">
              <span className="rating-score">9.5</span>
              <span className="rating-max">/10</span>
            </div>
            <div className="rating-details">
              <div className="rating-stars">
                <Star size={15} className="star-filled" />
                <Star size={15} className="star-filled" />
                <Star size={15} className="star-filled" />
                <Star size={15} className="star-filled" />
                <Star size={15} className="star-filled" />
              </div>
              <span className="rating-label">REVIEWS</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
