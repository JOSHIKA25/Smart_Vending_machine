import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Divider,
  Dialog,
  DialogContent,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PercentIcon from "@mui/icons-material/Percent";

// ─── Discount Offer Modal ────────────────────────────────────────────────────
function DiscountModal({ open, cartTotal, onClose, onApply }) {
  const [offerData, setOfferData] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      setFetchLoading(true);
      try {
        const { data } = await axios.post("http://localhost:5000/api/discount/check", {
          cartTotal,
          cartItems: [],
        });
        setOfferData(data);
      } catch {
        setOfferData(null);
      } finally {
        setFetchLoading(false);
      }
    };
    fetch();
  }, [open, cartTotal]);

  const handleApply = () => {
    if (selectedOffer === "PERCENTAGE") {
      onApply({
        type: "PERCENTAGE",
        discountAmount: offerData.offers.discount.discountAmount,
        label: offerData.offers.discount.label,
        freeProduct: null,
      });
    } else if (selectedOffer === "FREE_PRODUCT" && selectedProduct) {
      onApply({
        type: "FREE_PRODUCT",
        discountAmount: 0,
        label: `Free ${selectedProduct.name} added!`,
        freeProduct: selectedProduct,
      });
    }
    onClose();
  };

  const canApply =
    selectedOffer === "PERCENTAGE" ||
    (selectedOffer === "FREE_PRODUCT" && selectedProduct);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
          color: "#fff",
          overflow: "visible",
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        {fetchLoading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#ffd200" }} />
            <Typography sx={{ mt: 2, color: "#a0aec0" }}>Checking your offers...</Typography>
          </Box>
        ) : !offerData?.eligible ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" sx={{ color: "#ffd200", fontWeight: 800 }}>
              No Offers Available
            </Typography>
            <Typography sx={{ color: "#a0aec0", mt: 1, fontSize: "0.9rem" }}>
              {offerData?.message || "Add more items to unlock offers."}
            </Typography>
            <Button onClick={onClose} sx={{ mt: 2, color: "#ffd200" }}>Close</Button>
          </Box>
        ) : (
          <>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Chip
                label="🎉 SPECIAL OFFER"
                size="small"
                sx={{ background: "linear-gradient(90deg,#f7971e,#ffd200)", color: "#1a1a2e", fontWeight: 800, letterSpacing: 1, mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, background: "linear-gradient(90deg,#ffd200,#f7971e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Choose Your Reward
              </Typography>
              <Typography sx={{ color: "#a0aec0", fontSize: "0.82rem" }}>
                Your cart qualifies for an exclusive offer!
              </Typography>
            </Box>

            {/* Offer 1 — 10% Discount */}
            <Box
              onClick={() => { setSelectedOffer("PERCENTAGE"); setSelectedProduct(null); }}
              sx={{
                border: selectedOffer === "PERCENTAGE" ? "2px solid #ffd200" : "2px solid rgba(255,255,255,0.12)",
                borderRadius: 3, p: 1.5, mb: 1.5, cursor: "pointer",
                background: selectedOffer === "PERCENTAGE" ? "rgba(255,210,0,0.1)" : "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", gap: 1.5,
                transition: "all 0.2s",
              }}
            >
              <Box sx={{ bgcolor: "rgba(255,255,255,0.08)", borderRadius: 2, p: 1, display: "flex" }}>
                <PercentIcon sx={{ color: "#ffd200", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography fontWeight={700} fontSize="0.95rem">
                  {offerData.offers.discount.percent}% Off Your Order
                </Typography>
                <Typography sx={{ color: "#a0aec0", fontSize: "0.78rem" }}>
                  {offerData.offers.discount.label} → Pay ₹{offerData.offers.discount.finalTotal}
                </Typography>
              </Box>
            </Box>

            {/* Offer 2 — Free Product */}
            {offerData.offers.freeProduct?.options?.length > 0 && (
              <>
                <Box
                  onClick={() => setSelectedOffer("FREE_PRODUCT")}
                  sx={{
                    border: selectedOffer === "FREE_PRODUCT" ? "2px solid #ffd200" : "2px solid rgba(255,255,255,0.12)",
                    borderRadius: 3, p: 1.5, cursor: "pointer",
                    background: selectedOffer === "FREE_PRODUCT" ? "rgba(255,210,0,0.1)" : "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", gap: 1.5,
                    transition: "all 0.2s",
                  }}
                >
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.08)", borderRadius: 2, p: 1, display: "flex" }}>
                    <CardGiftcardIcon sx={{ color: "#ffd200", fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700} fontSize="0.95rem">Free Bonus Product</Typography>
                    <Typography sx={{ color: "#a0aec0", fontSize: "0.78rem" }}>
                      Get a complimentary item — on us!
                    </Typography>
                  </Box>
                </Box>

                {/* Product picker */}
                {selectedOffer === "FREE_PRODUCT" && (
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, mt: 1.5 }}>
                    {offerData.offers.freeProduct.options.map((p) => (
                      <Box
                        key={p._id}
                        onClick={() => setSelectedProduct(p)}
                        sx={{
                          border: selectedProduct?._id === p._id ? "2px solid #ffd200" : "2px solid rgba(255,255,255,0.1)",
                          borderRadius: 2, p: 1, cursor: "pointer", textAlign: "center",
                          background: selectedProduct?._id === p._id ? "rgba(255,210,0,0.1)" : "rgba(255,255,255,0.04)",
                          transition: "all 0.2s",
                        }}
                      >
                        {p.image
                          ? <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }} />
                          : <Box sx={{ width: 44, height: 44, bgcolor: "rgba(255,255,255,0.08)", borderRadius: 1.5, mx: "auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>📦</Box>
                        }
                        <Typography sx={{ fontSize: "0.68rem", color: "#e2e8f0", mt: 0.5 }}>{p.name}</Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: "#ffd200", fontWeight: 700 }}>₹{p.price}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}

            {/* Savings preview */}
            {canApply && (
              <Box sx={{ bgcolor: "rgba(255,210,0,0.1)", border: "1px solid rgba(255,210,0,0.3)", borderRadius: 2, p: 1, mt: 2, textAlign: "center" }}>
                <Typography sx={{ color: "#ffd200", fontWeight: 700, fontSize: "0.88rem" }}>
                  {selectedOffer === "PERCENTAGE"
                    ? `🎊 You save ₹${offerData.offers.discount.discountAmount}!`
                    : `🎁 Free ${selectedProduct?.name} (₹${selectedProduct?.price}) added!`}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button onClick={onClose} fullWidth variant="outlined"
                sx={{ borderRadius: 2, borderColor: "rgba(255,255,255,0.2)", color: "#a0aec0" }}>
                Skip
              </Button>
              <Button
                onClick={handleApply}
                disabled={!canApply}
                fullWidth variant="contained"
                sx={{
                  borderRadius: 2,
                  background: canApply ? "linear-gradient(90deg,#f7971e,#ffd200)" : "rgba(255,255,255,0.1)",
                  color: canApply ? "#1a1a2e" : "#666",
                  fontWeight: 800,
                }}
              >
                Apply →
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Payment Component ──────────────────────────────────────────────────
function Payment() {
  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const location = useLocation();
  const product = location.state?.product;

  const [method, setMethod] = useState("UPI");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Loyalty (existing)
  const [loyaltyData, setLoyaltyData] = useState({ discount_percent: 0, free_gift: null });

  // Cart-based discount offer (new)
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [cartOffer, setCartOffer] = useState(null); // { type, discountAmount, label, freeProduct }
  const [offerPromptShown, setOfferPromptShown] = useState(false);

  // Card & Cash state
  const [cardDetails, setCardDetails] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [cashAmount, setCashAmount] = useState("");

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${user?.id}/discount`);
        setLoyaltyData(res.data);
      } catch (err) {
        console.error("Error fetching loyalty data:", err);
      }
    };
    if (user?.id) fetchLoyalty();
  }, [user?.id]);

  // Admin guard
  if (user?.role === "admin") {
    return (
      <Box sx={{ p: 5, textAlign: "center", color: "white", mt: 10 }}>
        <Typography variant="h4">Admin Mode</Typography>
        <Typography>Admins cannot make purchases. Switch to a user account.</Typography>
        <Button href="/admin/dashboard" variant="contained" sx={{ mt: 2 }}>Back to Dashboard</Button>
      </Box>
    );
  }

  if (!product) return <h2>No product selected</h2>;

  // ── Price calculations ───────────────────────────────────────────
  const basePrice = product?.price || 0;

  // 1. Loyalty discount (existing)
  const loyaltyDiscountPercent = loyaltyData.discount_percent || 0;
  const loyaltyDiscountAmount = basePrice * (loyaltyDiscountPercent / 100);
  const afterLoyalty = basePrice - loyaltyDiscountAmount;

  // 2. Cart-based offer discount (new — applied after loyalty)
  const cartDiscountAmount = cartOffer?.type === "PERCENTAGE" ? cartOffer.discountAmount : 0;
  const afterCartDiscount = afterLoyalty - cartDiscountAmount;

  // 3. GST on final discounted price

  // Show offer banner only once when price > 150 and no offer applied
  const shouldShowOfferBanner = basePrice > 150 && !cartOffer && !offerPromptShown;

  const generateUPILink = () => {
    const upiId = "vendingmachine@upi";
    const name = "Smart Vending Machine";
    return `upi://pay?pa=${upiId}&pn=${name}&am=${totalPrice.toFixed(2)}&cu=INR`;
  };

  const handlePayment = async () => {
    if (method === "Card") {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        alert("Please fill all card details");
        return;
      }
    }
    if (method === "Cash" && Number(cashAmount) < totalPrice) {
      alert("Insufficient cash inserted");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/pay", {
        cartItems,
        paymentMethod: method,
        userId: user.id,
        amountPaid: totalPrice.toFixed(2),
        gstApplied: gstAmount.toFixed(2),
        freeGiftId: loyaltyData.free_gift?.id,
        cartOfferType: cartOffer?.type || null,
        cartFreeProductId: cartOffer?.freeProduct?._id || null,
      });

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setResult(res.data);
      }, 2000);
    } catch (err) {
      setLoading(false);
      alert("Payment error");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to right, #141e30, #243b55)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card sx={{ width: 420, p: 3, borderRadius: 4 }}>
        <CardContent>
          {!success ? (
            <>
              <Typography variant="h5" align="center" gutterBottom>
                Payment Checkout
              </Typography>
              <Typography align="center" color="text.secondary">{product.name}</Typography>

              {/* ── Existing loyalty badge ── */}
              {loyaltyDiscountPercent > 0 && (
                <Box sx={{ mt: 1, p: 1, bgcolor: "#e8f5e9", borderRadius: 2, border: "1px solid #4caf50", textAlign: "center" }}>
                  <Typography variant="caption" fontWeight="bold" color="#2e7d32">
                    Loyalty Applied: {loyaltyDiscountPercent}% OFF
                    {loyaltyData.free_gift && ` + Free ${loyaltyData.free_gift.name}!`}
                  </Typography>
                </Box>
              )}

              {/* ── NEW: Cart offer prompt banner ── */}
              {shouldShowOfferBanner && (
                <Box
                  onClick={() => { setShowDiscountModal(true); setOfferPromptShown(true); }}
                  sx={{
                    mt: 1.5, p: 1.5,
                    background: "linear-gradient(90deg, #f7971e22, #ffd20022)",
                    border: "1.5px dashed #f7971e",
                    borderRadius: 2, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 1,
                    "&:hover": { background: "linear-gradient(90deg, #f7971e33, #ffd20033)" },
                  }}
                >
                  <LocalOfferIcon sx={{ color: "#f7971e" }} />
                  <Box>
                    <Typography fontWeight={700} fontSize="0.85rem" color="#e65100">
                      🎉 You have a special offer!
                    </Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">
                      Tap to claim: 10% off or a free bonus item
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* ── Applied cart offer badge ── */}
              {cartOffer && (
                <Box sx={{ mt: 1.5, p: 1, bgcolor: "#fff8e1", borderRadius: 2, border: "1px solid #ffd200", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" fontWeight="bold" color="#e65100">
                    {cartOffer.type === "PERCENTAGE" ? "💰" : "🎁"} {cartOffer.label}
                  </Typography>
                  <Typography
                    variant="caption" sx={{ cursor: "pointer", color: "#999", textDecoration: "underline" }}
                    onClick={() => setCartOffer(null)}
                  >
                    Remove
                  </Typography>
                </Box>
              )}

              {/* ── Price breakdown ── */}
              <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">Price:</Typography>
                  <Typography variant="body2">₹{basePrice.toFixed(2)}</Typography>
                </Box>

                {loyaltyDiscountAmount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" color="green">Loyalty Discount ({loyaltyDiscountPercent}%):</Typography>
                    <Typography variant="body2" color="green">-₹{loyaltyDiscountAmount.toFixed(2)}</Typography>
                  </Box>
                )}

                {cartDiscountAmount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" color="#e65100">Offer Discount (10%):</Typography>
                    <Typography variant="body2" color="#e65100">-₹{cartDiscountAmount.toFixed(2)}</Typography>
                  </Box>
                )}

                {cartOffer?.type === "FREE_PRODUCT" && cartOffer.freeProduct && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" color="#e65100">Free Gift:</Typography>
                    <Typography variant="body2" color="#e65100">🎁 {cartOffer.freeProduct.name}</Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">GST (18%):</Typography>
                  <Typography variant="body2">₹{gstAmount.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">₹{totalPrice.toFixed(2)}</Typography>
                </Box>
              </Box>

              {/* ── Payment method ── */}
              <Select fullWidth value={method} onChange={(e) => setMethod(e.target.value)}>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
              </Select>

              {method === "UPI" && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="body2">Scan QR using Google Pay / PhonePe</Typography>
                  <Box sx={{ mt: 2 }}>
                    <QRCodeCanvas value={generateUPILink()} size={200} />
                  </Box>
                </Box>
              )}

              {method === "Card" && (
                <Box sx={{ mt: 3 }}>
                  <TextField fullWidth label="Card Number" margin="dense" value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} />
                  <TextField fullWidth label="Card Holder Name" margin="dense" value={cardDetails.name} onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })} />
                  <TextField fullWidth label="Expiry (MM/YY)" margin="dense" value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                  <TextField fullWidth label="CVV" type="password" margin="dense" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                </Box>
              )}

              {method === "Cash" && (
                <Box sx={{ mt: 3 }}>
                  <TextField fullWidth label="Insert Amount" type="number" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
                  {cashAmount && Number(cashAmount) >= totalPrice && (
                    <Typography sx={{ mt: 1 }} color="green">
                      Change: ₹{(Number(cashAmount) - totalPrice).toFixed(2)}
                    </Typography>
                  )}
                </Box>
              )}

              <Button variant="contained" fullWidth sx={{ mt: 3, borderRadius: 3 }} onClick={handlePayment} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${totalPrice.toFixed(2)}`}
              </Button>

              {/* Offer modal */}
              <DiscountModal
                open={showDiscountModal}
                cartTotal={basePrice}
                onClose={() => setShowDiscountModal(false)}
                onApply={(offer) => setCartOffer(offer)}
              />
            </>
          ) : (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: "green" }} />
              <Typography variant="h6" mt={2}>Payment Successful 🎉</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Paid (Incl. GST): ₹{totalPrice.toFixed(2)}
              </Typography>
              {loyaltyData.free_gift && (
                <Typography variant="body2" color="#2e7d32" fontWeight="bold">
                  Free {loyaltyData.free_gift.name} is being dispensed!
                </Typography>
              )}
              {cartOffer?.freeProduct && (
                <Typography variant="body2" color="#e65100" fontWeight="bold">
                  🎁 Bonus {cartOffer.freeProduct.name} is being dispensed!
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Payment;
