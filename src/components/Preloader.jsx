import React, { useEffect, useState } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Increment progress bar over 2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // 20ms * 100 = 2000ms (2 seconds)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Start fade out sequence
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 300); // short pause at 100%

      // Trigger completion callback after slide animation finishes
      const completeTimeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1100); // 300ms pause + 800ms slide-up duration

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [progress, onComplete]);

  return (
    <div className={`preloader-overlay ${isFadingOut ? 'fade-out-slide' : ''}`}>
      {/* Glow ambiental de fondo */}
      <div className="preloader-ambient-glow" />

      <div className={`preloader-content ${isFadingOut ? 'content-exit' : ''}`}>
        {/* Logo con resplandor suave */}
        <div className="preloader-logo-wrapper">
          <img 
            src="/galeria/Logo-tierradn.webp" 
            alt="Tierra de Nadie Logo" 
            className="preloader-logo"
            width="245"
            height="142"
            fetchPriority="high"
            decoding="async" 
          />
        </div>
        
        {/* Barra de progreso y contador dinámico % */}
        <div className="preloader-status-wrapper">
          <div className="preloader-progress-container">
            <div 
              className="preloader-progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="preloader-percentage-container">
            <span className="preloader-status-label">PREPARANDO ANTOJO</span>
            <span className="preloader-counter">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

