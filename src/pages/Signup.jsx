import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField,
  InputAdornment, IconButton
} from "@mui/material";
import {
  Visibility, VisibilityOff,
  Email, Lock, Person, ArrowBack
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const injectStyles = () => {
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

const inputSx = {
  mb: 2,
  "& .MuiInputBase-root": {
    fontFamily: "var(--font-body)",
    borderRadius: "14px",
    border: "1px solid var(--border)",
    background: "#fff"
  }
};

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirm: ""
  });

  useEffect(() => injectStyles(), []);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    // ── Validations ──────────────────────────────────
    if (!formData.name.trim()) {
      return setError("Please enter your name.");
    }
    if (!formData.email.includes("@")) {
      return setError("Please enter a valid email.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (formData.password !== formData.confirm) {
      return setError("Passwords do not match.");
    }

    try {
      await axios.post("http://localhost:5000/api/register", {
        name:     formData.name,
        email:    formData.email,
        password: formData.password,
        role:     "user"           // always register as normal user
      });

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Try again.";
      // Friendly message for duplicate email
      if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
        setError("This email is already registered. Please login.");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <Box sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--canvas)",
      position: "relative"
    }}>

      {/* BACK BUTTON */}
      <IconButton
        onClick={() => navigate("/login")}
        sx={{ position: "absolute", top: 30, left: 30, border: "1px solid var(--border)" }}
      >
        <ArrowBack />
      </IconButton>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{
          width: 400,
          p: 5,
          borderRadius: "28px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
        }}>

          {/* TITLE */}
          <Typography sx={{
            fontFamily: "var(--font-display)",
            fontSize: "2.2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            mb: 1
          }}>
            Sign Up <span style={{ color: "var(--accent)" }}>.</span>
          </Typography>

          <Typography sx={{ fontSize: "0.9rem", color: "var(--ink-soft)", mb: 4 }}>
            Create your account to get started
          </Typography>

          {/* NAME */}
          <TextField
            fullWidth
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          {/* EMAIL */}
          <TextField
            fullWidth
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            placeholder="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            sx={inputSx}
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

          {/* CONFIRM PASSWORD */}
          <TextField
            fullWidth
            placeholder="Confirm Password"
            name="confirm"
            type={showConfirm ? "text" : "password"}
            value={formData.confirm}
            onChange={handleChange}
            sx={{ ...inputSx, mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* ERROR */}
          {error && (
            <Typography sx={{
              mb: 2, fontSize: "0.82rem", color: "#d32f2f",
              background: "#ffebee", borderRadius: "10px",
              px: 2, py: 1, fontWeight: 600
            }}>
              ⚠️ {error}
            </Typography>
          )}

          {/* SUCCESS */}
          {success && (
            <Typography sx={{
              mb: 2, fontSize: "0.82rem", color: "#2e7d32",
              background: "#e8f5e9", borderRadius: "10px",
              px: 2, py: 1, fontWeight: 600
            }}>
              ✅ {success}
            </Typography>
          )}

          {/* BUTTON */}
          <Button
            fullWidth
            onClick={handleSignup}
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
            Create Account
          </Button>

          {/* FOOTER */}
          <Typography sx={{
            mt: 3, fontSize: "0.85rem",
            textAlign: "center", color: "var(--ink-soft)"
          }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}
            >
              Sign In
            </span>
          </Typography>

        </Box>
      </motion.div>
    </Box>
  );
}

export default Signup;