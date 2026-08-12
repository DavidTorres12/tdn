import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const COMBOS = [
  { id: 1, name: 'Combo 1', image: '/galeria/combo1.png' },
  { id: 2, name: 'Combo 2', image: '/galeria/combo2.png' },
  { id: 3, name: 'Combo 3', image: '/galeria/combo3.png' },
  { id: 4, name: 'Combo 4', image: '/galeria/combo4.png' },
  { id: 5, name: 'Combo 5', image: '/galeria/combo5.png' }
];

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState(1); // default to second burger (center)

  // Swipe support for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < COMBOS.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (isRightSwipe && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < COMBOS.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  // WhatsApp direct link redirect
  const handlePedir = (combo) => {
    const phoneNumber = '5491123456789'; // Placeholder, user will change this
    const message = `Hola Tierra de Nadie! 🍔 Quiero realizar el pedido online del *${combo.name}*.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="menu" className="menu-section">
      <div className="menu-header">
        <span className="menu-nav-tag">↖ COLECCIÓN</span>
        <h2 className="menu-title">NUESTRAS BURGERS.</h2>
      </div>

      {/* 1. Imagen (Carrusel) */}
      <div
        className="slider-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="slider-track"
          style={{
            transform: `translateX(calc(50% - ${activeIndex} * var(--slide-width) - (var(--slide-width) / 2)))`
          }}
        >
          {COMBOS.map((combo, idx) => (
            <div
              key={combo.id}
              className={`slide-item ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="burger-image-wrapper">
                <img
                  src={combo.image}
                  alt={combo.name}
                  className="burger-slide-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Group: Name, Nav, and Button */}
      <div className="active-burger-info">
        {/* 2. Nombre del combo */}
        <h3 className="active-burger-name">
          {COMBOS[activeIndex].name}
        </h3>

        {/* 3. Navegación */}
        <div className="carousel-nav">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="nav-arrow-btn"
            aria-label="Anterior"
          >
            <ArrowLeft size={18} />
          </button>

          <span className="carousel-fraction">
            ({activeIndex + 1}/{COMBOS.length})
          </span>

          <button
            onClick={handleNext}
            disabled={activeIndex === COMBOS.length - 1}
            className="nav-arrow-btn"
            aria-label="Siguiente"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* 4. Botón de pedir */}
        <div className="active-burger-actions">
          <button
            className="btn-menu-pedir"
            onClick={() => handlePedir(COMBOS[activeIndex])}
          >
            PEDIR ONLINE
          </button>
        </div>
      </div>

    </section>
  );
}
