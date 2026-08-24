import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

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

const FAQS = [
  {
    pregunta: "¿Cuáles son sus días y horarios de atención?",
    respuesta: "Abrimos de Jueves a Martes de 21:30 a 01:00 am. Los días miércoles permanecemos cerrados."
  },
  {
    pregunta: "¿Cómo hago para realizar mi pedido?",
    respuesta: "Seleccioná tus combos favoritos en el menú interactivo, elegí el tamaño (Simple, Doble, Triple o Cuádruple), agregá los extras que quieras y presioná 'Enviar Pedido por WhatsApp'. ¡Te atenderemos de inmediato!"
  },
  {
    pregunta: "¿Tienen envío a domicilio (Delivery)?",
    respuesta: "¡Sí! Realizamos envíos a todo Orán. Al enviar tu pedido por WhatsApp podés seleccionar si querés recibirlo en tu domicilio o retirarlo por nuestro local en O'Higgins 170."
  },
  {
    pregunta: "¿Los combos incluyen papas?",
    respuesta: "¡Sí! Todos nuestros combos de hamburguesas vienen acompañados de su porción de papas fritas 100% crocantes."
  }
];

export default function Contacto() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-contacto" className="contacto-section">
      <div className="contacto-container">
        {/* Left Column - FAQ */}
        <div className="contacto-faq-col reveal-on-scroll reveal-left">
          <span className="contacto-tag">↖ DUDAS FRECUENTES</span>
          <h2 className="contacto-title">FAQ.</h2>

          <div className="faq-list">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'active' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.pregunta}</span>
                    <ChevronDown className={`faq-chevron ${isOpen ? 'rotate' : ''}`} size={20} />
                  </button>
                  <div className="faq-answer-container">
                    <div className="faq-answer-content">
                      <p>{faq.respuesta}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Location & Socials */}
        <div className="contacto-info-col reveal-on-scroll reveal-right delay-200">
          <span className="contacto-tag">↖ UBICACIÓN Y REDES</span>
          <h2 className="contacto-title">VISITANOS.</h2>

          <div className="contacto-details-card glass-effect">
            <div className="info-item">
              <div className="info-icon-wrapper">
                <MapPin size={22} className="info-icon" />
              </div>
              <div className="info-text">
                <h3>NUESTRA DIRECCIÓN</h3>
                <p>O'Higgins 170, Oran, Salta.</p>
              </div>
            </div>




            {/* Google Maps Iframe */}
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.8559676577775!2d-64.32561892722954!3d-23.138939379092363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x940ff5000a306b27%3A0x4b58b382ddfc89dc!2sTierra%20de%20Nadie-%20Patio%20de%20Hamburguesas!5e0!3m2!1ses!2sar!4v1786549471126!5m2!1ses!2sar"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Tierra de Nadie ubicación en Google Maps"
              ></iframe>
            </div>

            {/* Social Media Links */}
            <div className="social-links-container">
              <h3>SEGUINOS EN NUESTRAS REDES</h3>
              <div className="social-buttons">
                <a
                  href="https://www.instagram.com/tierradenadie25/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn instagram-btn"
                >
                  <InstagramIcon size={18} />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/tdnoran/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn facebook-btn"
                >
                  <FacebookIcon size={18} />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
