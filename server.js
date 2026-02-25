const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", require("./routes/productRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const products = await Product.find();

    // ✅ Total Revenue
    const revenue = transactions.reduce(
      (total, t) => total + t.amount,
      0
    );

    // ✅ Total Transactions
    const totalTransactions = transactions.length;

    // ✅ Products Sold
    const productsSold = transactions.length;

    // ✅ Low Stock Products (stock <= 5)
    const lowStock = products.filter((p) => p.stock <= 5);

    // ✅ Recent Transactions (last 5)
    const recentTransactions = transactions
      .slice(-5)
      .reverse();

    res.json({
      revenue,
      transactions: totalTransactions,
      productsSold,
      lowStock,
      recentTransactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
});