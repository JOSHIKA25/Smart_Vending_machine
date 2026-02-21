import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    const res = await axios.get("http://localhost:5000/api/dashboard");
    setData(res.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h3>💰 Total Revenue</h3>
          <p>₹ {data.totalRevenue}</p>
        </div>

        <div style={cardStyle}>
          <h3>🧾 Transactions</h3>
          <p>{data.totalTransactions}</p>
        </div>

        <div style={cardStyle}>
          <h3>📦 Total Products</h3>
          <p>{data.totalProducts}</p>
        </div>
      </div>

      <h3>⚠ Low Stock Products</h3>

      {data.lowStockProducts.length === 0 ? (
        <p>No low stock items 🎉</p>
      ) : (
        data.lowStockProducts.map((product) => (
          <div key={product.id} style={{ marginBottom: "10px" }}>
            {product.name} — Stock: {product.stock}
          </div>
        ))
      )}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  width: "200px",
  textAlign: "center",
  backgroundColor: "#f9f9f9"
};

export default AdminDashboard;
