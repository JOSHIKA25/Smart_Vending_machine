import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch Products from Backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Buy Animation
  const handleBuy = (event) => {
    const cart = document.getElementById("cart-icon");
    if (!cart) return;

    const productCard = event.currentTarget.closest(".product-card");
    const productImage = productCard.querySelector("img");

    const productRect = productImage.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const clone = productImage.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = productRect.left + "px";
    clone.style.top = productRect.top + "px";
    clone.style.width = "80px";
    clone.style.transition = "all 0.8s cubic-bezier(.65,-0.55,.25,1.55)";
    clone.style.zIndex = "9999";

    document.body.appendChild(clone);

    setTimeout(() => {
      clone.style.left = cartRect.left + "px";
      clone.style.top = cartRect.top + "px";
      clone.style.opacity = "0.3";
      clone.style.transform = "scale(0.2)";
    }, 10);

    setTimeout(() => {
      clone.remove();
    }, 800);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", padding: 4 }}>
      
      {/* 🔹 Floating Background */}
      <div className="floating-bg">
        {products.slice(0, 3).map((p, index) => (
          <img
            key={index}
            src={p.image}
            alt=""
            style={{
              left: `${20 + index * 25}%`,
              animationDuration: `${18 + index * 5}s`,
            }}
          />
        ))}
      </div>

      <Typography variant="h4" gutterBottom>
        Smart Vending Products
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              className="product-card"
              sx={{
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.6)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <motion.img
                  src={process.env.PUBLIC_URL + "/" + product.name.toLowerCase().replace(" ", "") + ".png"}
                  alt={product.name}
                  style={{ height: "120px", objectFit: "contain" }}
                />

                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  {product.name}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ color: "green", fontWeight: "bold" }}
                >
                  ₹{product.price}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      product.stock > 10 ? "green" : "red",
                    marginBottom: 2,
                  }}
                >
                  {product.stock > 10
                    ? `In Stock (${product.stock})`
                    : "Low Stock"}
                </Typography>

                <button
  disabled={product.stock <= 0}
  onClick={() => navigate("/user/payment", { state: product })}
>
  BUY NOW
</button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Floating Background CSS */}
      <style>
        {`
          .floating-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
          }

          .floating-bg img {
            position: absolute;
            width: 120px;
            opacity: 0.07;
            animation: float 20s infinite linear;
          }

          @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); }
            100% { transform: translateY(-100vh) rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default Products;