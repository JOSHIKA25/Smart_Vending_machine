import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody,
  TableCell, TableContainer, Grid, TableHead, TableRow,
  Paper, Stack, IconButton, Avatar
} from "@mui/material";
import {
  Delete, AddCircleOutline, ShoppingBag, Inventory2
} from "@mui/icons-material";
import axios from "axios";


const handleAdd = async () => {
  if (!newProduct.name || !newProduct.price || !newProduct.stock) {
    alert("Please fill in Name, Price, and Stock");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/products", newProduct);
    console.log("Added:", res.data);
    setNewProduct({ name: "", price: "", imageUrl: "", stock: "" });
    fetchProducts(); // ✅ Refresh list
  } catch (err) {
    console.error("Failed to add product:", err.response?.data || err.message);
    alert("Failed to add product: " + (err.response?.data?.error || err.message));
  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts(); // ✅ Refresh list
  } catch (err) {
    console.error("Failed to delete:", err.response?.data || err.message);
    alert("Failed to delete product");
  }
};
// 🌿 COLORS (SAME AS DASHBOARD)
const ACCENT = "#c8f04e";
const ACCENT_DARK = "#b2e63a";
const ACCENT_SOFT = "#f7ffe0";
const TEXT_LIGHT = "#555";

// 🌿 FONT INJECTION (SAME AS DASHBOARD)
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

// 🌿 INPUT STYLE (UPDATED)
const inputStyle = {
  "& .MuiInputBase-root": {
    borderRadius: "14px",
    backgroundColor: "#f9fafb",
    fontFamily: "var(--font-body)",
    "& fieldset": { borderColor: "#eee" },
    "&:hover fieldset": { borderColor: ACCENT },
    "&.Mui-focused fieldset": { borderColor: ACCENT }
  },
  "& .MuiInputLabel-root": {
    fontFamily: "var(--font-body)"
  }
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
    stock: ""
  });

  useEffect(() => {
    injectFonts(); // ✅ APPLY SAME FONT
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price) return;

    await axios.post("http://localhost:5000/api/products", newProduct);
    setNewProduct({ name: "", price: "", imageUrl: "", stock: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>

      {/* 🌿 HEADER */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Avatar sx={{
          bgcolor: ACCENT_SOFT,
          color: "black",
          width: 60,
          height: 60,
          borderRadius: "16px"
        }}>
          <Inventory2 />
        </Avatar>

        <Box>
          <Typography sx={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 800
          }}>
            Inventory <span style={{ color: ACCENT }}>Management</span>
          </Typography>

          <Typography sx={{ color: TEXT_LIGHT }}>
            Manage vending products in real-time
          </Typography>
        </Box>
      </Stack>

      {/* 🌿 ADD PRODUCT */}
      <Paper sx={{ ...cardStyle, p: 3, mb: 4 }}>
        <Typography sx={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          mb: 2
        }}>
          Add New Product
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Product Name"
              fullWidth
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Stock"
              type="number"
              fullWidth
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Image URL"
              fullWidth
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={handleAdd}
              sx={{
                height: "56px",
                bgcolor: ACCENT,
                color: "black",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                borderRadius: "14px",
                "&:hover": { bgcolor: ACCENT_DARK }
              }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 🌿 TABLE */}
      <Paper sx={{ ...cardStyle, overflow: "hidden" }}>
        <TableContainer>
          <Table>

            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} sx={{
                  "&:hover": { bgcolor: ACCENT_SOFT }
                }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#eee" }}>
                        <ShoppingBag />
                      </Avatar>
                      <Typography fontWeight={600}>
                        {p.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹ {p.price}
                  </TableCell>

                  <TableCell>
                    <Typography
                      fontWeight={600}
                      color={p.stock < 10 ? "error" : "text.primary"}
                    >
                      {p.stock} units
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleDelete(p.id)}
                      sx={{
                        color: "#ff5252",
                        "&:hover": { bgcolor: "#fff0f0" }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No products available
                  </TableCell>
                </TableRow>
              )}

            </TableBody>

          </Table>
        </TableContainer>
      </Paper>

    </Box>
  );
}

export default AdminProducts;