import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Nosotros from './components/Nosotros';
import Contacto from './components/Contacto';
import Galeria from './components/Galeria';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Carta from './components/Carta';
import PedidoPage from './components/PedidoPage';
import WhatsappFloat from './components/WhatsappFloat';
import BackToTop from './components/BackToTop';
import useScrollReveal from './hooks/useScrollReveal';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'carta' | 'pedido'
  const [cart, setCart] = useState([]);

  useScrollReveal([loading, currentView]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname + window.location.search + window.location.hash;
      if (path.includes('carta')) {
        setCurrentView('carta');
        setLoading(false);
      } else if (path.includes('pedido')) {
        setCurrentView('pedido');
        setLoading(false);
      } else {
        setCurrentView('home');
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const openCarta = () => {
    setCurrentView('carta');
    setLoading(false);
    if (!window.location.pathname.includes('carta')) {
      window.history.pushState({ view: 'carta' }, '', '/carta');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPedido = () => {
    setCurrentView('pedido');
    setLoading(false);
    if (!window.location.pathname.includes('pedido')) {
      window.history.pushState({ view: 'pedido' }, '', '/pedido');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHome = () => {
    setCurrentView('home');
    if (window.location.pathname !== '/') {
      window.history.pushState({ view: 'home' }, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'carta') {
    return (
      <div className="app-layout loaded">
        <Carta onBack={openHome} onOpenOrder={openPedido} cartCount={cartCount} />
        <WhatsappFloat />
      </div>
    );
  }

  if (currentView === 'pedido') {
    return (
      <div className="app-layout loaded">
        <PedidoPage onBack={openHome} cart={cart} setCart={setCart} />
        <WhatsappFloat />
      </div>
    );
  }

  return (
    <div className={`app-layout ${!loading ? 'loaded' : ''}`}>
      <Preloader onComplete={() => setLoading(false)} />
      <Header 
        onOpenCarta={openCarta} 
        onOpenOrder={openPedido} 
        cartCount={cartCount}
      />
      <div className="hero-container">
        <Hero onOpenCarta={openCarta} onOpenOrder={openPedido} />
      </div>
      {!loading && (
        <>
          <Menu onOpenOrder={openPedido} />
          <Nosotros />
          <Galeria />
          <Contacto />
          <Footer />
        </>
      )}
      <WhatsappFloat />
      <BackToTop />
    </div>
  );
}

export default App;
