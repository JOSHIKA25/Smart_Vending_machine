import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "./ProductList";
import Transactions from "./Transactions"; // ✅ ADD THIS
import AdminDashboard from "./AdminDashboard";

function App() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Vending Machine Products</h1>

      {/* Products */}
      <ProductList products={products} refresh={fetchProducts} />

      <hr />

      {/* Transactions */}
      <Transactions />   {/* ✅ ADD THIS */}
      <AdminDashboard />
    </div>
  );
}

export default App;
