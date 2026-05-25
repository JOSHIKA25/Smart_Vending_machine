// components/DiscountOffer.jsx
// Drop this into your frontend/src/components/ folder
// Then import and use it inside Payment.js or productlist.js

import React, { useState, useEffect } from "react";
import axios from "axios";

// ─── Inline Styles (no extra CSS file needed) ─────────────────────────────────
const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: "1rem",
  },
  card: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    borderRadius: "20px",
    padding: "2rem",
    maxWidth: "480px", width: "100%",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.2)",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    animation: "popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
  },
  badge: {
    display: "inline-block",
    background: "linear-gradient(90deg, #f7971e, #ffd200)",
    color: "#1a1a2e", fontWeight: 800,
    fontSize: "0.7rem", letterSpacing: "2px",
    padding: "4px 12px", borderRadius: "20px",
    textTransform: "uppercase", marginBottom: "0.75rem",
  },
  title: {
    fontSize: "1.6rem", fontWeight: 800, margin: "0 0 0.25rem",
    background: "linear-gradient(90deg, #ffd200, #f7971e)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: { color: "#a0aec0", fontSize: "0.9rem", marginBottom: "1.5rem" },
  divider: { border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "1.2rem 0" },

  offerBtn: (selected) => ({
    width: "100%", padding: "1rem 1.2rem",
    borderRadius: "14px", border: selected ? "2px solid #ffd200" : "2px solid rgba(255,255,255,0.12)",
    background: selected ? "rgba(255,210,0,0.12)" : "rgba(255,255,255,0.05)",
    color: "#fff", cursor: "pointer", textAlign: "left",
    transition: "all 0.2s", marginBottom: "0.75rem",
    display: "flex", alignItems: "center", gap: "1rem",
  }),
  offerIcon: {
    fontSize: "2rem", flexShrink: 0,
    background: "rgba(255,255,255,0.08)",
    borderRadius: "10px", padding: "6px",
    width: "48px", height: "48px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  offerTitle: { fontWeight: 700, fontSize: "1rem" },
  offerDesc: { color: "#a0aec0", fontSize: "0.82rem", marginTop: "2px" },

  productGrid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.5rem", marginTop: "0.75rem",
  },
  productCard: (selected) => ({
    borderRadius: "10px", padding: "0.5rem",
    border: selected ? "2px solid #ffd200" : "2px solid rgba(255,255,255,0.1)",
    background: selected ? "rgba(255,210,0,0.1)" : "rgba(255,255,255,0.05)",
    cursor: "pointer", textAlign: "center",
    transition: "all 0.2s",
  }),
  productImg: { width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" },
  productName: { fontSize: "0.72rem", marginTop: "4px", color: "#e2e8f0" },
  productPrice: { fontSize: "0.7rem", color: "#ffd200", fontWeight: 700 },

  applyBtn: (disabled) => ({
    width: "100%", padding: "0.9rem",
    background: disabled
      ? "rgba(255,255,255,0.1)"
      : "linear-gradient(90deg, #f7971e, #ffd200)",
    color: disabled ? "#666" : "#1a1a2e",
    fontWeight: 800, fontSize: "1rem",
    border: "none", borderRadius: "12px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s", marginTop: "1rem",
  }),
  closeBtn: {
    position: "absolute", top: "1rem", right: "1rem",
    background: "rgba(255,255,255,0.1)", border: "none",
    color: "#fff", borderRadius: "50%",
    width: "32px", height: "32px",
    cursor: "pointer", fontSize: "1rem",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  savings: {
    background: "rgba(255,210,0,0.12)",
    border: "1px solid rgba(255,210,0,0.3)",
    borderRadius: "10px", padding: "0.75rem",
    textAlign: "center", marginTop: "0.75rem",
    color: "#ffd200", fontWeight: 700, fontSize: "0.95rem",
  },
  progressWrap: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "20px", height: "8px",
    overflow: "hidden", margin: "0.5rem 0",
  },
  progressBar: (pct) => ({
    height: "100%",
    width: `${Math.min(pct, 100)}%`,
    background: "linear-gradient(90deg, #f7971e, #ffd200)",
    borderRadius: "20px",
    transition: "width 0.6s ease",
  }),
};

// ─── Keyframe injection ────────────────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("discount-anim")) {
  const style = document.createElement("style");
  style.id = "discount-anim";
  style.innerHTML = `
    @keyframes popIn {
      from { opacity:0; transform:scale(0.85) translateY(20px); }
      to   { opacity:1; transform:scale(1)    translateY(0);     }
    }
    @keyframes pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(255,210,0,0.4); }
      50%      { box-shadow: 0 0 0 10px rgba(255,210,0,0); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Main Component ────────────────────────────────────────────────────────────
const DiscountOffer = ({ cartTotal = 0, cartItems = [], onOfferApplied, onClose }) => {
  const THRESHOLD = 150;

  const [offerData, setOfferData]           = useState(null);
  const [selectedOffer, setSelectedOffer]   = useState(null);   // "PERCENTAGE" | "FREE_PRODUCT"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading]               = useState(false);
  const [applied, setApplied]               = useState(false);
  const [error, setError]                   = useState("");

  // ── fetch offers on mount ────────────────────────────────────────
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axios.post("/api/discount/check", {
          cartTotal,
          cartItems,
        });
        setOfferData(data);
      } catch (err) {
        setError("Could not load offers. Please try again.");
      }
    };
    fetchOffers();
  }, [cartTotal]);

  // ── apply selected offer ─────────────────────────────────────────
  const handleApply = async () => {
    if (!selectedOffer) return;
    if (selectedOffer === "FREE_PRODUCT" && !selectedProduct) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/discount/apply", {
        cartTotal,
        offerType: selectedOffer,
        selectedProductId: selectedProduct?._id,
      });
      setApplied(true);
      if (onOfferApplied) onOfferApplied(data);   // lift result up to parent
    } catch (err) {
      setError("Failed to apply offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.min((cartTotal / THRESHOLD) * 100, 100);

  // ── Render: Not eligible yet ──────────────────────────────────────
  if (offerData && !offerData.eligible) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={{ ...styles.card, position: "relative" }} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
          <div style={styles.badge}>Special Offer</div>
          <h2 style={styles.title}>Almost There! 🛒</h2>
          <p style={styles.subtitle}>
            Add just <strong style={{ color: "#ffd200" }}>₹{offerData.amountNeeded}</strong> more
            to unlock exclusive rewards!
          </p>
          <div style={styles.progressWrap}>
            <div style={styles.progressBar(progress)} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#a0aec0" }}>
            <span>₹{cartTotal.toFixed(2)}</span>
            <span>₹{THRESHOLD}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Offers available ──────────────────────────────────────
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.card, position: "relative" }} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        {!applied ? (
          <>
            <div style={styles.badge}>🎉 You Qualify!</div>
            <h2 style={styles.title}>Choose Your Reward</h2>
            <p style={styles.subtitle}>
              Your cart total is <strong style={{ color: "#ffd200" }}>₹{cartTotal}</strong>.
              Pick one offer below:
            </p>

            {/* ── Offer 1: 10% Discount ── */}
            {offerData?.offers?.discount && (
              <button
                style={styles.offerBtn(selectedOffer === "PERCENTAGE")}
                onClick={() => { setSelectedOffer("PERCENTAGE"); setSelectedProduct(null); }}
              >
                <div style={styles.offerIcon}>💰</div>
                <div>
                  <div style={styles.offerTitle}>
                    {offerData.offers.discount.percent}% Off Your Order
                  </div>
                  <div style={styles.offerDesc}>
                    {offerData.offers.discount.label} → Pay only ₹{offerData.offers.discount.finalTotal}
                  </div>
                </div>
              </button>
            )}

            {/* ── Offer 2: Free Bonus Product ── */}
            {offerData?.offers?.freeProduct?.options?.length > 0 && (
              <button
                style={styles.offerBtn(selectedOffer === "FREE_PRODUCT")}
                onClick={() => setSelectedOffer("FREE_PRODUCT")}
              >
                <div style={styles.offerIcon}>🎁</div>
                <div>
                  <div style={styles.offerTitle}>Free Bonus Product</div>
                  <div style={styles.offerDesc}>
                    Get a complimentary item added to your order — on us!
                  </div>
                </div>
              </button>
            )}

            {/* ── Product picker (shown when FREE_PRODUCT chosen) ── */}
            {selectedOffer === "FREE_PRODUCT" && (
              <div style={styles.productGrid}>
                {offerData.offers.freeProduct.options.map((p) => (
                  <div
                    key={p._id}
                    style={styles.productCard(selectedProduct?._id === p._id)}
                    onClick={() => setSelectedProduct(p)}
                  >
                    {p.image
                      ? <img src={p.image} alt={p.name} style={styles.productImg} />
                      : <div style={{ ...styles.productImg, background: "rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem" }}>📦</div>
                    }
                    <div style={styles.productName}>{p.name}</div>
                    <div style={styles.productPrice}>₹{p.price}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Savings preview ── */}
            {selectedOffer === "PERCENTAGE" && offerData?.offers?.discount && (
              <div style={styles.savings}>
                You save ₹{offerData.offers.discount.discountAmount} on this order 🎊
              </div>
            )}
            {selectedOffer === "FREE_PRODUCT" && selectedProduct && (
              <div style={styles.savings}>
                Free <strong>{selectedProduct.name}</strong> (worth ₹{selectedProduct.price}) added! 🎊
              </div>
            )}

            {error && (
              <p style={{ color: "#fc8181", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</p>
            )}

            <button
              style={styles.applyBtn(
                !selectedOffer || (selectedOffer === "FREE_PRODUCT" && !selectedProduct) || loading
              )}
              onClick={handleApply}
              disabled={!selectedOffer || (selectedOffer === "FREE_PRODUCT" && !selectedProduct) || loading}
            >
              {loading ? "Applying..." : "Apply Offer & Proceed →"}
            </button>
          </>
        ) : (
          /* ── Success state ── */
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "0.75rem" }}>🎉</div>
            <h2 style={styles.title}>Offer Applied!</h2>
            <p style={{ color: "#a0aec0", marginBottom: "1.5rem" }}>
              Your reward has been added to your order.
            </p>
            <button
              style={{ ...styles.applyBtn(false), marginTop: 0 }}
              onClick={onClose}
            >
              Continue to Payment →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountOffer;
