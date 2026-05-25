import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Typography, Box, Grid, Paper, Button, 
  Container, Card, CardContent, Stack, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton
} from "@mui/material";
import { 
  Inventory, AccountBalanceWallet, ReceiptLong, 
  SettingsSuggest, Refresh, Logout
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

// 🌿 THEME COLORS
const ACCENT = "#c8f04e";
const ACCENT_DARK = "#b2e63a";
const ACCENT_SOFT = "#f7ffe0";
const TEXT_DARK = "#0a0a0a";
const TEXT_LIGHT = "#555";

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

// 🌿 CARD STYLE
const cardStyle = {
  background: "#ffffff",
  borderRadius: "24px",
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.05)"
};

function AdminDashboard() {

  const navigate = useNavigate();

  // ✅ FIXED: hooks inside component
  const [alerts, setAlerts] = useState([]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalTransactions: 0
  });

  const [machines] = useState([
    { id: "MVP-001", location: "Main Lobby", status: "Online", stock: "85%" },
    { id: "MVP-002", location: "Cafeteria", status: "Online", stock: "40%" },
    { id: "MVP-003", location: "Library", status: "Offline", stock: "0%" },
  ]);

  const fetchStats = () => {
    axios.get("http://localhost:5000/api/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    injectFonts();
    fetchStats();

    // ✅ FIXED: socket inside useEffect
    const socket = io("http://localhost:5000");

    socket.on("stockUpdated", fetchStats);

    socket.on("productSoldOut", (data) => {
      setAlerts(prev => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const statCards = [
    { title: "Products", value: stats.totalProducts, icon: <Inventory /> },
    { title: "Revenue", value: `₹${stats.totalSales}`, icon: <AccountBalanceWallet /> },
    { title: "Transactions", value: stats.totalTransactions, icon: <ReceiptLong /> }
  ];

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: "var(--font-body)" }}>

      {/* HEADER */}
      <Box sx={{
        py: 2,
        mb: 4,
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.8)",
        borderBottom: "1px solid rgba(0,0,0,0.05)"
      }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">

            <Typography sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.6rem"
            }}>
              SMART <span style={{ color: ACCENT }}>VENDING</span>
            </Typography>

            <Stack direction="row" spacing={2}>
              <IconButton sx={{ color: ACCENT }} onClick={fetchStats}>
                <Refresh />
              </IconButton>

              <Button 
                startIcon={<Logout />}
                onClick={() => {
                  localStorage.clear();
                  navigate("/admin/login");
                }}
              >
                Logout
              </Button>
            </Stack>

          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl">

        {/* TITLE */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 800
          }}>
            Dashboard Overview
          </Typography>
          <Typography sx={{ color: TEXT_LIGHT }}>
            Real-time vending analytics
          </Typography>
        </Box>

        {/* 🔥 ALERT BOX */}
        {alerts.length > 0 && (
          <Paper sx={{ ...cardStyle, p: 2, mb: 3, border: "2px solid red" }}>
            <Typography sx={{ fontWeight: 700, color: "red" }}>
              🚨 Refill Alerts
            </Typography>

            {alerts.map((alert, index) => (
              <Typography key={index} sx={{ fontSize: "0.9rem" }}>
                {alert.message}
              </Typography>
            ))}
          </Paper>
        )}

        {/* STATS */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {statCards.map((card, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={3} alignItems="center">

                      <Avatar sx={{
                        bgcolor: ACCENT_SOFT,
                        color: TEXT_DARK,
                        width: 60,
                        height: 60,
                        borderRadius: "16px"
                      }}>
                        {card.icon}
                      </Avatar>

                      <Box>
                        <Typography sx={{ fontSize: "0.8rem", color: TEXT_LIGHT }}>
                          {card.title}
                        </Typography>
                        <Typography sx={{
                          fontSize: "1.8rem",
                          fontWeight: 800,
                          fontFamily: "var(--font-display)"
                        }}>
                          {card.value}
                        </Typography>
                      </Box>

                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* MACHINE TABLE */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={cardStyle}>
              <Box sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 700 }}>
                  Machine Status
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Stock</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {machines.map(m => (
                      <TableRow key={m.id}>
                        <TableCell>{m.id}</TableCell>
                        <TableCell>{m.location}</TableCell>

                        <TableCell>
                          <Chip label={m.status} />
                        </TableCell>

                        <TableCell>{m.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </TableContainer>

            </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}

export default AdminDashboard;