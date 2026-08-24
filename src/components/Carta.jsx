import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  ChevronUp,
  Info,
  Check,
  ShoppingCart
} from 'lucide-react';
import useMenuData, { formatPrice } from '../hooks/useMenuData';

export default function Carta({ onBack, onOpenOrder, cartCount = 0 }) {
  const menuData = useMenuData();
  const COMBOS = menuData.combos || [];
  const PAPAS = menuData.papas || [];
  const EXTRAS = menuData.extras || [];
  const SODE_OPTIONS = menuData.bebidas?.gaseosas2L || [];
  const BEERS = menuData.bebidas?.cervezas || [];
  const INDIVIDUAL_DRINKS = menuData.bebidas?.individuales || [];

  const [activeTab, setActiveTab] = useState('hamburguesas');
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    document.title = 'Tierra de Nadie | Nuestra Carta Digital';

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackTop(true);
      } else {
        setShowBackTop(false);
      }

      // Update active nav tab on scroll
      const burgersEl = document.getElementById('sec-hamburguesas');
      const drinksEl = document.getElementById('sec-bebidas');

      if (drinksEl && drinksEl.getBoundingClientRect().top <= 160) {
        setActiveTab('bebidas');
      } else if (burgersEl) {
        setActiveTab('hamburguesas');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.title = 'Tierra de Nadie | Hamburguesería Smash en Orán, Salta';
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const el = document.getElementById(`sec-${id}`);
    if (el) {
      const navH = 70;
      const y = el.getBoundingClientRect().top + window.pageYOffset - navH - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="carta-page-wrapper">
      {/* Header Banner */}
      <header className="carta-hero">
        <div className="carta-top-actions">
          {onBack && (
            <button className="carta-back-btn" onClick={onBack}>
              <ArrowLeft size={18} />
              <span>Volver al Inicio</span>
            </button>
          )}
          {onOpenOrder && (
            <button className="carta-order-btn" onClick={onOpenOrder}>
              <ShoppingCart size={18} />
              <span>PEDIR ONLINE</span>
              {cartCount > 0 && <span className="carta-cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>

        <div className="carta-logo-container">
          <img
            src="/galeria/Logo-tierradn.webp"
            alt="Tierra de Nadie Logo"
            className="carta-logo-img"
          />
        </div>

        <h1 className="carta-main-title">NUESTRA CARTA</h1>

        <div className="carta-divider-flame">
          <span className="line"></span>
          <span className="icon">🔥</span>
          <span className="line"></span>
        </div>
      </header>

      {/* Sticky Category Navbar */}
      <nav className="carta-nav-sticky">
        <button
          className={`carta-nav-tab ${activeTab === 'hamburguesas' ? 'active' : ''}`}
          onClick={() => scrollToSection('hamburguesas')}
        >
          <span className="tab-icon">🍔</span>
          <span>Hamburguesas</span>
        </button>
        <button
          className={`carta-nav-tab ${activeTab === 'bebidas' ? 'active' : ''}`}
          onClick={() => scrollToSection('bebidas')}
        >
          <span className="tab-icon">🥤</span>
          <span>Bebidas</span>
        </button>
      </nav>

      <main className="carta-container-main">

        {/* ================= HAMBURGUESAS SECTION ================= */}
        <section id="sec-hamburguesas" className="carta-section">
          <div className="carta-combos-list">
            {COMBOS.map((combo) => (
              <article key={combo.id} className="carta-combo-card">
                {/* Image & Badges */}
                <div className="carta-combo-media">
                  <div className="combo-image-glow" />
                  <img src={combo.image} alt={combo.name} className="combo-img" />
                  <span className="combo-num-tag">{combo.number}</span>
                  {combo.badge && (
                    <span className={`combo-special-badge ${combo.badge.includes('NUEVO') ? 'new' : ''}`}>
                      {combo.badge}
                    </span>
                  )}
                </div>

                {/* Body details */}
                <div className="carta-combo-content">
                  <div className="carta-combo-top">
                    <h3 className="combo-name">{combo.name}</h3>
                    {combo.papas && (
                      <span className="papas-badge">
                        🍟 PAPAS INCLUIDAS
                      </span>
                    )}
                  </div>

                  {/* Ingredients */}
                  <div className="combo-ingredients-tags">
                    {combo.ingredients.map((ing, idx) => (
                      <span key={idx} className="ing-tag">
                        <Check size={12} className="ing-check-icon" />
                        {ing}
                      </span>
                    ))}
                  </div>

                  {/* Size & Price Grid */}
                  <div className="combo-price-grid">
                    {(combo.sizes || combo.prices || []).map((p, idx) => (
                      <div
                        key={idx}
                        className={`price-item-box ${p.popular ? 'popular' : ''}`}
                      >
                        {p.popular && <span className="popular-subtag">POPULAR</span>}
                        <span className="price-size">{p.name || p.size}</span>
                        <span className="price-val">{formatPrice(p.price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Extra customization option */}
                  {combo.extra && (
                    <div className="combo-extra-row">
                      <div className="extra-info">
                        <Plus size={14} className="extra-plus-icon" />
                        <span>{combo.extra.label}</span>
                      </div>
                      <span className="extra-val">{formatPrice(combo.extra.price)}</span>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {/* PORCIONES DE PAPAS */}
            <div id="sec-papas" className="carta-sub-section">
              <div className="sub-section-head">
                <div className="sub-head-left">
                  <span className="sub-icon">🍟</span>
                  <h3>PORCIONES DE PAPAS</h3>
                </div>
                <span className="sub-tag">100% CROCANTES</span>
              </div>

              <div className="papas-cards-grid">
                {PAPAS.map((papa) => (
                  <div key={papa.id} className={`papa-card ${papa.featured ? 'featured' : ''}`}>
                    {papa.badge && <span className="papa-top-badge">{papa.badge}</span>}
                    <div className="papa-icon-wrap">{papa.icon}</div>
                    <div className="papa-info">
                      <h4>{papa.name}</h4>
                      <p>{papa.desc}</p>
                    </div>
                    <div className="papa-price">{formatPrice(papa.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXTRAS Y AGREGADOS */}
            <div id="sec-extras" className="carta-sub-section">
              <div className="sub-section-head">
                <div className="sub-head-left">
                  <span className="sub-icon">➕</span>
                  <h3>EXTRAS & AGREGADOS</h3>
                </div>
                <span className="sub-tag">PERSONALIZÁ TU BURGER</span>
              </div>

              <div className="extras-cards-grid">
                {EXTRAS.map((ex) => (
                  <div key={ex.id} className="extra-item-card">
                    <div className="extra-icon-box">{ex.icon}</div>
                    <div className="extra-item-details">
                      <span className="extra-item-title">{ex.name}</span>
                      <span className="extra-item-desc">{ex.desc}</span>
                    </div>
                    <span className="extra-item-price">{typeof ex.price === 'number' ? `+$${ex.price.toLocaleString('es-AR')}` : ex.price}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* ================= BEBIDAS SECTION ================= */}
        <section id="sec-bebidas" className="carta-section">
          <div className="carta-section-header">
            <span className="section-badge">🥤 Para Acompañar</span>
            <h2 className="section-title">BEBIDAS</h2>
            <div className="section-title-line" />
          </div>

          {/* Gaseosas 2L */}
          <div className="drinks-group-box">
            <div className="group-title-row">
              <div className="title-with-icon">
                <span>🥤</span>
                <span>GASEOSAS 2 LITROS</span>
              </div>
              <span className="temp-badge">🧊 FRIAS</span>
            </div>

            <div className="gaseosas-featured-card">
              <div className="gaseosas-card-header">
                <div>
                  <h4>GASEOSAS BOTELLA</h4>
                  <p>Formato familiar 2 Litros</p>
                </div>
              </div>

              <div className="gaseosas-grid-list">
                {SODE_OPTIONS.map((soda, idx) => (
                  <div key={idx} className="soda-item-box">
                    <span className="soda-name">{soda.name}</span>
                    <span className="soda-price">{formatPrice(soda.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cervezas */}
          <div className="drinks-group-box">
            <div className="group-title-row">
              <div className="title-with-icon">
                <span>🍺</span>
                <span>CERVEZAS EN LATA</span>
              </div>
              <span className="temp-badge">🍺 473 ML</span>
            </div>

            <div className="beers-cards-grid">
              {BEERS.map((beer) => (
                <div key={beer.id} className="beer-item-card">
                  <div className="beer-icon-wrap">🍺</div>
                  <div className="beer-info">
                    <h4>{beer.name}</h4>
                    <p>{beer.desc}</p>
                  </div>
                  <div className="beer-price">{formatPrice(beer.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vasos y Agua */}
          <div className="drinks-group-box">
            <div className="group-title-row">
              <div className="title-with-icon">
                <span>🥤</span>
                <span>VASOS & AGUA</span>
              </div>
            </div>

            <div className="beers-cards-grid">
              {INDIVIDUAL_DRINKS.map((drink) => (
                <div key={drink.id} className="beer-item-card">
                  <div className="beer-icon-wrap">{drink.icon}</div>
                  <div className="beer-info">
                    <h4>{drink.name}</h4>
                    <p>{drink.desc}</p>
                  </div>
                  <div className="beer-price">{formatPrice(drink.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notice footer */}
          <p className="carta-notice-text">
            <Info size={14} />
            <span>Precios sujetos a modificación sin previo aviso</span>
          </p>
        </section>

      </main>

      {/* Back to top button */}
      <button
        className={`carta-back-top-btn ${showBackTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver arriba"
      >
        <ChevronUp size={22} />
      </button>

      {/* Footer */}
      <footer className="carta-digital-footer">
        <div className="footer-inner-content">
          <img src="/galeria/Logo-tierradn.webp" alt="Tierra de Nadie" className="footer-logo-small" />
          <div className="footer-agency">
            <span>Desarrollado por</span>
            <a href="https://oransoluciones.com/" target="_blank" rel="noopener noreferrer">
              Oran Soluciones
            </a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Tierra de Nadie. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
