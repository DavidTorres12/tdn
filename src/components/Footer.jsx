import React from 'react';

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Main Columns Grid */}
        <div className="footer-grid">
          {/* Column 1 - Brand Info */}
          <div className="footer-col brand-col">
            <h2 className="footer-brand-title">TIERRA DE NADIE™</h2>
            <p className="footer-brand-desc">
              Hamburguesas smash de autor. Ingredientes reales. Un sabor que no vas a olvidar.
            </p>
          </div>

          {/* Column 2 - Navigation */}
          <div className="footer-col links-col">
            <h3>NAVEGACIÓN</h3>
            <ul className="footer-links-list">
              <li><a href="#menu">Menú</a></li>
              <li><a href="#nosotros">Nosotros</a></li>
              <li><a href="#faq-contacto">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3 - Schedule */}
          <div className="footer-col schedule-col">
            <h3>DÍAS Y HORARIOS</h3>
            <p className="schedule-text">
              Jueves a Martes 21:30–01:00 hs
            </p>
            <p className="schedule-location">
              Orán • Salta • Argentina
            </p>
          </div>

          {/* Column 4 - Socials */}
          <div className="footer-col social-col">
            <h3>SEGUINOS</h3>
            <div className="footer-social-icons">
              <a
                href="https://www.instagram.com/tierradenadie25/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="footer-social-icon-btn"
              >
                <InstagramIcon size={22} />
              </a>
              <a
                href="https://www.facebook.com/tdnoran/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="footer-social-icon-btn"
              >
                <FacebookIcon size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Separator line */}
        <hr className="footer-divider" />

        {/* Bottom copyright & author info */}
        <div className="footer-bottom">
          <p className="footer-copyright-text">
            © {currentYear} TDN • Todos los derechos reservados.
          </p>
          <p className="footer-creator">
            CREADO POR: <a href="https://oransoluciones.com/" target="_blank" rel="noopener noreferrer">ORAN SOLUCIONES</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
