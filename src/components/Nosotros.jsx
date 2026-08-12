import React from 'react';

export default function Nosotros() {
  const marqueeText = "✦ ANTOJO REAL ✦ REAL SMASH ✦ NO SE ADMITEN PLATOS LIMPIOS ✦ PAPAS CROCANTES INCLUIDAS ✦ ORAN SALTA ";
  const repeats = Array(4).fill(marqueeText);

  return (
    <section id="nosotros" className="nosotros-section">
      <div className="nosotros-container-grid">
        {/* Left Content */}
        <div className="nosotros-content">
          <span className="nosotros-tag">NUESTRA HISTORIA</span>
          <h2 className="nosotros-title">SOMOS TDN™</h2>

          <p className="nosotros-description">
            Nacimos en 2025 con una sola obsesión: hacer la hamburguesa perfecta.
            Sin atajos. Sin ingredientes congelados. Solo carne premium, pan artesanal
            y salsas caseras perfeccionadas durante semanas de pruebas.
          </p>

          <div className="nosotros-stats-grid">
            <div className="nosotros-stat-item">
              <span className="stat-value">5+</span>
              <span className="stat-label">Hamburguesas únicas</span>
            </div>
            <div className="nosotros-stat-item">
              <span className="stat-value">4</span>
              <span className="stat-label">Locales</span>
            </div>
            <div className="nosotros-stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Ingredientes frescos</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="nosotros-visuals">
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
      <div className="nosotros-marquee-ribbon">
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
