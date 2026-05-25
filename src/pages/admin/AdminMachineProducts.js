import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Grid, Card, CardContent, 
  LinearProgress, Chip, IconButton, Stack, Button,
  Divider, Tooltip,Avatar
} from "@mui/material";
import { 
  ArrowBack, 
  Inventory, 
  AddCircleOutline, 
  MoreVert, 
  WarningAmber 
} from "@mui/icons-material";
import { motion } from "framer-motion";

// --- Glassmorphism Card Style ---
const productCardStyle = {
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(12px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  color: "white",
  transition: "0.3s",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    borderColor: "rgba(255, 179, 0, 0.4)",
    transform: "translateY(-5px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  }
};

function AdminMachineProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/machines/${id}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "transparent" }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ color: "white" }}>
              Machine <span style={{ color: "#ffb300" }}>#{id}</span>
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
              Inventory Management & Stock Levels
            </Typography>
          </Box>
        </Stack>
        
        <Button 
          variant="contained" 
          startIcon={<AddCircleOutline />}
          sx={{ 
            bgcolor: "#ffb300", color: "#0d1117", fontWeight: "bold", borderRadius: "10px",
            "&:hover": { bgcolor: "#ffca28" }
          }}
        >
          Add Product
        </Button>
      </Stack>

      {/* Inventory Grid */}
      <Grid container spacing={3}>
        {products.map((product, index) => {
          const isLowStock = product.stock < 5;
          const stockPercentage = (product.stock / 20) * 100; // Assuming 20 is max capacity

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={productCardStyle}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Avatar 
                        sx={{ 
                          bgcolor: isLowStock ? "rgba(255, 82, 82, 0.1)" : "rgba(255, 179, 0, 0.1)",
                          color: isLowStock ? "#ff5252" : "#ffb300",
                          borderRadius: "12px", width: 48, height: 48
                        }}
                      >
                        <Inventory />
                      </Avatar>
                      <IconButton size="small" sx={{ color: "rgba(255,255,255,0.3)" }}>
                        <MoreVert />
                      </IconButton>
                    </Stack>

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 0.5 }}>
                      {product.name}
                    </Typography>
                    
                    <Typography variant="h5" fontWeight="900" sx={{ color: "#ffb300", mb: 2 }}>
                      ₹{product.price}
                    </Typography>

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 2 }} />

                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                        STOCK LEVEL
                      </Typography>
                      <Typography variant="caption" fontWeight="bold" sx={{ color: isLowStock ? "#ff5252" : "#4caf50" }}>
                        {product.stock} Units
                      </Typography>
                    </Stack>

                    <LinearProgress 
                      variant="determinate" 
                      value={stockPercentage > 100 ? 100 : stockPercentage} 
                      sx={{ 
                        height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: isLowStock ? "#ff5252" : "#4caf50"
                        }
                      }}
                    />

                    {isLowStock && (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                        <WarningAmber sx={{ color: "#ff5252", fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: "#ff5252", fontWeight: "bold" }}>
                          CRITICAL LOW STOCK
                        </Typography>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default AdminMachineProducts;