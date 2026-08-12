import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const IMAGES = [
  { id: 1, src: '/galeria/izquierda.png', alt: 'Disfrutando una tdn burger' },
  { id: 2, src: '/galeria/izquierdaabajo.png', alt: 'Smash bacon cheese combo' },
  { id: 3, src: '/galeria/medio.jpeg', alt: 'Tierra de nadie crew' },
  { id: 4, src: '/galeria/derecha.png', alt: 'Entrada al templo tdn' },
  { id: 5, src: '/galeria/derechaabajo.png', alt: 'Detalle cheddar y panceta' }
];

export default function Galeria() {
  const [activeIndex, setActiveIndex] = useState(null);

  const openLightbox = (index) => {
    setActiveIndex(index);
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  };

  const closeLightbox = () => {
    setActiveIndex(null);
    document.body.style.overflow = ''; // restore scrolling
  };

  const showNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext(e);
      if (e.key === 'ArrowLeft') showPrev(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <section id="galeria" className="galeria-section">
      <div className="galeria-header">
        <span className="galeria-nav-tag">↖ NUESTRO ESPACIO</span>
        <h2 className="galeria-title">GALERÍA VISUAL.</h2>
      </div>

      {/* Asymmetric 3-Column Grid */}
      <div className="galeria-grid">
        {IMAGES.map((img, index) => (
          <div 
            key={img.id} 
            className={`galeria-item item-${index + 1}`}
            onClick={() => openLightbox(index)}
          >
            <img src={img.src} alt={img.alt} className="galeria-img" />
            <div className="galeria-overlay">
              <div className="zoom-icon-wrapper">
                <Maximize2 size={20} className="zoom-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close-btn" onClick={closeLightbox} aria-label="Cerrar galería">
            <X size={28} />
          </button>
          
          <button className="lightbox-nav-btn prev" onClick={showPrev} aria-label="Anterior">
            <ChevronLeft size={36} />
          </button>

          <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <img 
              src={IMAGES[activeIndex].src} 
              alt={IMAGES[activeIndex].alt} 
              className="lightbox-main-img" 
            />
          </div>

          <button className="lightbox-nav-btn next" onClick={showNext} aria-label="Siguiente">
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </section>
  );
}
