import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Avatar
} from "@mui/material";
import {
  Dashboard,
  Inventory,
  ReceiptLong,
  BarChart,
  Logout,
  Settings,
  Terminal
} from "@mui/icons-material";
import { motion } from "framer-motion";

// 🌿 THEME COLORS (same as dashboard)
const ACCENT = "#c8f04e";
const ACCENT_SOFT = "#f7ffe0";
const TEXT_DARK = "#111";
const TEXT_LIGHT = "#777";

function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Dashboard /> },
    { name: "Products", path: "/admin/products", icon: <Inventory /> },
    { name: "Transactions", path: "/admin/transactions", icon: <ReceiptLong /> },
    { name: "Analytics", path: "/admin/sales", icon: <BarChart /> },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f2f1ed" }}>

      {/* 🌿 SIDEBAR */}
      <Box
        sx={{
          width: "270px",
          bgcolor: "#ffffff",
          borderRight: "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          p: 3,
          position: "sticky",
          top: 0,
          height: "100vh"
        }}
      >

        {/* 🌿 LOGO */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 6 }}>
          <Box
            sx={{
              bgcolor: ACCENT,
              p: 1,
              borderRadius: "12px",
              display: "flex"
            }}
          >
            <Terminal sx={{ color: "#000", fontSize: 20 }} />
          </Box>

          <Typography fontWeight="900" fontSize="1.3rem">
            ADMIN <span style={{ color: ACCENT }}>PRO</span>
          </Typography>
        </Stack>

        {/* 🌿 MENU */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: "700",
              color: TEXT_LIGHT,
              mb: 2
            }}
          >
            MANAGEMENT
          </Typography>

          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
                <motion.div whileTap={{ scale: 0.96 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      mb: 1,
                      borderRadius: "12px",
                      bgcolor: active ? ACCENT_SOFT : "transparent",
                      color: active ? TEXT_DARK : TEXT_LIGHT,
                      fontWeight: active ? "700" : "500",
                      transition: "0.2s",
                      "&:hover": {
                        bgcolor: ACCENT_SOFT,
                        color: TEXT_DARK
                      }
                    }}
                  >
                    <Box sx={{ display: "flex" }}>{item.icon}</Box>
                    <Typography fontSize="0.9rem">
                      {item.name}
                    </Typography>
                  </Box>
                </motion.div>
              </Link>
            );
          })}
        </Box>

        {/* 🌿 PROFILE */}
        <Box sx={{ pt: 2, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: ACCENT, color: "#000", fontWeight: "700" }}>
              AD
            </Avatar>

            <Box>
              <Typography fontSize="0.9rem" fontWeight="700">
                Admin
              </Typography>
              <Typography fontSize="0.75rem" color={TEXT_LIGHT}>
                Full Access
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center">

            <Tooltip title="Settings">
              <IconButton
                size="small"
                onClick={() => navigate("/admin/settings")}
                sx={{
                  color: TEXT_LIGHT,
                  "&:hover": {
                    color: "#000",
                    bgcolor: "#f5f5f5"
                  }
                }}
              >
                <Settings fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton
                size="small"
                onClick={handleLogout}
                sx={{
                  color: "#ff6b6b",
                  "&:hover": {
                    bgcolor: "#ffecec"
                  }
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>

          </Stack>
        </Box>
      </Box>

      {/* 🌿 MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "#f2f1ed"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Sidebar;