import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function GlassNavbar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(12px)",
        color: "#111"
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Smart Vending
        </Typography>

        <Box>
          <Button onClick={() => navigate("/user/products")}>
            Browse
          </Button>
          <Button onClick={() => navigate("/login-selection")}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default GlassNavbar;