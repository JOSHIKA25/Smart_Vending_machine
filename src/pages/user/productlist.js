import React, { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { io } from "socket.io-client";
import { Snackbar, Alert, Typography } from "@mui/material";

// ─── Socket (created once outside component) ──────────────────────────────────
const socket = io("http://localhost:5000", { autoConnect: true, reconnectionAttempts: 3 });

const injectFleetStyles = () => {
  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --canvas: #f2f1ed;
    --surface: #ffffff;
    --border: rgba(0,0,0,0.08);
    --ink: #0a0a0a;
    --ink-soft: #555;
    --accent: #c8f04e;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--canvas); font-family: var(--font-body); }
  `;
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
};

function ProductList() {
  const user = JSON.parse(localStorage.getItem("user")) || { id: 1 };
  const [products, setProducts]               = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentMethod, setPaymentMethod]     = useState("UPI");
  const [paymentResult, setPaymentResult]     = useState(null);
  const [isProcessing, setIsProcessing]       = useState(false);
  const [quantity, setQuantity]               = useState(1);
  const [cart, setCart]                       = useState([]);
  const [showCart, setShowCart]               = useState(false);
  const [currentTime, setCurrentTime]         = useState(new Date());
  const [cardDetails, setCardDetails]         = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [showGuide, setShowGuide]             = useState(false);
  const [showSupport, setShowSupport]         = useState(false);
  const [cashAmount, setCashAmount]           = useState("");
  const [notification, setNotification]       = useState("");
  const [open, setOpen]                       = useState(false);
  const [upiId, setUpiId]                     = useState(""); // ✅ UPI ID field

  // ─── Discount state ───────────────────────────────────────────────────────
  const [offerData, setOfferData]                   = useState(null);
  const [selectedOffer, setSelectedOffer]           = useState(null);
  const [selectedFreeProduct, setSelectedFreeProduct] = useState(null);
  const [appliedOffer, setAppliedOffer]             = useState(null);
  const [showOfferPanel, setShowOfferPanel]         = useState(false);

  const API = "http://localhost:5000";
  const DISCOUNT_THRESHOLD = 100;

  useEffect(() => { injectFleetStyles(); }, []);

  useEffect(() => {
    socket.on("stockUpdated", (data) => {
      setProducts(prev =>
        prev.map(p => p.id === data.product_id ? { ...p, stock: data.new_stock } : p)
      );
      setNotification("Stock updated!");
      setOpen(true);
    });
    return () => socket.off("stockUpdated");
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
    } catch (err) { console.error("Error fetching products"); }
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Fetch discount offers when product/qty changes ───────────────────────
  useEffect(() => {
    if (!selectedProduct) {
      setOfferData(null); setAppliedOffer(null);
      setSelectedOffer(null); setSelectedFreeProduct(null);
      setShowOfferPanel(false);
      return;
    }
    const subtotal = selectedProduct.isCart
      ? selectedProduct.price
      : selectedProduct.price * quantity;

    if (parseFloat(subtotal) <= DISCOUNT_THRESHOLD) { setOfferData(null); return; }

    axios.post(`${API}/api/discount/check`, { cartTotal: parseFloat(subtotal), cartItems: [] })
      .then(({ data }) => setOfferData(data))
      .catch(() => setOfferData(null));
  }, [selectedProduct, quantity]);

  // ─── GST calculation helpers ──────────────────────────────────────────────
  // ✅ Uses the product's actual gst_percent from the database
  const getGstPercent = () => {
    if (selectedProduct?.isCart) {
      // For cart: weighted average GST across items
      const totalVal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
      if (totalVal === 0) return 0;
      const weightedGst = cart.reduce((s, i) => s + (parseFloat(i.gst_percent) || 0) * i.price * i.quantity, 0);
      return weightedGst / totalVal;
    }
    return parseFloat(selectedProduct?.gst_percent) || 0;
  };

  const getSubtotal = () =>
    selectedProduct?.isCart
      ? selectedProduct.price
      : (selectedProduct?.price || 0) * quantity;

  const getDiscountedSubtotal = (sub) => {
    if (!appliedOffer) return sub;
    if (appliedOffer.type === "PERCENTAGE") return sub - sub * 0.10;
    return sub;
  };

  const subtotal        = getSubtotal();
  const discountedSub   = getDiscountedSubtotal(subtotal);
  const gstPercent      = getGstPercent();
  const cgstPercent     = gstPercent / 2;
  const sgstPercent     = gstPercent / 2;
  const gstAmount       = parseFloat((discountedSub * gstPercent / 100).toFixed(2));
  const cgstAmount      = parseFloat((gstAmount / 2).toFixed(2));
  const sgstAmount      = parseFloat((gstAmount / 2).toFixed(2));
  const grandTotal      = parseFloat((discountedSub + gstAmount).toFixed(2));

  const getProductImage = (name) => {
    const n = name?.toLowerCase() || "";
    if (n.includes("lays"))  return "/lays.jpg";
    if (n.includes("coca"))  return "/cocacola.jpg";
    if (n.includes("dairy")) return "/dairymilk.jpg";
    if (n.includes("water")) return "/water.jpg";
    if (n.includes("brownie")) return "/brownie.jpg";
    return "/snacks.jpg";
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;
    setProducts(prev =>
      prev.map(p => p.id === product.id ? { ...p, stock: p.stock - 1, isUpdating: true } : p)
    );
    setTimeout(() =>
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isUpdating: false } : p)), 400
    );
    const existing = cart.find(i => i.id === product.id);
    if (existing) setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    else          setCart([...cart, { ...product, quantity: 1 }]);
  };

  const handleApplyOffer = () => {
    if (selectedOffer === "PERCENTAGE") {
      setAppliedOffer({ type: "PERCENTAGE", label: `10% discount applied! You save ₹${(subtotal * 0.10).toFixed(2)}` });
    } else if (selectedOffer === "FREE_PRODUCT" && selectedFreeProduct) {
      setAppliedOffer({ type: "FREE_PRODUCT", label: `Free ${selectedFreeProduct.name} added!`, freeProduct: selectedFreeProduct });
    }
    setShowOfferPanel(false);
  };

  // ─── Payment ──────────────────────────────────────────────────────────────
  const handlePayment = async () => {
    if (!selectedProduct && cart.length === 0) return;
    if (paymentMethod === "Card") {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        alert("Please fill all card details"); return;
      }
    }
    if (paymentMethod === "Cash" && Number(cashAmount) < grandTotal) {
      alert("Insufficient cash inserted"); return;
    }

    setIsProcessing(true);
    try {
      // ✅ NEW payload — backend calculates GST from productId
      const payload = {
        paymentMethod,
        userId: user?.id || 1,
        upiId: paymentMethod === "UPI" ? upiId : null,
        cartOfferType:      appliedOffer?.type || null,
        cartFreeProductId:  appliedOffer?.freeProduct?.id || null,
      };

      if (selectedProduct?.isCart) {
        payload.cartItems = cart;
        // For cart, send first item's id as fallback (backend should handle multi-item)
        payload.productId = cart[0]?.id;
        payload.quantity  = cart.reduce((s, i) => s + i.quantity, 0);
      } else {
        payload.productId = selectedProduct.id;
        payload.quantity  = quantity;
      }

      const res = await axios.post(`${API}/api/pay`, payload);
      setPaymentResult(res.data);
      setIsProcessing(false);

      // ✅ If free product offer was applied, call /api/discount/apply
      if (res.data.success && appliedOffer?.type === "FREE_PRODUCT" && appliedOffer?.freeProduct) {
        await axios.post(`${API}/api/discount/apply`, {
          productId:     appliedOffer.freeProduct.id,
          cartTotal:     grandTotal,
          userId:        user?.id || 1,
          paymentMethod: "DISCOUNT",
        });
      }

      if (res.data.success) {
        fetchProducts();
        setCart([]);
        setTimeout(() => {
          setSelectedProduct(null);
          setPaymentResult(null);
          setQuantity(1);
          setAppliedOffer(null);
          setUpiId("");
        }, 4000);
      }
    } catch (err) {
      setIsProcessing(false);
      setPaymentResult({ success: false, message: "Payment Failed" });
    }
  };

  const closeAll = () => {
    if (!isProcessing) {
      setShowCart(false); setSelectedProduct(null);
      setShowGuide(false); setShowSupport(false);
    }
  };

  // ─── GST breakdown row helper ─────────────────────────────────────────────
  const GstBreakdown = () => (
    <div style={styles.gstBox}>
      <div style={styles.gstTitle}>Tax Breakdown (GST)</div>
      <div style={styles.gstRow}>
        <span>HSN Code</span>
        <span style={styles.gstVal}>{selectedProduct?.hsn_code || "—"}</span>
      </div>
      <div style={styles.gstRow}>
        <span>CGST ({cgstPercent.toFixed(1)}%)</span>
        <span style={styles.gstVal}>₹{cgstAmount.toFixed(2)}</span>
      </div>
      <div style={styles.gstRow}>
        <span>SGST ({sgstPercent.toFixed(1)}%)</span>
        <span style={styles.gstVal}>₹{sgstAmount.toFixed(2)}</span>
      </div>
      <div style={{ ...styles.gstRow, borderTop: "1px solid #e0e0e0", paddingTop: 6, marginTop: 4 }}>
        <span style={{ fontWeight: 700 }}>Total GST ({gstPercent}%)</span>
        <span style={{ ...styles.gstVal, fontWeight: 700 }}>₹{gstAmount.toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="info" variant="filled" sx={{ borderRadius: "15px" }}>{notification}</Alert>
      </Snackbar>

      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoIcon}>V</div>
          <h1 style={styles.logoText}>
            SMART <span style={{ color: "var(--accent)" }}>VENDING</span>
          </h1>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.dateTime}>
            <div style={styles.time}>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            <div style={styles.date}>{currentTime.toLocaleDateString()}</div>
          </div>
          <button style={styles.cartBtn} onClick={() => setShowCart(true)}>
            <span style={{ fontSize: "1.2rem" }}>🛒</span>
            <span style={styles.cartCount}>{cart.length}</span>
          </button>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div style={styles.content}>
        <div style={{ ...styles.grid, filter: (selectedProduct || showCart) ? "blur(15px)" : "none" }}>
          {products.map((product) => {
            const soldOut = product.stock <= 0;
            return (
              <div 
  key={product.id} 
  style={{
    ...styles.productCard,
    background: soldOut ? "#000" : "var(--surface)",
    color: soldOut ? "#fff" : "var(--ink)",
    opacity: soldOut ? 0.7 : 1
  }}
>
                <div style={styles.imgWrapper}>
                  <img src={getProductImage(product.name)} alt={product.name} style={styles.productImg} />
                </div>
                <h3 style={{ 
  ...styles.nameText, 
  color: soldOut ? "#fff" : "inherit" 
}}>
  {product.name}
</h3>
{soldOut && (
  <div style={{ color: "#ff5252", fontWeight: "bold" }}>
    SOLD OUT
  </div>
)}

                {/* ✅ Show GST % badge on product card */}
                {product.gst_percent > 0 && (
                  <div style={styles.gstBadge}>GST {product.gst_percent}%</div>
                )}

                <div style={styles.cardBottom}>
                  <div style={styles.priceContainer}>
                    <span style={styles.currency}>₹</span>
                    <span style={styles.priceVal}>{product.price}</span>
                  </div>
                  <div
                    style={{ ...styles.stockBadge, backgroundColor: soldOut ? "#ffebee" : "#e0f2f1", color: soldOut ? "#c62828" : "#00897b" }}
                    className={product.isUpdating ? "stock-pulse" : ""}
                  >
                    {soldOut ? "SOLD OUT" : `${product.stock} Left`}
                  </div>
                </div>

                <button
                  disabled={soldOut}
                  style={{ ...styles.buyBtn, opacity: soldOut ? 0.5 : 1 }}
                  onClick={() => handleAddToCart(product)}
                >
                  {soldOut ? "UNAVAILABLE" : "ADD TO CART"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div style={styles.bottomNav}>
        <div onClick={() => setShowGuide(true)} style={styles.navItem}>📖 User Guide</div>
        <div style={styles.navSeparator} />
        <div onClick={() => setShowSupport(true)} style={styles.navItem}>📞 Help Center</div>
      </div>

      {/* ── Modal Overlay ── */}
      {(showCart || selectedProduct || showGuide || showSupport) && (
        <div style={styles.overlay} onClick={closeAll}>
          <div style={styles.glassModal} onClick={e => e.stopPropagation()}>
            <button style={styles.closeIcon} onClick={closeAll}>✕</button>

            {/* ── Cart ── */}
            {showCart && (
              <div style={styles.modalBody}>
                <h2 style={styles.modalTitle}>Your Shopping Cart</h2>
                {cart.length === 0 ? (
                  <p style={{ color: "#777" }}>Your cart is empty.</p>
                ) : (
                  <>
                    <div style={styles.cartScroll}>
                      {cart.map(item => (
                        <div key={item.id} style={styles.cartRow}>
                          <div style={{ flex: 1, fontWeight: "600" }}>{item.name}</div>
                          {/* ✅ GST % next to item */}
                          {item.gst_percent > 0 && (
                            <span style={styles.cartGstTag}>GST {item.gst_percent}%</span>
                          )}
                          <div style={styles.qtyControls}>
                            <button style={styles.circleBtn} onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c))}>-</button>
                            <span style={{ minWidth: "20px" }}>{item.quantity}</span>
                            <button style={styles.circleBtn} onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))}>+</button>
                          </div>
                          <div style={{ minWidth: "70px", textAlign: "right", fontWeight: "bold" }}>₹{item.price * item.quantity}</div>
                          <button style={styles.delBtn} onClick={() => setCart(cart.filter(c => c.id !== item.id))}>🗑</button>
                        </div>
                      ))}
                    </div>
                    <div style={styles.checkoutBox}>
                      <div style={styles.totalLine}>
                        <span>Total Payable</span>
                        <span>₹{cart.reduce((t, i) => t + i.price * i.quantity, 0)}</span>
                      </div>
                      <button
                        style={styles.payNowBtn}
                        onClick={() => {
                          setShowCart(false);
                          setSelectedProduct({
                            name: "Cart Checkout",
                            price: cart.reduce((t, i) => t + i.price * i.quantity, 0),
                            isCart: true,
                          });
                        }}
                      >
                        PROCEED TO PAY
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Checkout ── */}
            {selectedProduct && (
              <div style={styles.modalBody}>
                <h2 style={styles.modalTitle}>Secure Checkout</h2>

                {/* ✅ Price Summary with real GST breakdown */}
                <div style={styles.summaryCard}>
                  <div style={styles.sumRow}><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  {appliedOffer?.type === "PERCENTAGE" && (
                    <div style={{ ...styles.sumRow, color: "#e65100" }}>
                      <span>Offer Discount (10%)</span>
                      <span>-₹{(subtotal * 0.10).toFixed(2)}</span>
                    </div>
                  )}
                  {appliedOffer?.type === "FREE_PRODUCT" && (
                    <div style={{ ...styles.sumRow, color: "#e65100" }}>
                      <span>Free Gift</span>
                      <span>🎁 {appliedOffer.freeProduct.name}</span>
                    </div>
                  )}
                  <div style={styles.sumRow}>
                    <span>CGST ({cgstPercent.toFixed(1)}%)</span>
                    <span>₹{cgstAmount.toFixed(2)}</span>
                  </div>
                  <div style={styles.sumRow}>
                    <span>SGST ({sgstPercent.toFixed(1)}%)</span>
                    <span>₹{sgstAmount.toFixed(2)}</span>
                  </div>
                  <div style={styles.sumTotal}>
                    <span>Amount Due</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* ✅ Detailed GST breakdown box (HSN, CGST, SGST) */}
                {!selectedProduct.isCart && <GstBreakdown />}

                {/* ── Offer Banner ── */}
                {offerData?.eligible && !appliedOffer && !showOfferPanel && (
                  <div onClick={() => setShowOfferPanel(true)} style={styles.offerBanner}>
                    <span style={{ fontSize: "1.2rem" }}>🎉</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#e65100" }}>Special offer available!</div>
                      <div style={{ fontSize: "0.75rem", color: "#777" }}>Tap to claim: 10% off or a free bonus item</div>
                    </div>
                  </div>
                )}

                {appliedOffer && (
                  <div style={styles.appliedBadge}>
                    <span>{appliedOffer.type === "PERCENTAGE" ? "💰" : "🎁"} {appliedOffer.label}</span>
                    <span
                      style={{ cursor: "pointer", color: "#999", fontSize: "0.78rem", textDecoration: "underline" }}
                      onClick={() => { setAppliedOffer(null); setSelectedOffer(null); setSelectedFreeProduct(null); }}
                    >Remove</span>
                  </div>
                )}

                {/* ── Offer Picker ── */}
                {showOfferPanel && offerData?.eligible && (
                  <div style={styles.offerPanel}>
                    <div style={{ fontWeight: 800, marginBottom: 12, fontSize: "1rem" }}>🎁 Choose your reward:</div>
                    <div
                      onClick={() => { setSelectedOffer("PERCENTAGE"); setSelectedFreeProduct(null); }}
                      style={{ ...styles.offerOption, border: selectedOffer === "PERCENTAGE" ? "2px solid #f7971e" : "2px solid #eee", background: selectedOffer === "PERCENTAGE" ? "#fff8e1" : "#fafafa" }}
                    >
                      <span style={{ fontSize: "1.4rem" }}>💰</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>10% Off Your Order</div>
                        <div style={{ fontSize: "0.78rem", color: "#888" }}>Save ₹{(subtotal * 0.10).toFixed(2)} → Pay ₹{(subtotal * 0.90 + cgstAmount + sgstAmount).toFixed(2)}</div>
                      </div>
                    </div>

                    {offerData.offers.freeProduct?.options?.length > 0 && (
                      <>
                        <div
                          onClick={() => setSelectedOffer("FREE_PRODUCT")}
                          style={{ ...styles.offerOption, border: selectedOffer === "FREE_PRODUCT" ? "2px solid #f7971e" : "2px solid #eee", background: selectedOffer === "FREE_PRODUCT" ? "#fff8e1" : "#fafafa" }}
                        >
                          <span style={{ fontSize: "1.4rem" }}>🎁</span>
                          <div>
                            <div style={{ fontWeight: 700 }}>Free Bonus Product</div>
                            <div style={{ fontSize: "0.78rem", color: "#888" }}>Get a complimentary item — on us!</div>
                          </div>
                        </div>
                        {selectedOffer === "FREE_PRODUCT" && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 8 }}>
                            {offerData.offers.freeProduct.options.map(p => (
                              <div
                                key={p.id}
                                onClick={() => setSelectedFreeProduct(p)}
                                style={{ border: selectedFreeProduct?.id === p.id ? "2px solid #f7971e" : "2px solid #eee", borderRadius: 12, padding: 8, cursor: "pointer", textAlign: "center", background: selectedFreeProduct?.id === p.id ? "#fff8e1" : "#fafafa" }}
                              >
                                <div style={{ fontSize: "1.8rem" }}>
                                  {p.name.toLowerCase().includes("lays") ? "🍟" :
                                   p.name.toLowerCase().includes("coca") ? "🥤" :
                                   p.name.toLowerCase().includes("dairy") ? "🍫" : "📦"}
                                </div>
                                <div style={{ fontSize: "0.7rem", fontWeight: 600 }}>{p.name}</div>
                                <div style={{ fontSize: "0.7rem", color: "#e65100", fontWeight: 700 }}>FREE</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button onClick={() => { setShowOfferPanel(false); setSelectedOffer(null); }}
                        style={{ ...styles.payNowBtn, background: "#eee", color: "#333", padding: "12px", flex: 1 }}>
                        Skip
                      </button>
                      <button
                        disabled={!selectedOffer || (selectedOffer === "FREE_PRODUCT" && !selectedFreeProduct)}
                        onClick={handleApplyOffer}
                        style={{ ...styles.payNowBtn, background: selectedOffer ? "#e65100" : "#ccc", padding: "12px", flex: 1 }}>
                        Apply →
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Payment Methods ── */}
                <div style={styles.payMethods}>
                  {["UPI", "Card", "Cash"].map(m => (
                    <div key={m} onClick={() => setPaymentMethod(m)}
                      style={{ ...styles.payTab, borderColor: paymentMethod === m ? "#c8f04e" : "#eee", backgroundColor: paymentMethod === m ? "#e0f7fa" : "#fff" }}>
                      {m}
                    </div>
                  ))}
                </div>

                {/* ✅ UPI: QR + UPI ID input */}
                {paymentMethod === "UPI" && (
                  <div style={styles.qrContainer}>
                    <QRCodeCanvas
                      value={`upi://pay?pa=vendingmachine@upi&pn=SmartVending&am=${grandTotal.toFixed(2)}&cu=INR`}
                      size={160}
                    />
                    <p style={styles.qrLabel}>Scan QR to complete payment</p>
                    <input
                      type="text"
                      placeholder="Enter your UPI ID (e.g. name@upi)"
                      style={{ ...styles.input, marginTop: 10, textAlign: "center" }}
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                    />
                    <p style={{ fontSize: "0.72rem", color: "#aaa", marginTop: 4 }}>
                      Optional — needed for receipt & refunds
                    </p>
                  </div>
                )}

                {paymentMethod === "Card" && (
                  <div style={styles.cardForm}>
                    <input type="text" placeholder="Card Number (16-digit)" style={styles.input} value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })} />
                    <input type="text" placeholder="Cardholder Name" style={styles.input} value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })} />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input type="text" placeholder="MM/YY" style={{ ...styles.input, flex: 1 }} value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                      <input type="password" placeholder="CVV" style={{ ...styles.input, flex: 1 }} value={cardDetails.cvv} onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                    </div>
                  </div>
                )}

                {paymentMethod === "Cash" && (
                  <div style={styles.cashForm}>
                    <p style={styles.cashLabel}>Insert currency into the machine slot</p>
                    <div style={styles.cashInputWrapper}>
                      <span style={styles.cashCurrency}>₹</span>
                      <input type="number" placeholder="0.00" style={styles.cashInput} value={cashAmount} onChange={e => setCashAmount(e.target.value)} />
                    </div>
                    {cashAmount && Number(cashAmount) >= grandTotal && (
                      <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: "bold", display: "block", textAlign: "center", mt: 1 }}>
                        Change: ₹{(Number(cashAmount) - grandTotal).toFixed(2)}
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ color: "#888", display: "block", textAlign: "center", mt: 1 }}>
                      Machine accepts: ₹10, ₹20, ₹50, ₹100, ₹500
                    </Typography>
                  </div>
                )}

                <button style={styles.payNowBtn} onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? "PROCESSING..." : `CONFIRM & PAY ₹${grandTotal.toFixed(2)}`}
                </button>

                {/* ✅ Success message with GST receipt breakdown */}
                {paymentResult && (
                  <div style={{
                    marginTop: 16, padding: 16, borderRadius: 12, textAlign: "center",
                    background: paymentResult.success ? "#e8f5e9" : "#ffebee",
                    color: paymentResult.success ? "#2e7d32" : "#c62828",
                    fontWeight: 800
                  }}>
                    {paymentResult.success ? "✅ Payment Successful!" : "❌ Payment Failed"}
                    {paymentResult.success && paymentResult.breakdown && (
                      <div style={{ marginTop: 10, fontSize: "0.8rem", fontWeight: 400, textAlign: "left", background: "#f1f8e9", borderRadius: 8, padding: "10px 14px", color: "#33691e" }}>
                        <div style={{ fontWeight: 700, marginBottom: 6 }}>🧾 GST Receipt</div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>HSN Code</span><span>{paymentResult.breakdown.hsnCode || "—"}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Base Amount</span><span>₹{paymentResult.breakdown.baseAmount}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>CGST ({paymentResult.breakdown.cgstPercent}%)</span><span>₹{paymentResult.breakdown.cgstAmount}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>SGST ({paymentResult.breakdown.sgstPercent}%)</span><span>₹{paymentResult.breakdown.sgstAmount}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid #aed581", paddingTop: 6, marginTop: 4 }}>
                          <span>Total Paid</span><span>₹{paymentResult.breakdown.totalAmount}</span>
                        </div>
                      </div>
                    )}
                    {paymentResult.success && appliedOffer?.freeProduct && (
                      <div style={{ fontSize: "0.85rem", marginTop: 8 }}>🎁 Free {appliedOffer.freeProduct.name} is being dispensed!</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {(showGuide || showSupport) && (
              <div style={styles.modalBody}>
                <h2 style={styles.modalTitle}>{showGuide ? "User Guide" : "Support"}</h2>
                <p style={{ lineHeight: "1.6", color: "#555" }}>
                  {showGuide
                    ? "1. Add snacks to cart. 2. Tap checkout. 3. Pay via UPI/Card. 4. Collect from tray."
                    : "Technical issues? Call +91 98765 43210 or email support@smartvend.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); color: #ff5252; } 100% { transform: scale(1); } }
        .stock-pulse { animation: pulse 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}

const styles = {
  page: { background: "var(--canvas)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--ink)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "rgba(242,241,237,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" },
  brand: { display: "flex", alignItems: "center", gap: "15px" },
  logoIcon: { background: "var(--accent)", color: "black", padding: "8px 15px", borderRadius: "12px", fontWeight: "800", fontSize: "1.4rem" },
  logoText: { margin: 0, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.02em" },
  headerRight: { display: "flex", alignItems: "center", gap: "40px" },
  dateTime: { textAlign: "right" },
  time: { fontWeight: "800", fontSize: "1.2rem" },
  date: { fontSize: "0.8rem", color: "#95a5a6", fontWeight: "600" },
  cartBtn: { background: "var(--accent)", color: "white", border: "none", padding: "12px 25px", borderRadius: "50px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" },
  cartCount: { background: "var(--accent)", color: "black", borderRadius: "50%", padding: "2px 8px", fontSize: "0.75rem", fontWeight: "bold" },
  content: { padding: "40px 60px 120px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "40px", transition: "all 0.5s ease" },
  productCard: { background: "var(--surface)", borderRadius: "28px", padding: "24px", textAlign: "center", border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", transition: "all 0.25s ease" },
  imgWrapper: { background: "#fafaf8", borderRadius: "20px", padding: "20px", marginBottom: "16px" },
  productImg: { width: "100%", height: "150px", objectFit: "contain" },
  nameText: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", margin: "10px 0 4px" },
  // ✅ GST badge on product card
  gstBadge: { display: "inline-block", background: "#e8f5e9", color: "#2e7d32", fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", marginBottom: 10, border: "1px solid #a5d6a7" },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  priceContainer: { display: "flex", alignItems: "baseline", gap: "2px" },
  currency: { fontWeight: "800", fontSize: "1rem", color: "var(--accent)" },
  priceVal: { fontWeight: 800, fontSize: "1.4rem", fontFamily: "var(--font-display)" },
  stockBadge: { padding: "5px 12px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 600, border: "1px solid var(--border)" },
  buyBtn: { width: "100%", background: "var(--ink)", color: "#fff", border: "none", padding: "14px", borderRadius: "100px", fontFamily: "var(--font-display)", fontWeight: 700, cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.1)", backdropFilter: "blur(10px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  glassModal: { background: "var(--surface)", padding: "40px", borderRadius: "28px", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", maxWidth: "520px", width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" },
  closeIcon: { position: "absolute", top: "20px", right: "20px", border: "none", background: "#f1f2f6", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "1.2rem" },
  modalTitle: { fontWeight: "800", fontSize: "2rem", marginBottom: "24px", letterSpacing: "-1px" },
  modalBody: {},
  cartScroll: { maxHeight: "260px", overflowY: "auto", marginBottom: "20px" },
  cartRow: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 0", borderBottom: "1px solid #f1f2f6", flexWrap: "wrap" },
  // ✅ GST tag inside cart row
  cartGstTag: { fontSize: "0.65rem", fontWeight: 700, background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "100px", border: "1px solid #a5d6a7" },
  qtyControls: { display: "flex", alignItems: "center", gap: 8 },
  circleBtn: { background: "#eee", border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "bold" },
  delBtn: { background: "none", border: "none", cursor: "pointer", color: "#ff5252" },
  checkoutBox: { borderTop: "2px solid var(--accent)", paddingTop: "20px" },
  totalLine: { display: "flex", justifyContent: "space-between", fontSize: "1.4rem", fontWeight: "800", marginBottom: "16px" },
  summaryCard: { background: "#f8f9fa", padding: "20px", borderRadius: "16px", marginBottom: "12px" },
  sumRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#636e72", fontWeight: "600", fontSize: "0.9rem" },
  sumTotal: { display: "flex", justifyContent: "space-between", borderTop: "1px solid #dfe6e9", paddingTop: "12px", fontWeight: "800", fontSize: "1.3rem", color: "#d63031" },
  // ✅ GST breakdown box
  gstBox: { background: "#f0f4ff", border: "1px solid #c5cae9", borderRadius: 14, padding: "14px 18px", marginBottom: 14 },
  gstTitle: { fontSize: "0.75rem", fontWeight: 700, color: "#3949ab", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" },
  gstRow: { display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#555", marginBottom: 4 },
  gstVal: { fontWeight: 600, color: "#333" },
  offerBanner: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#fff3e0", border: "1.5px dashed #f7971e", borderRadius: 16, cursor: "pointer", marginBottom: 14 },
  appliedBadge: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fff8e1", border: "1px solid #ffd200", borderRadius: 12, marginBottom: 14, fontWeight: 700, fontSize: "0.85rem", color: "#e65100" },
  offerPanel: { background: "#fafafa", border: "1.5px solid #f7971e", borderRadius: 20, padding: 18, marginBottom: 14 },
  offerOption: { display: "flex", alignItems: "center", gap: 12, padding: "14px", borderRadius: 14, cursor: "pointer", marginBottom: 10, transition: "all 0.2s" },
  payMethods: { display: "flex", gap: "10px", marginBottom: "16px" },
  payTab: { flex: 1, padding: "14px", borderRadius: "14px", textAlign: "center", cursor: "pointer", fontWeight: "800", border: "2px solid #eee" },
  qrContainer: { textAlign: "center", padding: "20px", background: "#fafafa", borderRadius: "20px", border: "1px solid #eee", marginBottom: "16px" },
  qrLabel: { marginTop: "12px", color: "#636e72", fontSize: "0.9rem" },
  cardForm: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px", background: "#f8f9fa", padding: "16px", borderRadius: "16px" },
  input: { padding: "14px", borderRadius: "12px", border: "1px solid #dfe6e9", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  cashForm: { textAlign: "center", padding: "20px", background: "#e0f2f1", borderRadius: "20px", marginBottom: "16px" },
  cashLabel: { fontWeight: "700", color: "#00796b", marginBottom: "12px" },
  cashInputWrapper: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "white", borderRadius: "15px", padding: "10px 20px" },
  cashCurrency: { fontSize: "1.5rem", fontWeight: "800", color: "var(--accent)" },
  cashInput: { border: "none", fontSize: "1.8rem", fontWeight: "800", width: "120px", outline: "none", color: "#2d3436" },
  payNowBtn: { width: "100%", padding: "18px", background: "#2d3436", color: "white", border: "none", borderRadius: "16px", fontWeight: "800", fontSize: "1rem", cursor: "pointer" },
  bottomNav: { position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", background: "var(--accent)", padding: "12px 35px", borderRadius: "50px", boxShadow: "0 10px 25px rgba(200,240,78,0.4)", display: "flex", alignItems: "center", gap: "30px", zIndex: 100, border: "2px solid rgba(255,255,255,0.2)" },
  navItem: { fontWeight: "800", fontSize: "0.95rem", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: "8px" },
  navSeparator: { width: "1px", height: "20px", background: "rgba(255,255,255,0.3)" },
};

export default ProductList;