import React, { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentResult, setPaymentResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔗 Generate UPI Payment Link
  const generateUPILink = () => {
    if (!selectedProduct) return "";

    const upiId = "vendingmachine@upi";
    const name = "Vending Machine";
    const amount = selectedProduct.price;

    return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
  };

  // 🔁 Fetch Products
  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 💳 Handle Payment
  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      const res = await axios.post("http://localhost:5000/api/pay", {
        productId: selectedProduct.id,
        amount: selectedProduct.price,
        paymentMethod: paymentMethod,
      });

      setPaymentResult(res.data);
      setIsProcessing(false);

      if (res.data.status === "SUCCESS") {
        fetchProducts();

        // Auto close payment after 3 seconds
        setTimeout(() => {
          setSelectedProduct(null);
          setPaymentResult(null);
        }, 3000);
      }

    } catch (error) {
      setIsProcessing(false);
      alert("Payment failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vending Machine Products</h2>

      {/* 📦 PRODUCT LIST */}
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px"
          }}
        >
          <h3>{product.name}</h3>
          <p>Price: ₹{product.price}</p>
          <p>Stock: {product.stock}</p>

          <button
            disabled={product.stock <= 0}
            onClick={() => {
              setSelectedProduct(product);
              setPaymentResult(null);
            }}
          >
            BUY
          </button>
        </div>
      ))}

      {/* 💳 PAYMENT SECTION */}
      {selectedProduct && (
        <div
          style={{
            border: "2px solid green",
            padding: "15px",
            marginTop: "20px"
          }}
        >
          <h3>Payment for {selectedProduct.name}</h3>
          <p>Amount: ₹{selectedProduct.price}</p>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
          </select>

          <br /><br />

          {/* 🔲 SHOW QR ONLY FOR UPI */}
          {paymentMethod === "UPI" && (
            <div style={{ marginBottom: "15px" }}>
              <p>Scan QR to Pay</p>
              <QRCodeCanvas
                value={generateUPILink()}
                size={200}
              />
            </div>
          )}

          {/* ⏳ Processing Message */}
          {isProcessing && (
            <p style={{ color: "orange" }}>
              Processing payment... Please wait
            </p>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>

          {/* ✅ Payment Result */}
          {paymentResult && (
            <div style={{ marginTop: "15px" }}>
              <p>{paymentResult.message}</p>

              {paymentResult.transactionId && (
                <p>Transaction ID: {paymentResult.transactionId}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductList;
