const express = require("express");
const router = express.Router();
const pool = require("../db");

// 🔹 GET TRANSACTIONS
router.get("/transactions", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        p.name AS product_name,
        t.amount,
        t.payment_method,
        t.status,
        t.created_at
      FROM transactions t
      JOIN products p ON p.id = t.product_id
      ORDER BY t.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});


// 💳 PAYMENT SIMULATION
router.post("/pay", async (req, res) => {
  const { productId, amount, paymentMethod } = req.body;

  try {
    // 1️⃣ Check product
    const productResult = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.json({ status: "FAILED", message: "Product not found" });
    }

    const product = productResult.rows[0];

    if (product.stock <= 0) {
      return res.json({ status: "FAILED", message: "Out of stock" });
    }

    // 2️⃣ Simulate payment success (always success for demo)
    const paymentSuccess = true;

    if (!paymentSuccess) {
      return res.json({ status: "FAILED", message: "Payment Failed" });
    }

    // 3️⃣ Reduce stock AFTER success
    await pool.query(
      "UPDATE products SET stock = stock - 1 WHERE id = $1",
      [productId]
    );

    // 4️⃣ Save transaction
    const transaction = await pool.query(
      `INSERT INTO transactions 
       (product_id, amount, payment_method, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [productId, amount, paymentMethod, "SUCCESS"]
    );

    res.json({
      status: "SUCCESS",
      message: "Payment Successful",
      transactionId: transaction.rows[0].id,
    });

  } catch (error) {
    console.error("PAYMENT ERROR:", error);
    res.json({ status: "FAILED", message: "Payment Failed" });
  }
});
// 📊 ADMIN DASHBOARD DATA
router.get("/dashboard", async (req, res) => {
  try {
    // 1️⃣ Total Revenue
    const revenueResult = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS total_revenue FROM transactions WHERE status = 'SUCCESS'"
    );

    // 2️⃣ Total Transactions
    const transactionResult = await pool.query(
      "SELECT COUNT(*) AS total_transactions FROM transactions"
    );

    // 3️⃣ Total Products
    const productResult = await pool.query(
      "SELECT COUNT(*) AS total_products FROM products"
    );

    // 4️⃣ Low Stock Products (stock < 5)
    const lowStockResult = await pool.query(
      "SELECT * FROM products WHERE stock < 5"
    );

    res.json({
      totalRevenue: revenueResult.rows[0].total_revenue,
      totalTransactions: transactionResult.rows[0].total_transactions,
      totalProducts: productResult.rows[0].total_products,
      lowStockProducts: lowStockResult.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Dashboard data error" });
  }
});


module.exports = router;
