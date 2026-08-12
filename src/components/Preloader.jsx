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
      <div className="preloader-content">
        {/* Pulsing Logo */}
        <div className="preloader-logo-wrapper">
          <img 
            src="/galeria/Logo-tierradn.webp" 
            alt="Tierra de Nadie Logo" 
            className="preloader-logo" 
          />
        </div>
        
        {/* Minimalist Progress Bar */}
        <div className="preloader-progress-container">
          <div 
            className="preloader-progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
