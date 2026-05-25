import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";
import { getTheme } from "./theme";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import LoginSelection from "./pages/LoginSelection";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTransactions from "./pages/admin/Transactions";
import AdminProducts from "./pages/admin/Products";
import AdminSalesChart from "./pages/admin/SalesChart";
import AdminMachines from "./pages/admin/AdminMachines";
import AdminSettings from "./pages/admin/AdminSettings";

import MachineDetail from "./pages/admin/MachineDetail";
import AdminMachineProducts from "./pages/admin/AdminMachineProducts";
import "leaflet/dist/leaflet.css";

import ProductList from "./pages/user/productlist";
import Payment from "./pages/user/Payment";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Signup from "./pages/Signup";


/* 🔥 Animated Routes */
function AnimatedRoutes({ darkMode, setDarkMode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ================= HOME ================= */}
        <Route path="/" element={<Home />} />

        {/* ================= LOGIN ================= */}
        <Route path="/user/home" element={<ProductList />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/machines" element={<AdminMachines />} />
        <Route path="/admin/machine/:id" element={<MachineDetail />} />
        <Route path="/admin/machine/:id/products" element={<AdminMachineProducts />} />
        <Route 
  path="/admin/settings" 
  element={
    <Sidebar>
      <AdminSettings />
    </Sidebar>
  } 
/>
        {/* ================= ADMIN ROUTES ================= */}

        {/* Redirect /admin to dashboard */}
        

        {/* Dashboard */}
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

        {/* Products */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="admin">
              <Sidebar toggleTheme={() => setDarkMode(!darkMode)}>
                <AdminProducts />
              </Sidebar>
            </ProtectedRoute>
          }
        />

        {/* Transactions */}
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

        {/* Sales Chart */}
        <Route
          path="/admin/sales"
          element={
            <ProtectedRoute role="admin">
              <Sidebar toggleTheme={() => setDarkMode(!darkMode)}>
                <AdminSalesChart />
              </Sidebar>
            </ProtectedRoute>
          }
        />

        {/* ================= USER ROUTES ================= */}

        <Route
  path="/user/products"
  element={<ProductList />}
/>

        <Route
          path="/user/payment"
          element={
            <ProtectedRoute role="user">
              <Payment />
            </ProtectedRoute>
          }
        />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={getTheme(darkMode ? "dark" : "light")}>
      <CssBaseline />
      <Router>
        <AnimatedRoutes
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;