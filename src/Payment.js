import React, { useState } from "react";
import axios from "axios";

function Payment({ product }) {
  const [method, setMethod] = useState("UPI");
  const [result, setResult] = useState(null);

  const handlePayment = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/pay", {
        productId: product.id,
        amount: product.price,
        paymentMethod: method,
      });

      setResult(res.data);
    } catch (err) {
      alert("Payment error");
    }
  };

  return (
    <div style={{ border: "1px solid gray", padding: "15px", marginTop: "20px" }}>
      <h3>Payment for {product.name}</h3>
      <p>Amount: ₹{product.price}</p>

      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="UPI">UPI</option>
        <option value="Card">Card</option>
        <option value="Cash">Cash</option>
      </select>

      <br /><br />

      <button onClick={handlePayment}>Pay Now</button>

      {result && (
        <div style={{ marginTop: "15px" }}>
          <p>{result.message}</p>
          {result.transactionId && (
            <p>Transaction ID: {result.transactionId}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Payment;
