import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Nosotros from './components/Nosotros';
import Contacto from './components/Contacto';
import Galeria from './components/Galeria';
import Footer from './components/Footer';
import Preloader from './components/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      <div className={`hero-container ${!loading ? 'loaded' : ''}`}>
        <Header />
        <Hero />
      </div>
      {!loading && (
        <>
          <Menu />
          <Nosotros />
          <Galeria />
          <Contacto />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
