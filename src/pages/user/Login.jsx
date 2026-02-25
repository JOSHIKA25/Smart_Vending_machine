import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    // 🔹 Replace with your real login logic
    if (formData.email === "admin@gmail.com") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/products");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #141e30, #243b55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          boxShadow: 5,
          p: 2,
        }}
      >
        <CardContent>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <LockIcon sx={{ fontSize: 50, color: "#1976d2" }} />
            <Typography variant="h5" mt={1}>
              Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Please login
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Email"
            name="email"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, borderRadius: 3 }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2 }}
            color="text.secondary"
          >
            Smart Vending Machine © 2026
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;