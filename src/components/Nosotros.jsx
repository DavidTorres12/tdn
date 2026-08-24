import React from 'react';

export default function Nosotros() {
  const marqueeText = "✦ ANTOJO REAL ✦ NO SE ADMITEN PLATOS LIMPIOS ✦ PAPAS CROCANTES INCLUIDAS ✦ REAL SMASH ✦ ORAN SALTA ";
  const repeats = Array(4).fill(marqueeText);

  return (
    <section id="nosotros" className="nosotros-section">
      <div className="nosotros-container-grid">
        {/* Left Content */}
        <div className="nosotros-content reveal-on-scroll reveal-left">
          <span className="nosotros-tag">NUESTRA HISTORIA</span>
          <h2 className="nosotros-title">
            SOMOS TDN<span className="nosotros-title-badge">BURGER</span>
          </h2>

          <p className="nosotros-description">
            Nacimos en 2025 con una sola obsesión: hacer la hamburguesa perfecta.
            Sin atajos. Sin ingredientes congelados. Solo carne premium, pan artesanal
            y salsas caseras perfeccionadas durante semanas de pruebas.
          </p>

          <div className="nosotros-stats-grid">
            <div className="nosotros-stat-card reveal-on-scroll reveal-up delay-100">
              <div className="stat-card-glow" />
              <span className="stat-value">5</span>
              <span className="stat-label">Combos Exclusivos</span>
            </div>
            <div className="nosotros-stat-card reveal-on-scroll reveal-up delay-200">
              <div className="stat-card-glow" />
              <span className="stat-value">#1</span>
              <span className="stat-label">Smash en Orán</span>
            </div>
            <div className="nosotros-stat-card reveal-on-scroll reveal-up delay-300">
              <div className="stat-card-glow" />
              <span className="stat-value">100%</span>
              <span className="stat-label">Ingredientes Frescos</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="nosotros-visuals reveal-on-scroll reveal-right delay-200">
          <div className="nosotros-image-wrapper">
            <img
              src="/galeria/nosotros.png"
              alt="Nuestra Hamburguesa Insignia"
              className="nosotros-burger-image"
            />
          </div>
        </div>
      </div>

      {/* Bottom Marquee Ribbon */}
      <div className="nosotros-marquee-ribbon reveal-on-scroll reveal-up delay-150">
        <div className="nosotros-marquee-content">
          {repeats.map((text, idx) => (
            <span key={idx} className="marquee-text-item">{text}</span>
          ))}
          {/* Duplicate set for seamless looping */}
          {repeats.map((text, idx) => (
            <span key={`dup-${idx}`} className="marquee-text-item">{text}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
