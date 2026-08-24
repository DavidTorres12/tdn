import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import useMenuData from '../hooks/useMenuData';

const WHATSAPP_PHONE_NUMBER = "543878302896";

export default function PedidoModal({ isOpen, onClose, cart = [], setCart }) {
  const menuData = useMenuData();

  const COMBOS_DATA = (menuData.combos || []).map((combo) => ({
    ...combo,
    ingredients: Array.isArray(combo.ingredients) ? combo.ingredients.join(', ') : combo.ingredients
  }));
  const EXTRAS_OPTIONS = menuData.extras || [];
  const PAPAS_DATA = menuData.papas || [];
  const DRINKS_DATA = [
    ...(menuData.bebidas?.gaseosas2L || []),
    ...(menuData.bebidas?.cervezas || []),
    ...(menuData.bebidas?.individuales || [])
  ];

  // Step state: 1 = Elegir comida, 2 = Carrito/Resumen, 3 = Datos de Envío
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('combos'); // 'combos' | 'papas' | 'bebidas'

  // Selected combo builder state
  const [selectedComboId, setSelectedComboId] = useState('combo-1');
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // default 'Doble'
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [comboQuantity, setComboQuantity] = useState(1);
  const [showExtrasAccordion, setShowExtrasAccordion] = useState(false);
  const [itemAddedToast, setItemAddedToast] = useState(false);

  // Customer checkout details
  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' | 'retiro'
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo'); // 'efectivo' | 'transferencia' | 'mercadopago'
  const [notes, setNotes] = useState('');

  // Micro-confirmation animation state
  const [isSendingOrder, setIsSendingOrder] = useState(false);

  if (!isOpen) return null;

  const currentCombo = COMBOS_DATA.find(c => c.id === selectedComboId) || COMBOS_DATA[0] || { id: 'combo-1', name: 'Combo', image: '', sizes: [{ name: 'Simple', price: 0 }] };
  const currentSizes = currentCombo?.sizes || [{ name: 'Simple', price: 0 }];
  const currentSize = currentSizes[selectedSizeIndex] || currentSizes[0] || { name: 'Simple', price: 0 };

  const handleToggleExtra = (extraId) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };

  const calculateComboItemPrice = () => {
    let base = currentSize.price;
    selectedExtras.forEach(eId => {
      const opt = EXTRAS_OPTIONS.find(o => o.id === eId);
      if (opt) base += opt.price;
    });
    return base;
  };

  const showAddedNotification = () => {
    setItemAddedToast(true);
    setTimeout(() => setItemAddedToast(false), 2000);
  };

  const handleAddComboToCart = () => {
    const extrasObjs = selectedExtras.map(eId => EXTRAS_OPTIONS.find(o => o.id === eId)).filter(Boolean);
    const itemPrice = calculateComboItemPrice();

    const newItem = {
      cartItemId: Date.now() + Math.random(),
      type: 'combo',
      title: `${currentCombo.name} (${currentSize.name})`,
      unitPrice: itemPrice,
      quantity: comboQuantity,
      extras: extrasObjs
    };

    setCart([...cart, newItem]);
    setSelectedExtras([]);
    setComboQuantity(1);
    showAddedNotification();
  };

  const handleAddSimpleItemToCart = (title, price) => {
    const existingIndex = cart.findIndex(item => item.title === title && (!item.extras || item.extras.length === 0));
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          cartItemId: Date.now() + Math.random(),
          type: 'item',
          title: title,
          unitPrice: price,
          quantity: 1,
          extras: []
        }
      ]);
    }
    showAddedNotification();
  };

  const handleUpdateQuantity = (cartItemId, delta) => {
    setCart(cart.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleRemoveItem = (cartItemId) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
  };

  const DELIVERY_FEE = 3000;
  const totalCartPrice = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalCartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCost = deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const finalTotal = totalCartPrice + shippingCost;

  const formatCurrency = (val) => `$${val.toLocaleString('es-AR')}`;

  const handleSendWhatsAppOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    if (!customerName.trim()) {
      alert("Por favor ingresá tu nombre.");
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      alert("Por favor ingresá la dirección de entrega.");
      return;
    }

    // Trigger micro-confirmation feedback animation
    setIsSendingOrder(true);

    // Format WhatsApp message text
    let text = `🍔 *NUEVO PEDIDO - TIERRA DE NADIE*\n`;
    text += `----------------------------------\n`;
    text += `👤 *Cliente:* ${customerName.trim()}\n`;
    text += `🛵 *Entrega:* ${deliveryType === 'delivery' ? 'Delivery a Domicilio (+$3.000)' : 'Retiro por el Local (O\'Higgins 170)'}\n`;

    if (deliveryType === 'delivery') {
      text += `📍 *Dirección:* ${address.trim()}\n`;
    }

    const payLabel = paymentMethod === 'efectivo' ? 'Efectivo 💵' : paymentMethod === 'transferencia' ? 'Transferencia Bancaria 💳' : 'MercadoPago 📲';
    text += `💳 *Pago:* ${payLabel}\n`;
    text += `----------------------------------\n`;
    text += `🛒 *DETALLE DEL PEDIDO:*\n\n`;

    cart.forEach(item => {
      text += `• *${item.quantity}x ${item.title}* - ${formatCurrency(item.unitPrice * item.quantity)}\n`;
      if (item.extras && item.extras.length > 0) {
        item.extras.forEach(ex => {
          text += `   └ + ${ex.name} (+${formatCurrency(ex.price)})\n`;
        });
      }
    });

    if (notes.trim()) {
      text += `\n----------------------------------\n`;
      text += `📝 *Notas:* ${notes.trim()}\n`;
    }

    text += `----------------------------------\n`;
    text += `💰 *Subtotal Ítems:* ${formatCurrency(totalCartPrice)}\n`;
    if (deliveryType === 'delivery') {
      text += `🛵 *Envío a domicilio:* ${formatCurrency(DELIVERY_FEE)}\n`;
    }
    text += `💰 *TOTAL A PAGAR: ${formatCurrency(finalTotal)}*\n`;
    text += `----------------------------------\n`;
    text += `¡Muchas gracias! Quedo a la espera de la confirmación.`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedText}`;

    // Delay redirect slightly so user enjoys the confirmation screen
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setTimeout(() => {
        setIsSendingOrder(false);
      }, 500);
    }, 1600);
  };

  return (
    <div className="order-modal-backdrop">
      <div className="order-modal-step-container">

        {/* Micro Confirmation Overlay */}
        {isSendingOrder && (
          <div className="sending-order-overlay animate-step">
            <div className="sending-order-card">
              <div className="sending-icon-circle">
                <Check size={42} className="check-animated" />
              </div>
              <h3 className="sending-title">¡PEDIDO GENERADO CON ÉXITO! 🍔🎉</h3>
              <p className="sending-sub">Abriendo tu WhatsApp para enviar el pedido...</p>

              <div className="sending-summary-box">
                <span className="summary-client">👤 {customerName}</span>
                <span className="summary-total">💰 Total: {formatCurrency(finalTotal)}</span>
              </div>

              <div className="sending-progress-track">
                <div className="sending-progress-bar" />
              </div>
            </div>
          </div>
        )}

        {/* Step Header */}
        <div className="wizard-modal-header">
          <div className="wizard-header-top">
            <div className="wizard-title-group">
              <img src="/galeria/Logo-tierradn.webp" alt="TDN" className="wizard-logo" />
              <div>
                <h3 className="wizard-brand-name">PEDIR ONLINE</h3>
                <span className="wizard-brand-tag">Tierra de Nadie · Orán</span>
              </div>
            </div>

            <button className="wizard-close-btn" onClick={onClose} aria-label="Cerrar">
              <X size={20} />
            </button>
          </div>

          {/* Stepper Bar */}
          <div className="wizard-stepper-bar">
            <div className={`step-pill ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="step-num">1</span>
              <span className="step-label">1. Menú</span>
            </div>
            <div className="stepper-connector" />
            <div className={`step-pill ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <span className="step-num">2</span>
              <span className="step-label">2. Carrito</span>
            </div>
            <div className="stepper-connector" />
            <div className={`step-pill ${step >= 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-label">3. Envío</span>
            </div>
          </div>
        </div>

        {/* Toast Added Notification */}
        {itemAddedToast && (
          <div className="toast-item-added">
            <Check size={16} />
            <span>¡Producto añadido al pedido!</span>
          </div>
        )}

        {/* Modal Wizard Body */}
        <div className="wizard-modal-content">

          {/* ================= PASO 1: SELECCIÓN DE COMIDA ================= */}
          {step === 1 && (
            <div className="wizard-step-panel animate-step">

              {/* Category Pills */}
              <div className="wizard-category-pills">
                <button
                  className={`wizard-cat-btn ${activeTab === 'combos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('combos')}
                >
                  🍔 Combos
                </button>
                <button
                  className={`wizard-cat-btn ${activeTab === 'papas' ? 'active' : ''}`}
                  onClick={() => setActiveTab('papas')}
                >
                  🍟 Papas & Extras
                </button>
                <button
                  className={`wizard-cat-btn ${activeTab === 'bebidas' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bebidas')}
                >
                  🥤 Bebidas
                </button>
              </div>

              {/* TAB 1: COMBOS BUILDER */}
              {activeTab === 'combos' && (
                <div className="wizard-combos-builder">

                  {/* Combo Selector Carousel */}
                  <div className="wizard-thumbs-row">
                    {COMBOS_DATA.map((combo) => (
                      <button
                        key={combo.id}
                        className={`wizard-thumb-item ${selectedComboId === combo.id ? 'active' : ''}`}
                        onClick={() => setSelectedComboId(combo.id)}
                      >
                        <img src={combo.image} alt={combo.name} className="thumb-img-small" />
                        <span className="thumb-title">{combo.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Combo Builder Card */}
                  <div className="wizard-combo-card">
                    <div className="wizard-combo-top-info">
                      <img src={currentCombo.image} alt={currentCombo.name} className="combo-hero-img" />
                      <div className="combo-meta-details">
                        <div className="combo-title-badge-row">
                          <h4 className="combo-main-name">{currentCombo.name}</h4>
                          {currentCombo.badge && (
                            <span className="combo-badge-tag">{currentCombo.badge}</span>
                          )}
                        </div>
                        <p className="combo-ing-desc">{currentCombo.ingredients}</p>
                        <span className="combo-fries-badge">🍟 Incluye Papas Fritas</span>
                      </div>
                    </div>

                    {/* Step 1: Select Size */}
                    <div className="builder-section">
                      <span className="builder-step-label">1. Elegí el tamaño:</span>
                      <div className="sizes-pill-grid">
                        {currentSizes.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`size-card-btn ${selectedSizeIndex === idx ? 'selected' : ''}`}
                            onClick={() => setSelectedSizeIndex(idx)}
                          >
                            <span className="s-name">{s.name}</span>
                            <span className="s-price">{formatCurrency(s.price)}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Quantity Selector */}
                    <div className="builder-section">
                      <span className="builder-step-label">2. Cantidad a pedir:</span>
                      <div className="builder-qty-row">
                        <button
                          type="button"
                          className="builder-qty-btn"
                          disabled={comboQuantity <= 1}
                          onClick={() => setComboQuantity(prev => Math.max(1, prev - 1))}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="builder-qty-val">{comboQuantity}</span>
                        <button
                          type="button"
                          className="builder-qty-btn"
                          onClick={() => setComboQuantity(prev => prev + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Step 3: Accordion for Extras */}
                    <div className="builder-section">
                      <button
                        type="button"
                        className={`extras-accordion-toggle ${showExtrasAccordion ? 'open' : ''}`}
                        onClick={() => setShowExtrasAccordion(!showExtrasAccordion)}
                      >
                        <div className="accordion-toggle-left">
                          <span className="accordion-title">3. Agregados / Extras (Opcional)</span>
                          {selectedExtras.length > 0 && (
                            <span className="extras-badge">{selectedExtras.length} seleccionado(s)</span>
                          )}
                        </div>
                        {showExtrasAccordion ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {showExtrasAccordion && (
                        <div className="extras-accordion-body animate-step">
                          <div className="extras-list-grid">
                            {EXTRAS_OPTIONS.map((opt) => (
                              <label key={opt.id} className="extra-pill-option">
                                <input
                                  type="checkbox"
                                  checked={selectedExtras.includes(opt.id)}
                                  onChange={() => handleToggleExtra(opt.id)}
                                />
                                <div className="check-box-icon" />
                                <span className="ex-title">{opt.name}</span>
                                <span className="ex-val">+{formatCurrency(opt.price)}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Add Combo Action */}
                    <button
                      type="button"
                      className="btn-add-combo-to-cart"
                      onClick={handleAddComboToCart}
                    >
                      <Plus size={18} />
                      <span>
                        AGREGAR {comboQuantity > 1 ? `${comboQuantity}x ` : ''}{currentCombo.name} ({currentSize.name}) · {formatCurrency(calculateComboItemPrice() * comboQuantity)}
                      </span>
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: PAPAS & EXTRAS */}
              {activeTab === 'papas' && (
                <div className="wizard-simple-list">
                  <h4 className="wizard-list-title">PORCIONES DE PAPAS</h4>
                  {PAPAS_DATA.map((p) => (
                    <div key={p.id} className="wizard-item-card">
                      <div className="item-left-meta">
                        <span className="item-name">{p.name}</span>
                        <span className="item-desc">{p.desc}</span>
                      </div>
                      <div className="item-right-action">
                        <span className="item-price">{formatCurrency(p.price)}</span>
                        <button
                          type="button"
                          className="btn-quick-add"
                          onClick={() => handleAddSimpleItemToCart(p.name, p.price)}
                        >
                          <Plus size={16} /> Añadir
                        </button>
                      </div>
                    </div>
                  ))}

                  <h4 className="wizard-list-title" style={{ marginTop: '16px' }}>EXTRAS Y AGREGADOS</h4>
                  {EXTRAS_OPTIONS.map((e) => (
                    <div key={e.id} className="wizard-item-card">
                      <div className="item-left-meta">
                        <span className="item-name">{e.name}</span>
                      </div>
                      <div className="item-right-action">
                        <span className="item-price">{formatCurrency(e.price)}</span>
                        <button
                          type="button"
                          className="btn-quick-add"
                          onClick={() => handleAddSimpleItemToCart(e.name, e.price)}
                        >
                          <Plus size={16} /> Añadir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: BEBIDAS */}
              {activeTab === 'bebidas' && (
                <div className="wizard-simple-list">
                  <h4 className="wizard-list-title">BEBIDAS & CERVEZAS</h4>
                  {DRINKS_DATA.map((d) => (
                    <div key={d.id} className="wizard-item-card">
                      <div className="item-left-meta">
                        <span className="item-name">{d.name}</span>
                      </div>
                      <div className="item-right-action">
                        <span className="item-price">{formatCurrency(d.price)}</span>
                        <button
                          type="button"
                          className="btn-quick-add"
                          onClick={() => handleAddSimpleItemToCart(d.name, d.price)}
                        >
                          <Plus size={16} /> Añadir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ================= PASO 2: REVISAR CARRITO ================= */}
          {step === 2 && (
            <div className="wizard-step-panel animate-step">
              <h4 className="step-title-head">🛒 RESUMEN DE TU CARRITO</h4>

              {cart.length === 0 ? (
                <div className="wizard-empty-cart">
                  <span className="empty-emoji">🍔</span>
                  <p>Aún no agregaste productos a tu pedido.</p>
                  <button className="btn-back-to-menu" onClick={() => setStep(1)}>
                    ← Volver al menú para agregar comida
                  </button>
                </div>
              ) : (
                <div className="wizard-cart-items-list">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="cart-card-item">
                      <div className="cart-card-main">
                        <span className="cart-card-title">{item.title}</span>
                        <span className="cart-card-price">{formatCurrency(item.unitPrice * item.quantity)}</span>
                      </div>

                      {item.extras && item.extras.length > 0 && (
                        <div className="cart-card-extras">
                          {item.extras.map((ex, idx) => (
                            <span key={idx} className="extra-tag-pill">+ {ex.name} (+{formatCurrency(ex.price)})</span>
                          ))}
                        </div>
                      )}

                      <div className="cart-card-controls">
                        <div className="qty-counter">
                          <button type="button" onClick={() => handleUpdateQuantity(item.cartItemId, -1)}>
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => handleUpdateQuantity(item.cartItemId, 1)}>
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="btn-delete-cart-item"
                          onClick={() => handleRemoveItem(item.cartItemId)}
                        >
                          <Trash2 size={16} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button className="btn-add-more" onClick={() => setStep(1)}>
                    + Agregar más combos o bebidas
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= PASO 3: DATOS DE ENVÍO Y PAGO ================= */}
          {step === 3 && (
            <div className="wizard-step-panel animate-step">
              <h4 className="step-title-head">📍 DATOS DE ENTREGA Y PAGO</h4>

              <form onSubmit={handleSendWhatsAppOrder} className="wizard-checkout-form">

                {/* Tipo de entrega */}
                <div className="form-field-group">
                  <label className="field-title">¿Cómo querés recibir tu pedido?</label>
                  <div className="delivery-pills-row">
                    <button
                      type="button"
                      className={`delivery-pill ${deliveryType === 'delivery' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('delivery')}
                    >
                      🛵 Delivery a Domicilio ($3.000)
                    </button>
                    <button
                      type="button"
                      className={`delivery-pill ${deliveryType === 'retiro' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('retiro')}
                    >
                      🛍️ Retiro en Local (Gratis)
                    </button>
                  </div>
                </div>

                {/* Nombre */}
                <div className="form-field-group">
                  <label className="field-title">Tu Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    className="wizard-input"
                    placeholder="Ej: Juan Pérez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                {/* Dirección (si es delivery) */}
                {deliveryType === 'delivery' && (
                  <div className="form-field-group">
                    <label className="field-title">Dirección de Entrega en Orán *</label>
                    <input
                      type="text"
                      required
                      className="wizard-input"
                      placeholder="Calle, número, barrio o referencia"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                )}

                {/* Forma de pago */}
                <div className="form-field-group">
                  <label className="field-title">Forma de Pago</label>
                  <select
                    className="wizard-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="efectivo">💵 Efectivo al entregar</option>
                    <option value="transferencia">💳 Transferencia bancaria</option>
                    <option value="mercadopago">📲 MercadoPago (QR / Alias)</option>
                  </select>
                </div>

                {/* Notas */}
                <div className="form-field-group">
                  <label className="field-title">Notas o Aclaraciones (Opcional)</label>
                  <input
                    type="text"
                    className="wizard-input"
                    placeholder="Ej: Sin cebolla, aderezos aparte..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Resumen Total */}
                <div className="wizard-total-summary-card">
                  <div className="summary-line">
                    <span>Subtotal Ítems ({totalCartItemsCount}):</span>
                    <span>{formatCurrency(totalCartPrice)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Costo de Envío:</span>
                    <span>{deliveryType === 'delivery' ? formatCurrency(DELIVERY_FEE) : 'Gratis (Retiro)'}</span>
                  </div>
                  <div className="summary-line total">
                    <span>TOTAL A PAGAR:</span>
                    <span className="total-val">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                <button type="submit" className="btn-final-whatsapp">
                  <Send size={18} />
                  <span>ENVIAR PEDIDO POR WHATSAPP</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Floating Bottom Nav Bar */}
        <div className="wizard-modal-footer">
          {step === 1 && (
            <div className="footer-bar-step1">
              <div className="cart-counter-preview">
                <ShoppingCart size={18} />
                <span>{totalCartItemsCount} ítem(s) · <strong>{formatCurrency(totalCartPrice)}</strong></span>
              </div>
              <button
                type="button"
                className={`btn-wizard-next ${cart.length === 0 ? 'disabled' : ''}`}
                disabled={cart.length === 0}
                onClick={() => setStep(2)}
              >
                <span>VER RESUMEN Y CONTINUAR</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="footer-bar-step2">
              <button type="button" className="btn-wizard-prev" onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                <span>Volver al menú</span>
              </button>

              <button
                type="button"
                className="btn-wizard-next"
                onClick={() => setStep(3)}
              >
                <span>INGRESAR DATOS DE ENVÍO</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="footer-bar-step3">
              <button type="button" className="btn-wizard-prev" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                <span>Volver al carrito</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
