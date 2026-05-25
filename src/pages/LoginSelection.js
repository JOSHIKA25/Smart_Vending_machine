import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Paper, IconButton } from "@mui/material";
import { 
  Person, 
  AdminPanelSettings, 
  ArrowForward, 
  BlurOn 
} from "@mui/icons-material";
import { motion } from "framer-motion";

/**
 * UI THEME CONSTANTS (Mirrored from AdminMachines.js)
 */
const THEME = {
  bg: "#F2F1ED",         // The off-white paper background from your image
  ink: "#0A0A0A",        // Deep black for text
  inkSoft: "#666666",    // Grey for subtext
  accentCyan: "#c8f04e", // Header Cyan
  accentLime: "#C8F04E", // Live Tracking Lime
  fontDisplay: "'Syne', sans-serif",
  fontBody: "'DM Sans', sans-serif",
};

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: THEME.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        fontFamily: THEME.fontBody,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* ─── TOP BRANDING BADGE ─── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <Box sx={{ 
          display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 0.8, 
          borderRadius: "100px", bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.05)", mb: 5 
        }}>
          <Box sx={{ 
            width: 8, height: 8, borderRadius: "50%", bgcolor: THEME.accentCyan,
            boxShadow: `0 0 10px ${THEME.accentCyan}` 
          }} />
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, color: THEME.inkSoft, letterSpacing: 2 }}>
            FLEETOPS CONSOLE V4.2
          </Typography>
        </Box>
      </motion.div>

      {/* ─── MAIN HEADER ─── */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography sx={{ 
          fontFamily: THEME.fontDisplay, fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          fontWeight: 800, color: THEME.ink, letterSpacing: -3, lineHeight: 0.9, mb: 2
        }}>
          SMART <span style={{ color: THEME.accentCyan }}>VENDING</span>
        </Typography>
        <Typography sx={{ color: THEME.inkSoft, fontSize: '1rem', fontWeight: 500, maxWidth: 500, mx: 'auto' }}>
          Select an interface to manage live telemetry or retail services.
        </Typography>
      </Box>

      {/* ─── SELECTION CARDS (Perfectly Aligned) ─── */}
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        spacing={4} 
        sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        
        {/* CUSTOMER CARD */}
        <SelectionCard 
          title="Customer"
          description="Access the storefront, track orders, and complete smart purchases."
          icon={<Person sx={{ fontSize: 40 }} />}
          accent={THEME.accentCyan}
          onClick={() => navigate("/user/login")}
          label="Open Portal"
        />

        {/* ADMIN CARD */}
        <SelectionCard 
          title="Fleet Manager"
          description="Monitor live tracking, inventory levels, and system telemetry."
          icon={<AdminPanelSettings sx={{ fontSize: 40 }} />}
          accent={THEME.ink}
          onClick={() => navigate("/admin/login")}
          label="System Access"
        />

      </Stack>

      {/* ─── FOOTER ─── */}
      <Box sx={{ position: 'absolute', bottom: 40, display: 'flex', alignItems: 'center', gap: 1, opacity: 0.4 }}>
        <BlurOn sx={{ fontSize: 18 }} />
        <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: 2 }}>
          © 2026 FLEETOPS INFRASTRUCTURE
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * INTERNAL COMPONENT: SELECTION CARD
 * Ensures both boxes are exactly the same size.
 */
function SelectionCard({ title, description, icon, accent, onClick, label }) {
  return (
    <motion.div 
      whileHover={{ y: -12 }} 
      whileTap={{ scale: 0.98 }}
      style={{ cursor: 'pointer' }}
    >
      <Paper
        onClick={onClick}
        elevation={0}
        sx={{
          width: { xs: "100%", sm: 340 }, // Fixed width for alignment
          height: 420,                   // Fixed height for alignment
          p: 5,
          borderRadius: "40px",
          bgcolor: "#ffffff",
          border: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          "&:hover": {
            borderColor: accent,
            boxShadow: `0 30px 60px -12px rgba(0,0,0,0.1)`,
            "& .icon-wrapper": { bgcolor: accent, color: "#fff", transform: "scale(1.1)" },
            "& .action-btn": { bgcolor: accent, color: "#fff" }
          }
        }}
      >
        {/* Icon Container */}
        <Box className="icon-wrapper" sx={{ 
          width: 100, height: 100, borderRadius: "30px", bgcolor: "#F8FAFC", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          mb: 4, color: accent, transition: "all 0.3s ease" 
        }}>
          {icon}
        </Box>

        {/* Text Content */}
        <Typography sx={{ 
          fontFamily: THEME.fontDisplay, fontSize: "1.7rem", fontWeight: 800, mb: 1.5, color: THEME.ink 
        }}>
          {title}
        </Typography>

        <Typography sx={{ 
          fontSize: "0.95rem", color: THEME.inkSoft, lineHeight: 1.6, mb: 4, flexGrow: 1, px: 2 
        }}>
          {description}
        </Typography>

        {/* Action Button Label */}
        <Box className="action-btn" sx={{ 
          display: 'flex', alignItems: 'center', gap: 1, px: 4, py: 1.5, 
          borderRadius: "100px", bgcolor: "#F1F5F9", color: THEME.inkSoft, 
          fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", 
          letterSpacing: 1, transition: "all 0.3s ease"
        }}>
          {label} <ArrowForward sx={{ fontSize: 16 }} />
        </Box>
      </Paper>
    </motion.div>
  );
}