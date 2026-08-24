import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  ArrowRight,
  Check,
  ChevronRight,
  AlertTriangle,
  Layers
} from 'lucide-react';
import useMenuData, { formatPrice } from '../hooks/useMenuData';

const WHATSAPP_PHONE_NUMBER = "543878302896";
const DELIVERY_FEE = 3000;

/**
 * Checks if Tierra de Nadie is currently open.
 * Hours: Thursday to Tuesday from 21:30 to 01:00 hs (Closed Wednesdays).
 */
function checkIsStoreOpen() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Wednesday (3) closed all day
  if (day === 3) return false;

  // Night shift: 21:30 (1290 mins) to 23:59 (1439 mins) OR 00:00 (0 mins) to 01:00 (60 mins)
  const isNightOpen = totalMinutes >= 1290 || totalMinutes < 60;

  return isNightOpen;
}

export default function PedidoPage({ onBack, cart = [], setCart }) {
  const menuData = useMenuData();

  const COMBOS_DATA = (menuData.combos || []).map((combo) => ({
    ...combo,
    ingredientsList: Array.isArray(combo.ingredients) ? combo.ingredients : (combo.ingredients ? combo.ingredients.split(', ') : [])
  }));
  const EXTRAS_OPTIONS = menuData.extras || [];
  const PAPAS_DATA = menuData.papas || [];
  const BEBIDAS_DATA = menuData.bebidas || { gaseosas2L: [], cervezas: [], individuales: [] };

  // Store status (ALWAYS ENABLED for testing as requested by user)
  const isStoreOpen = true;
  void checkIsStoreOpen;

  // Navigation Drill-Down SubViews:
  // 'categories' (Main 3 categories: Hamburguesas, Papas, Bebidas)
  // 'list' (List of products in selected category)
  // 'detail' (Product customization & sizes view)
  // 'cart' (Cart summary view)
  // 'checkout' (Delivery & payment details view)
  const [subView, setSubView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState('hamburguesas'); // 'hamburguesas' | 'papas' | 'bebidas'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Customization state for active product
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // Default 'Doble'
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);

  // Added modal state ("Seguir comprando" vs "Ir al carrito")
  const [addedItemDialog, setAddedItemDialog] = useState(null);

  // Customer checkout details
  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' | 'retiro'
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo'); // 'efectivo' | 'transferencia' | 'mercadopago'
  const [notes, setNotes] = useState('');

  // Confirmation screen
  const [isSendingOrder, setIsSendingOrder] = useState(false);

  useEffect(() => {
    document.title = 'Tierra de Nadie | Pedidos Online';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      document.title = 'Tierra de Nadie | Hamburguesería Smash en Orán, Salta';
    };
  }, []);

  // When changing subviews, scroll top smoothly
  const navigateTo = (view, extraState = {}) => {
    if (extraState.category) setSelectedCategory(extraState.category);
    if (extraState.product) {
      setSelectedProduct(extraState.product);
      setSelectedSizeIndex(1);
      setSelectedExtras([]);
      setProductQuantity(1);
    }
    setSubView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId) => {
    navigateTo('list', { category: catId });
  };

  const handleSelectProduct = (prod) => {
    if (selectedCategory === 'hamburguesas') {
      navigateTo('detail', { product: prod });
    } else {
      // For Papas and Bebidas, add directly
      handleAddSimpleItemToCart(prod);
    }
  };

  const handleToggleExtra = (extraId) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };

  const calculateComboItemPrice = () => {
    if (!selectedProduct) return 0;
    const sizes = selectedProduct.sizes || [{ price: 10000 }];
    const currentSize = sizes[selectedSizeIndex] || sizes[0] || { price: 10000 };
    let base = currentSize.price;
    selectedExtras.forEach(eId => {
      const opt = EXTRAS_OPTIONS.find(o => o.id === eId);
      if (opt) base += opt.price;
    });
    return base;
  };

  const handleAddComboToCart = () => {
    if (!isStoreOpen) return;
    if (!selectedProduct) return;

    const sizes = selectedProduct.sizes || [{ name: 'Simple', price: 10000 }];
    const currentSize = sizes[selectedSizeIndex] || sizes[0] || { name: 'Simple', price: 10000 };
    const extrasObjs = selectedExtras.map(eId => EXTRAS_OPTIONS.find(o => o.id === eId)).filter(Boolean);
    const itemPrice = calculateComboItemPrice();

    const newItem = {
      cartItemId: Date.now() + Math.random(),
      type: 'combo',
      title: `${selectedProduct.name} (${currentSize.name})`,
      image: selectedProduct.image || null,
      unitPrice: itemPrice,
      quantity: productQuantity,
      extras: extrasObjs
    };

    setCart([...cart, newItem]);
    setAddedItemDialog(newItem);
  };

  const handleAddSimpleItemToCart = (prod) => {
    if (!isStoreOpen) return;

    const title = typeof prod === 'string' ? prod : prod.name;
    const price = typeof prod === 'object' ? prod.price : 0;
    const image = typeof prod === 'object' ? prod.image : null;
    const icon = typeof prod === 'object' ? prod.icon : null;

    const existingIndex = cart.findIndex(item => item.title === title && (!item.extras || item.extras.length === 0));
    let newItem;

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
      newItem = updated[existingIndex];
    } else {
      newItem = {
        cartItemId: Date.now() + Math.random(),
        type: 'item',
        title: title,
        image: image,
        icon: icon,
        unitPrice: price,
        quantity: 1,
        extras: []
      };
      setCart([...cart, newItem]);
    }
    setAddedItemDialog(newItem);
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

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalCartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCost = deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const finalTotal = totalCartPrice + shippingCost;

  const handleSendWhatsAppOrder = (e) => {
    e.preventDefault();

    if (!isStoreOpen) {
      alert("El local se encuentra cerrado actualmente. Abrimos de Jueves a Martes de 21:30 a 01:00 hs.");
      return;
    }

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

    setIsSendingOrder(true);

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
      text += `• *${item.quantity}x ${item.title}* - ${formatPrice(item.unitPrice * item.quantity)}\n`;
      if (item.extras && item.extras.length > 0) {
        item.extras.forEach(ex => {
          text += `   └ + ${ex.name} (+${formatPrice(ex.price)})\n`;
        });
      }
    });

    if (notes.trim()) {
      text += `\n----------------------------------\n`;
      text += `📝 *Notas:* ${notes.trim()}\n`;
    }

    text += `----------------------------------\n`;
    text += `💰 *Subtotal Ítems:* ${formatPrice(totalCartPrice)}\n`;
    if (deliveryType === 'delivery') {
      text += `🛵 *Envío a domicilio:* ${formatPrice(DELIVERY_FEE)}\n`;
    }
    text += `💰 *TOTAL A PAGAR: ${formatPrice(finalTotal)}*\n`;
    text += `----------------------------------\n`;
    text += `¡Muchas gracias! Quedo a la espera de la confirmación.`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedText}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setTimeout(() => {
        setIsSendingOrder(false);
      }, 500);
    }, 1600);
  };

  // Helper for drill-down back navigation
  const handleHeaderBack = () => {
    if (subView === 'detail') {
      navigateTo('list', { category: selectedCategory });
    } else if (subView === 'list') {
      navigateTo('categories');
    } else if (subView === 'cart') {
      navigateTo('categories');
    } else if (subView === 'checkout') {
      navigateTo('cart');
    } else {
      if (onBack) onBack();
    }
  };

  const getHeaderTitle = () => {
    if (subView === 'categories') return 'TDN';
    if (subView === 'list') {
      return selectedCategory === 'hamburguesas' ? 'HAMBURGUESAS' : selectedCategory === 'papas' ? 'PAPAS FRITAS' : 'BEBIDAS';
    }
    if (subView === 'detail') return selectedProduct?.name || 'DETALLE';
    if (subView === 'cart') return 'TU CARRITO';
    if (subView === 'checkout') return 'DATOS DE ENVÍO Y PAGO';
    return 'PEDIDOS ONLINE';
  };

  return (
    <div className="pedido-page-layout">
      {/* Confirmation Sending Overlay */}
      {isSendingOrder && (
        <div className="sending-order-overlay-full">
          <div className="sending-order-card">
            <div className="sending-icon-circle">
              <Check size={48} />
            </div>
            <h2 className="sending-title">¡PEDIDO GENERADO CON ÉXITO! 🍔🎉</h2>
            <p className="sending-sub">Abriendo tu WhatsApp para enviar el pedido...</p>
            <div className="sending-summary-box">
              <span className="summary-client">👤 {customerName}</span>
              <span className="summary-total">💰 Total: {formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Item Added Action Dialog ("Seguir Comprando" vs "Ver Carrito") */}
      {addedItemDialog && (
        <div className="added-dialog-backdrop">
          <div className="added-dialog-card animate-scale-in">
            <div className="added-dialog-icon">🎉</div>
            <h3 className="added-dialog-title">¡Producto Agregado!</h3>
            <p className="added-dialog-product">{addedItemDialog.title}</p>

            <div className="added-dialog-buttons">
              <button
                type="button"
                className="btn-dialog-keep"
                onClick={() => {
                  setAddedItemDialog(null);
                  navigateTo('categories');
                }}
              >
                <Layers size={18} />
                <span>Seguir Comprando (Agregar Bebidas/Papas)</span>
              </button>

              <button
                type="button"
                className="btn-dialog-cart"
                onClick={() => {
                  setAddedItemDialog(null);
                  navigateTo('cart');
                }}
              >
                <ShoppingCart size={18} />
                <span>Ir al Carrito ({totalCartItemsCount}) · {formatPrice(totalCartPrice)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar (Red Header) */}
      <header className="drilldown-top-header">
        <div className="drilldown-header-inner">
          <button type="button" className="drilldown-back-btn" onClick={handleHeaderBack}>
            <ArrowLeft size={22} />
          </button>

          <h1 className="drilldown-title">{getHeaderTitle()}</h1>

          <button
            type="button"
            className="drilldown-cart-btn"
            onClick={() => navigateTo('cart')}
          >
            <ShoppingCart size={22} />
            {totalCartItemsCount > 0 && <span className="cart-badge-dot">{totalCartItemsCount}</span>}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="drilldown-main-content">

        {/* ================= VISTA 1: CATEGORÍAS PRINCIPALES ================= */}
        {subView === 'categories' && (
          <div className="categories-view-container animate-fade-in">
            <h2 className="categories-heading">Categorías</h2>

            <div className="categories-cards-stack">
              {/* Categoría 1: Hamburguesas */}
              <div
                className="category-big-card card-burgers"
                onClick={() => handleSelectCategory('hamburguesas')}
              >
                <div className="category-overlay-dark" />
                <img
                  src="/galeria/cat_hamburguesas.png"
                  alt="Hamburguesas"
                  className="category-card-bg"
                />
                <h3 className="category-card-title">HAMBURGUESAS</h3>
              </div>

              {/* Categoría 2: Papas Fritas */}
              <div
                className="category-big-card card-papas"
                onClick={() => handleSelectCategory('papas')}
              >
                <div className="category-overlay-dark" />
                <img
                  src="/galeria/cat_papas.png"
                  alt="Papas Fritas"
                  className="category-card-bg"
                />
                <h3 className="category-card-title">PAPAS FRITAS</h3>
              </div>

              {/* Categoría 3: Gaseosas & Bebidas */}
              <div
                className="category-big-card card-drinks"
                onClick={() => handleSelectCategory('bebidas')}
              >
                <div className="category-overlay-dark" />
                <img
                  src="/galeria/cat_bebidas.png"
                  alt="Gaseosas y Bebidas"
                  className="category-card-bg"
                />
                <h3 className="category-card-title">BEBIDAS</h3>
              </div>
            </div>
          </div>
        )}

        {/* ================= VISTA 2: LISTA DE PRODUCTOS POR CATEGORÍA ================= */}
        {subView === 'list' && (
          <div className="products-list-view animate-fade-in">

            {/* Listado Hamburguesas */}
            {selectedCategory === 'hamburguesas' && (
              <div className="products-stack">
                {COMBOS_DATA.map((combo) => (
                  <div
                    key={combo.id}
                    className="product-horizontal-row"
                    onClick={() => handleSelectProduct(combo)}
                  >
                    <img src={combo.image} alt={combo.name} className="product-row-img" />
                    <div className="product-row-info">
                      <h3 className="product-row-title">{combo.name}</h3>
                      <span className="product-row-badge">{combo.badge || 'SMASH BURGER 🔥'}</span>
                      <div className="product-row-price">
                        <span>Desde</span>
                        <strong>{formatPrice(combo.sizes?.[0]?.price || 10000)}</strong>
                      </div>
                    </div>
                    <ChevronRight size={22} className="product-row-arrow" />
                  </div>
                ))}
              </div>
            )}

            {/* Listado Papas Fritas */}
            {selectedCategory === 'papas' && (
              <div className="products-stack">
                {PAPAS_DATA.map((papa) => (
                  <div key={papa.id} className="product-horizontal-row">
                    <div className="product-row-icon">{papa.icon}</div>
                    <div className="product-row-info">
                      <h3 className="product-row-title">{papa.name}</h3>
                      <p className="product-row-desc">{papa.desc}</p>
                      <strong className="product-row-price-val">{formatPrice(papa.price)}</strong>
                    </div>
                    <button
                      type="button"
                      className={`btn-row-add ${!isStoreOpen ? 'disabled' : ''}`}
                      disabled={!isStoreOpen}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectProduct(papa);
                      }}
                    >
                      + Agregar
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Listado Bebidas */}
            {selectedCategory === 'bebidas' && (
              <div className="products-stack">
                <h3 className="drinks-group-head">Gaseosas 2L</h3>
                {(BEBIDAS_DATA.gaseosas2L || []).map((drink) => (
                  <div key={drink.id} className="product-horizontal-row">
                    <div className="product-row-icon">🥤</div>
                    <div className="product-row-info">
                      <h3 className="product-row-title">{drink.name}</h3>
                      <strong className="product-row-price-val">{formatPrice(drink.price)}</strong>
                    </div>
                    <button
                      type="button"
                      className={`btn-row-add ${!isStoreOpen ? 'disabled' : ''}`}
                      disabled={!isStoreOpen}
                      onClick={() => handleSelectProduct(drink)}
                    >
                      + Agregar
                    </button>
                  </div>
                ))}

                <h3 className="drinks-group-head">Cervezas en Lata</h3>
                {(BEBIDAS_DATA.cervezas || []).map((beer) => (
                  <div key={beer.id} className="product-horizontal-row">
                    <div className="product-row-icon">🍺</div>
                    <div className="product-row-info">
                      <h3 className="product-row-title">{beer.name}</h3>
                      <p className="product-row-desc">{beer.desc}</p>
                      <strong className="product-row-price-val">{formatPrice(beer.price)}</strong>
                    </div>
                    <button
                      type="button"
                      className={`btn-row-add ${!isStoreOpen ? 'disabled' : ''}`}
                      disabled={!isStoreOpen}
                      onClick={() => handleSelectProduct(beer)}
                    >
                      + Agregar
                    </button>
                  </div>
                ))}

                <h3 className="drinks-group-head">Bebidas Individuales (500ml)</h3>
                {(BEBIDAS_DATA.individuales || []).map((ind) => (
                  <div key={ind.id} className="product-horizontal-row">
                    <div className="product-row-icon">💧</div>
                    <div className="product-row-info">
                      <h3 className="product-row-title">{ind.name}</h3>
                      <p className="product-row-desc">{ind.desc}</p>
                      <strong className="product-row-price-val">{formatPrice(ind.price)}</strong>
                    </div>
                    <button
                      type="button"
                      className={`btn-row-add ${!isStoreOpen ? 'disabled' : ''}`}
                      disabled={!isStoreOpen}
                      onClick={() => handleSelectProduct(ind)}
                    >
                      + Agregar
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ================= VISTA 3: DETALLE & PERSONALIZACIÓN DE HAMBURGUESA ================= */}
        {subView === 'detail' && selectedProduct && (
          <div className="product-detail-view animate-fade-in">
            {/* Foto Hero */}
            <div className="detail-media-container">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="detail-hero-img"
              />
              {selectedProduct.papas && (
                <span className="papas-included-badge">🍟 INCLUYE PAPAS FRITAS</span>
              )}
            </div>

            {/* Ficha de Ingredientes */}
            <div className="detail-ingredients-box">
              <h4 className="detail-box-label">INGREDIENTES:</h4>
              <p className="detail-ingredients-text">
                {selectedProduct.ingredientsList ? selectedProduct.ingredientsList.join(' · ') : selectedProduct.ingredients}
              </p>
            </div>

            {/* Selector de Tamaño */}
            <div className="detail-section-block">
              <h4 className="detail-box-label">1. Elegí el Tamaño:</h4>
              <div className="detail-sizes-grid">
                {(selectedProduct.sizes || [{ name: 'Simple', price: 10000 }]).map((sz, idx) => {
                  const isSizeSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`detail-size-btn ${isSizeSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedSizeIndex(idx)}
                    >
                      {sz.popular && <span className="popular-subtag">POPULAR</span>}
                      <span className="size-label-text">{sz.name}</span>
                      <span className="size-price-text">{formatPrice(sz.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Agregados / Extras */}
            <div className="detail-section-block">
              <h4 className="detail-box-label">2. Agregados / Extras (Opcional):</h4>
              <div className="detail-extras-list">
                {EXTRAS_OPTIONS.map((extra) => {
                  const isChecked = selectedExtras.includes(extra.id);
                  return (
                    <label key={extra.id} className={`detail-extra-item ${isChecked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleExtra(extra.id)}
                      />
                      <span className="ex-icon">{extra.icon}</span>
                      <div className="ex-info">
                        <span className="ex-name">{extra.name}</span>
                        <span className="ex-desc">{extra.desc}</span>
                      </div>
                      <span className="ex-price">+{formatPrice(extra.price)}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Cantidad y Botón de Adición */}
            <div className="detail-action-footer">
              <div className="detail-qty-picker">
                <button
                  type="button"
                  onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                  disabled={productQuantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="qty-val-display">{productQuantity}</span>
                <button
                  type="button"
                  onClick={() => setProductQuantity(productQuantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                className={`btn-detail-add-cart ${!isStoreOpen ? 'disabled-closed' : ''}`}
                disabled={!isStoreOpen}
                onClick={handleAddComboToCart}
              >
                <ShoppingCart size={20} />
                <span>
                  {isStoreOpen
                    ? `AGREGAR AL CARRITO · ${formatPrice(calculateComboItemPrice() * productQuantity)}`
                    : 'LOCAL CERRADO (No se reciben pedidos)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ================= VISTA 4: RESUMEN DEL CARRITO ================= */}
        {subView === 'cart' && (
          <div className="cart-summary-view animate-fade-in">
            <h2 className="view-title-main">TU CARRITO DE COMPRAS</h2>

            {cart.length === 0 ? (
              <div className="empty-cart-card">
                <div className="empty-cart-emoji">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Todavía no agregaste ningún producto a tu pedido.</p>
                <button
                  type="button"
                  className="btn-go-categories"
                  onClick={() => navigateTo('categories')}
                >
                  Ver Categorías del Menú
                </button>
              </div>
            ) : (
              <div className="cart-content-grid">
                <div className="cart-items-column">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="cart-card-item">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="cart-card-img" />
                      ) : item.icon ? (
                        <span className="cart-card-icon-emoji">{item.icon}</span>
                      ) : (
                        <span className="cart-card-icon-emoji">🍔</span>
                      )}

                      <div className="cart-card-meta">
                        <h4 className="cart-card-title">{item.title}</h4>
                        {item.extras && item.extras.length > 0 && (
                          <div className="cart-card-extras-tags">
                            {item.extras.map((ex) => (
                              <span key={ex.id} className="tag-extra">
                                + {ex.name} ({formatPrice(ex.price)})
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="cart-card-unit">{formatPrice(item.unitPrice)} c/u</span>
                      </div>

                      <div className="cart-card-actions">
                        <div className="qty-controls">
                          <button type="button" onClick={() => handleUpdateQuantity(item.cartItemId, -1)}>
                            <Minus size={14} />
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button type="button" onClick={() => handleUpdateQuantity(item.cartItemId, 1)}>
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="cart-card-subtotal">{formatPrice(item.unitPrice * item.quantity)}</span>

                        <button
                          type="button"
                          className="btn-delete-item"
                          onClick={() => handleRemoveItem(item.cartItemId)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-add-more-products"
                    onClick={() => navigateTo('categories')}
                  >
                    + Agregar más productos al carrito
                  </button>
                </div>

                {/* Sidebar Resumen */}
                <div className="cart-checkout-sidebar">
                  <h3 className="sidebar-heading">Resumen de la Orden</h3>

                  <div className="sidebar-row">
                    <span>Subtotal Ítems ({totalCartItemsCount}):</span>
                    <strong>{formatPrice(totalCartPrice)}</strong>
                  </div>

                  <div className="sidebar-divider" />

                  <button
                    type="button"
                    className={`btn-proceed-checkout ${!isStoreOpen ? 'disabled' : ''}`}
                    disabled={!isStoreOpen}
                    onClick={() => navigateTo('checkout')}
                  >
                    <span>{isStoreOpen ? 'INGRESAR DATOS DE ENVÍO Y PAGO' : 'LOCAL CERRADO'}</span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    className="btn-keep-browsing"
                    onClick={() => navigateTo('categories')}
                  >
                    Seguir Comprando
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VISTA 5: DATOS DE ENVÍO Y PAGO ================= */}
        {subView === 'checkout' && (
          <div className="checkout-view animate-fade-in">
            <h2 className="view-title-main">DATOS DE ENTREGA Y PAGO</h2>

            <form onSubmit={handleSendWhatsAppOrder} className="checkout-form-grid">
              <div className="form-fields-col">

                {/* Tipo de Entrega */}
                <div className="form-card-box">
                  <label className="form-label-title">¿Cómo querés recibir tu pedido?</label>
                  <div className="delivery-options-grid">
                    <button
                      type="button"
                      className={`delivery-option-btn ${deliveryType === 'delivery' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('delivery')}
                    >
                      <span className="option-icon">🛵</span>
                      <div>
                        <strong>Delivery a Domicilio</strong>
                        <span className="option-sub">Costo de envío: $3.000</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`delivery-option-btn ${deliveryType === 'retiro' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('retiro')}
                    >
                      <span className="option-icon">🛍️</span>
                      <div>
                        <strong>Retiro por el Local</strong>
                        <span className="option-sub">O'Higgins 170 · Gratis</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Nombre */}
                <div className="form-card-box">
                  <label className="form-label-title">Tu Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    className="input-custom-text"
                    placeholder="Ej: Juan Pérez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                {/* Dirección de entrega */}
                {deliveryType === 'delivery' && (
                  <div className="form-card-box">
                    <label className="form-label-title">Dirección de Entrega en Orán *</label>
                    <input
                      type="text"
                      required
                      className="input-custom-text"
                      placeholder="Calle, número, barrio o indicaciones"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                )}

                {/* Forma de pago */}
                <div className="form-card-box">
                  <label className="form-label-title">Forma de Pago</label>
                  <select
                    className="select-custom-text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="efectivo">💵 Efectivo al entregar</option>
                    <option value="transferencia">💳 Transferencia bancaria</option>
                    <option value="mercadopago">📲 MercadoPago (QR / Alias)</option>
                  </select>
                </div>

                {/* Notas */}
                <div className="form-card-box">
                  <label className="form-label-title">Notas o Aclaraciones (Opcional)</label>
                  <input
                    type="text"
                    className="input-custom-text"
                    placeholder="Ej: Sin cebolla, aderezos aparte..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className={`btn-send-whatsapp-final ${!isStoreOpen ? 'disabled-closed' : ''}`}
                  disabled={!isStoreOpen}
                >
                  <Send size={22} />
                  <span>
                    {isStoreOpen ? 'ENVIAR PEDIDO POR WHATSAPP' : 'LOCAL CERRADO (No se reciben pedidos)'}
                  </span>
                </button>
              </div>

              {/* Sidebar Final Summary */}
              <div className="checkout-final-sidebar">
                <h3 className="sidebar-heading">Detalle Final</h3>

                <div className="mini-items-scroll">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="mini-item-row">
                      <span>{item.quantity}x {item.title}</span>
                      <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
                    </div>
                  ))}
                </div>

                <div className="sidebar-divider" />

                <div className="summary-row-item">
                  <span>Subtotal Ítems:</span>
                  <span>{formatPrice(totalCartPrice)}</span>
                </div>

                <div className="summary-row-item">
                  <span>Envío (Delivery):</span>
                  <span>{deliveryType === 'delivery' ? formatPrice(DELIVERY_FEE) : 'Gratis'}</span>
                </div>

                <div className="summary-total-banner-gold">
                  <span>TOTAL A PAGAR:</span>
                  <strong className="total-gold-val">{formatPrice(finalTotal)}</strong>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Store Hours Footer Notice */}
        <div className="store-hours-footer-notice">
          <AlertTriangle size={16} className="hours-icon" />
          <span>Horario de Atención: Jueves a Martes de 21:30 a 01:00 hs (Miércoles cerrado)</span>
        </div>

        {/* Agency Footer Credit */}
        <footer className="pedido-digital-footer">
          <div className="footer-agency-red">
            <span>CREADO POR </span>
            <a
              href="https://oransoluciones.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="oran-link-red"
            >
              ORAN SOLUCIONES
            </a>
          </div>
          <p className="footer-copy-text">© {new Date().getFullYear()} Tierra de Nadie. Todos los derechos reservados.</p>
        </footer>
      </main>

      {/* Floating Bottom Cart Bar (Visible on all browsing views when cart has items) */}
      {(subView === 'categories' || subView === 'list' || subView === 'detail') && totalCartItemsCount > 0 && (
        <div className="floating-cart-bar-bottom animate-fadeInUp">
          <div className="floating-cart-info">
            <span className="floating-cart-count">{totalCartItemsCount}</span>
            <div>
              <span className="floating-cart-sub">Tu Pedido</span>
              <strong className="floating-cart-price">{formatPrice(totalCartPrice)}</strong>
            </div>
          </div>

          <button
            type="button"
            className="btn-floating-view-cart-main"
            onClick={() => navigateTo('cart')}
          >
            <span>Ver Carrito</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
