const pool = require("../db");

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE is_active = true ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
