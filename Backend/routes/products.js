// server/routes/products.js
import express from "express";
import axios from "axios";
import Product from "../models/Product.js";

const router = express.Router();

// Keywords you want to fetch from external API
const queries = [
  "latest phone",
  "latest laptop",
  "men summer collection",
  "women summer collection",
];

router.get("/", async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const products = await Product.find(filter);
  res.json(products);
});
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "3fc742d33amsh2b3c1390930b288p1eb281jsn0c671a8dae7a",
    "x-rapidapi-host": "real-time-product-search.p.rapidapi.com",
  },
};
router.post("/sync", async (req, res) => {
  await Product.deleteMany({});
  console.log("🗑️ Cleared all previous product data.");
  try {
    for (const query of queries) {
      const response = await axios.get(
        `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(
          query
        )}&country=in&language=en&limit=20&sort_by=BEST_MATCH&product_condition=NEW`,
        options
      );
      const data = response?.data?.data;
      for (const item of data?.products || data) {
        await Product.findOneAndUpdate(
          { product_id: item.product_id },
          {
            product_id: item.product_id,
            product_title: item.product_title,
            price: item?.offer?.price,
            image: item?.product_photos[0],
            category: query, // use search term as category
            lastUpdated: new Date(),
          },
          { upsert: true }
        );
      }
    }

    res.json({ message: "All products fetched and stored by query category." });
  } catch (err) {
    console.error("Error during sync:", err.message);
    res.status(500).json({ error: "Failed to sync products." });
  }
});

export default router;
