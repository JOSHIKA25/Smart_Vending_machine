import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Stack
} from "@mui/material";
import { 
  AdminPanelSettings, 
  ArrowBack, 
  Lock, 
  AlternateEmail,
  Visibility,
  VisibilityOff 
} from "@mui/icons-material";
import axios from "axios";
import { motion } from "framer-motion";

// 🌿 DASHBOARD COLORS
const ACCENT = "#c8f04e";
const ACCENT_DARK = "#b2e63a";
const TEXT_DARK = "#0a0a0a";
const TEXT_LIGHT = "#666";

// 🌿 FONT INJECTION
const injectFonts = () => {
  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body {
    font-family: var(--font-body) !important;
    background: #f2f1ed;
  }
  `;
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
};

// 🌿 INPUT STYLE (BLACK THEME)
const adminInputStyle = {
  "& .MuiInputBase-root": {
    backgroundColor: "#f7f7f7",
    borderRadius: "14px",
    height: "64px",
    border: "1px solid rgba(0,0,0,0.08)",
    transition: "0.3s",
    "&.Mui-focused": {
      backgroundColor: "#fff",
      borderColor: ACCENT,
      boxShadow: `0 0 12px rgba(200,240,78,0.2)`
    }
  },
  "& .MuiInputLabel-root": {
    color: "#888",
    "&.Mui-focused": {
      color: ACCENT
    }
  },
  "& fieldset": {
    border: "none"
  }
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    injectFonts();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Credentials required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      const user = res.data.user || res.data;

      if (!user || user.role !== "admin") {
        setError("Unauthorized: Admin Access Only");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin/machines");
    } catch (err) {
      setError("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "#f2f1ed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        fontFamily: "var(--font-body)"
      }}
    >

      {/* BACK BUTTON */}
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 30,
          left: 30,
          border: "1px solid rgba(0,0,0,0.1)",
          color: TEXT_DARK,
          "&:hover": {
            bgcolor: ACCENT,
            color: "black"
          }
        }}
      >
        <ArrowBack />
      </IconButton>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Paper
          elevation={0}
          sx={{
            width: 420,
            p: 5,
            borderRadius: "28px",
            border: "1px solid rgba(0,0,0,0.06)",
            background: "#fff",
            textAlign: "center"
          }}
        >

          {/* HEADER */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: ACCENT,
                borderRadius: "18px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2
              }}
            >
              <AdminPanelSettings sx={{ color: "black", fontSize: 32 }} />
            </Box>

            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.5rem"
              }}
            >
              ADMIN PANEL
            </Typography>

            <Typography sx={{ color: TEXT_LIGHT, fontSize: "0.9rem" }}>
              Secure access to management system
            </Typography>
          </Box>

          {/* FORM */}
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={adminInputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail sx={{ color: "#999" }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={adminInputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#999" }} />
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

            {error && (
              <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                py: 1.6,
                borderRadius: "12px",
                bgcolor: ACCENT,
                color: "black",
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                "&:hover": {
                  bgcolor: ACCENT_DARK
                }
              }}
            >
              {loading ? <CircularProgress size={22} /> : "LOGIN"}
            </Button>
          </Stack>

          <Typography sx={{ mt: 4, fontSize: "0.75rem", color: "#aaa" }}>
            VENDING ADMIN SYSTEM
          </Typography>

        </Paper>
      </motion.div>
    </Box>
  );
};

export default AdminLogin;