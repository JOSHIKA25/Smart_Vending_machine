import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Skeleton,
  Grid,
  Avatar
} from "@mui/material";

import {
  QueryStats,
  DonutLarge,
  BarChart,
  Timeline
} from "@mui/icons-material";

import { motion } from "framer-motion";

// ✅ REGISTER CHARTS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// 🌿 THEME (same as dashboard)
const ACCENT = "#c8f04e";
const ACCENT_SOFT = "#f7ffe0";
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

// 🌿 CARD STYLE (same as dashboard)
const cardStyle = {
  borderRadius: "24px",
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  background: "#ffffff"
};

function AdminSalesAnalytics() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    injectFonts(); // ✅ apply fonts

    axios
      .get("http://localhost:5000/api/admin/products")
      .then((res) => {
        const labels = res.data.map((p) => p.name);
        const prices = res.data.map((p) => Number(p.price));
        const stock = res.data.map((p) => Number(p.stock) || 0);

        setChartData({ labels, prices, stock });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const lineData = {
    labels: chartData?.labels,
    datasets: [{
      fill: true,
      data: chartData?.prices,
      borderColor: ACCENT,
      backgroundColor: "rgba(200,240,78,0.2)",
      tension: 0.4,
    }],
  };

  const barData = {
    labels: chartData?.labels,
    datasets: [{
      data: chartData?.stock,
      backgroundColor: "#1a237e",
      borderRadius: 8,
    }],
  };

  const pieData = {
    labels: chartData?.labels,
    datasets: [{
      data: chartData?.prices,
      backgroundColor: [
        ACCENT,
        "#1a237e",
        "#4caf50",
        "#ff7043",
        "#7e57c2",
        "#26a69a"
      ],
      borderWidth: 0,
    }],
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 6 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, fontFamily: "var(--font-body)" }}>

      {/* 🌿 HEADER */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Avatar sx={{
          width: 60,
          height: 60,
          borderRadius: "16px",
          bgcolor: ACCENT_SOFT
        }}>
          <QueryStats sx={{ color: "#000" }} />
        </Avatar>

        <Box>
          <Typography sx={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 800
          }}>
            Sales <span style={{ color: ACCENT }}>Analytics</span>
          </Typography>

          <Typography sx={{ color: TEXT_LIGHT }}>
            Visual insights of products and inventory
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>

        {/* 🌿 LINE CHART */}
        <Grid item xs={12}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Paper sx={{ ...cardStyle, p: 3 }}>
              <Typography sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                mb: 2
              }}>
                Price Trends
              </Typography>

              <Box sx={{ height: 300 }}>
                <Line data={lineData} options={sharedOptions} />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* 🌿 BAR CHART */}
        <Grid item xs={12} md={7}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Paper sx={{ ...cardStyle, p: 3 }}>
              <Typography sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                mb: 2
              }}>
                Stock Levels
              </Typography>

              <Box sx={{ height: 300 }}>
                <Bar data={barData} options={sharedOptions} />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* 🌿 PIE CHART */}
        <Grid item xs={12} md={5}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Paper sx={{ ...cardStyle, p: 3 }}>
              <Typography sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                mb: 2
              }}>
                Price Distribution
              </Typography>

              <Box sx={{ height: 300 }}>
                <Pie
                  data={pieData}
                  options={{
                    ...sharedOptions,
                    plugins: {
                      legend: {
                        display: true,
                        position: "bottom"
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

      </Grid>
    </Box>
  );
}

export default AdminSalesAnalytics;