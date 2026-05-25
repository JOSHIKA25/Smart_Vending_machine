import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

/* SAME FONT SYSTEM */
const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap');

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

    body {
      background: var(--canvas);
      font-family: var(--font-body);
    }
  `;
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
};

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => injectStyles(), []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.href =
        res.data.role === "admin" ? "/admin/dashboard" : "/user/home";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--canvas)",
        position: "relative"
      }}
    >
      {/* BACK BUTTON */}
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 30,
          left: 30,
          border: "1px solid var(--border)"
        }}
      >
        <ArrowBack />
      </IconButton>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* CARD */}
        <Box
          sx={{
            width: 400,
            p: 5,
            borderRadius: "28px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
          }}
        >
          {/* TITLE (MATCHED STYLE) */}
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: "2.2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              mb: 1
            }}
          >
            Login <span style={{ color: "var(--accent)" }}>.</span>
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "var(--ink-soft)",
              mb: 4
            }}
          >
            Access your dashboard securely
          </Typography>

          {/* INPUTS */}
          <TextField
            fullWidth
            placeholder="Email"
            name="email"
            onChange={handleChange}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                fontFamily: "var(--font-body)",
                borderRadius: "14px",
                border: "1px solid var(--border)",
                background: "#fff"
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            placeholder="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                borderRadius: "14px",
                border: "1px solid var(--border)",
                background: "#fff"
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* BUTTON */}
          <Button
            fullWidth
            onClick={handleLogin}
            sx={{
              py: 1.6,
              borderRadius: "100px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              background: "var(--ink)",
              color: "#fff",
              "&:hover": { background: "#1a1a1a" }
            }}
          >
            Sign In
          </Button>

          {/* FOOTER */}
          <Typography
            sx={{
              mt: 3,
              fontSize: "0.85rem",
              textAlign: "center",
              color: "var(--ink-soft)"
            }}
          >
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{
                color: "var(--accent)",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Create account
            </span>
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}

export default Login;