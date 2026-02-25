import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getTheme } from "./theme";
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";

// ADMIN
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTransactions from "./pages/admin/Transactions";

// USER
import ProductList from "./pages/user/Products";
import Payment from "./pages/user/Payment";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={getTheme(darkMode ? "dark" : "light")}>
      <CssBaseline />
      <Router>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <Sidebar toggleTheme={() => setDarkMode(!darkMode)}>
                  <AdminDashboard />
                </Sidebar>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute role="admin">
                <Sidebar toggleTheme={() => setDarkMode(!darkMode)}>
                  <AdminTransactions />
                </Sidebar>
              </ProtectedRoute>
            }
          />

          {/* USER ROUTES */}
          <Route
            path="/user/products"
            element={
              <ProtectedRoute role="user">
                <Sidebar toggleTheme={() => setDarkMode(!darkMode)}>
                  <ProductList />
                </Sidebar>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/payment"
            element={
              <ProtectedRoute role="user">
                <Sidebar toggleTheme={() => setDarkMode(!darkMode)}>
                  <Payment />
                </Sidebar>
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;