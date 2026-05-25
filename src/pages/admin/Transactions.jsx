import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Box, Paper, TableContainer, Chip, Stack, Avatar
} from "@mui/material";
import { ReceiptLong, Circle, Payments } from "@mui/icons-material";
import { motion } from "framer-motion";

const ACCENT      = "#c8f04e";
const ACCENT_SOFT = "#f7ffe0";
const TEXT_DARK   = "#0a0a0a";
const TEXT_LIGHT  = "#555";

const injectFonts = () => {
  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root { --font-display: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif; }
  body { font-family: var(--font-body) !important; background: #f2f1ed; }
  `;
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
};

const cardStyle = {
  borderRadius: "24px",
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  background: "#ffffff"
};

// Safely format any amount value from DB — handles null, undefined, ""
const fmt = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? "—" : `₹${n.toFixed(2)}`;
};

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    injectFonts();
    axios
      .get("http://localhost:5000/api/admin/transactions")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box sx={{ p: 4, minHeight: "100vh", fontFamily: "var(--font-body)" }}>

      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Avatar sx={{ width: 60, height: 60, borderRadius: "16px", bgcolor: ACCENT_SOFT, color: TEXT_DARK }}>
          <Payments />
        </Avatar>
        <Box>
          <Typography sx={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800 }}>
            Transactions <span style={{ color: ACCENT }}>Logs</span>
          </Typography>
          <Typography sx={{ color: TEXT_LIGHT }}>
            Monitor all vending payments in real-time
          </Typography>
        </Box>
      </Stack>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <TableContainer component={Paper} sx={cardStyle}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ fontWeight: 800, color: "#888" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#888" }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#888" }}>Base</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#888" }}>CGST</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#888" }}>SGST</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#888" }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#888" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#888" }}>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id} sx={{ "&:hover": { bgcolor: ACCENT_SOFT } }}>

                  {/* ID */}
                  <TableCell sx={{ fontWeight: 700, color: "#999" }}>#{txn.id}</TableCell>

                  {/* Total Amount — null safe */}
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        color: txn.total_amount ? TEXT_DARK : "#ccc"
                      }}
                    >
                      {fmt(txn.total_amount)}
                    </Typography>
                  </TableCell>

                  {/* Base */}
                  <TableCell sx={{ color: TEXT_LIGHT, fontSize: "0.9rem" }}>
                    {fmt(txn.base_amount)}
                  </TableCell>

                  {/* CGST */}
                  <TableCell sx={{ color: TEXT_LIGHT, fontSize: "0.9rem" }}>
                    {fmt(txn.cgst_amount)}
                  </TableCell>

                  {/* SGST */}
                  <TableCell sx={{ color: TEXT_LIGHT, fontSize: "0.9rem" }}>
                    {fmt(txn.sgst_amount)}
                  </TableCell>

                  {/* Payment Method */}
                  <TableCell>
                    <Chip
                      label={txn.payment_method || "—"}
                      sx={{ borderRadius: "8px", fontWeight: 700, bgcolor: "#f5f5f5" }}
                    />
                  </TableCell>

                  {/* Status — fixed: DB stores "SUCCESS" not "success" */}
                  <TableCell>
                    <Chip
                      icon={<Circle sx={{ fontSize: "10px !important" }} />}
                      label={txn.status || "—"}
                      sx={{
                        bgcolor: txn.status === "SUCCESS" ? "#e8f5e9" : "#ffebee",
                        color:   txn.status === "SUCCESS" ? "#2e7d32" : "#c62828",
                        fontWeight: 800,
                        borderRadius: "10px"
                      }}
                    />
                  </TableCell>

                  {/* Date */}
                  <TableCell sx={{ color: "#777", fontSize: "0.85rem" }}>
                    {txn.created_at
                      ? new Date(txn.created_at).toLocaleString("en-IN")
                      : "—"}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          {transactions.length === 0 && (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <ReceiptLong sx={{ fontSize: 50, color: "#ddd" }} />
              <Typography sx={{ mt: 2, color: "#aaa" }}>No transactions yet</Typography>
            </Box>
          )}
        </TableContainer>
      </motion.div>
    </Box>
  );
}

export default AdminTransactions;
