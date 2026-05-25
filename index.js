const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/products");
app.use("/api", productRoutes);

app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id");
  res.json(result.rows);
});


app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
