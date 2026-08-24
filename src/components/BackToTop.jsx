import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`carta-back-top-btn ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <ChevronUp size={22} />
    </button>
  );
}
