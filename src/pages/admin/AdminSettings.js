import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Typography, Paper, Grid, TextField, 
  Button, Switch, Divider, Stack, Avatar, 
  IconButton, Card, CardContent, InputAdornment 
} from "@mui/material";
import { 
  CloudUpload, Notifications, 
  Palette, Save, ArrowBackIosNew,
  Visibility, VisibilityOff
} from "@mui/icons-material";

// 🌿 THEME
const ACCENT = "#c8f04e";
const ACCENT_DARK = "#b2e63a";
const ACCENT_SOFT = "#f7ffe0";
const TEXT_DARK = "#0a0a0a";
const TEXT_LIGHT = "#666";

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

function AdminSettings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    injectFonts();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: "var(--font-body)", p: 4 }}>

      {/* HEADER */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosNew />
        </IconButton>

        <Typography sx={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          fontWeight: 800
        }}>
          Settings Panel
        </Typography>
      </Stack>

      <Grid container spacing={4}>

        {/* PROFILE */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ ...cardStyle, p: 3, textAlign: "center" }}>
            <Avatar sx={{
              width: 100,
              height: 100,
              mx: "auto",
              bgcolor: ACCENT_SOFT,
              color: TEXT_DARK,
              fontSize: "2rem"
            }}>
              AD
            </Avatar>

            <Typography mt={2} fontWeight="700">
              Admin User
            </Typography>

            <Button 
              startIcon={<CloudUpload />} 
              sx={{ mt: 2 }}
            >
              Upload Photo
            </Button>
          </Paper>
        </Grid>

        {/* FORM */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ ...cardStyle, p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Full Name" defaultValue="Admin User"/>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email" defaultValue="admin@email.com"/>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* PREFERENCES */}
        <Grid item xs={12}>
          <Paper sx={{ ...cardStyle, p: 4 }}>
            <Typography sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              mb: 2
            }}>
              Preferences
            </Typography>

            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Email Notifications</Typography>
                <Switch 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography>Dark Mode</Typography>
                <Switch disabled />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* ACTION */}
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={() => navigate(-1)}>Cancel</Button>

            <Button 
              variant="contained"
              startIcon={<Save />}
              sx={{
                bgcolor: ACCENT,
                color: "black",
                fontWeight: 700,
                "&:hover": { bgcolor: ACCENT_DARK }
              }}
            >
              Save Changes
            </Button>
          </Stack>
        </Grid>

      </Grid>
    </Box>
  );
}

export default AdminSettings;