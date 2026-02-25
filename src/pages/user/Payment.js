import React, { useState } from "react";
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
  CircularProgress
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Payment() {
  const location = useLocation();
  const product = location.state;

  const [method, setMethod] = useState("UPI");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!product) {
    return <h2>No product selected</h2>;
  }

  const generateUPILink = () => {
    const upiId = "vendingmachine@upi";
    const name = "Smart Vending Machine";
    const amount = product.price;

    return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/pay", {
        productId: product.id,
        amount: product.price,
        paymentMethod: method,
      });

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setResult(res.data);
      }, 2000); // simulate payment processing

    } catch (err) {
      setLoading(false);
      alert("Payment error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #1f4037, #99f2c8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: 400, p: 3, borderRadius: 4 }}>
        <CardContent>

          {!success ? (
            <>
              <Typography variant="h5" align="center" gutterBottom>
                Pay ₹{product.price}
              </Typography>

              <Typography align="center" color="text.secondary">
                {product.name}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Select
                  fullWidth
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                </Select>
              </Box>

              {method === "UPI" && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="body2">
                    Scan QR using Google Pay / PhonePe
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <QRCodeCanvas
                      value={generateUPILink()}
                      size={200}
                    />
                  </Box>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, borderRadius: 3 }}
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Pay Now"}
              </Button>
            </>
          ) : (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 80,
                  color: "green",
                  animation: "pop 0.5s ease-in-out"
                }}
              />
              <Typography variant="h6" mt={2}>
                Payment Successful 🎉
              </Typography>
              {result?.transactionId && (
                <Typography variant="body2" mt={1}>
                  Transaction ID: {result.transactionId}
                </Typography>
              )}
            </Box>
          )}

        </CardContent>
      </Card>

      {/* Animation CSS */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}

export default Payment;