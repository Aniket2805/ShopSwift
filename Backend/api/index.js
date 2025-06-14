import express from "express";
import { PORT, URI } from "../config.js";
import mongoose from "mongoose";
import cors from "cors";
import cron from "node-cron";
import axios from "axios";
import productRoutes from "../routes/products.js";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.json("Hello World!");
});


app.use("/api/products", productRoutes);

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

cron.schedule("0 3 */20 * *", async () => {
  console.log("🌀 Running scheduled product sync...");
  try {
    await axios.post("https://productsapi2024.vercel.app/api/products/sync");
    console.log("✅ Product sync complete");
  } catch (err) {
    console.error("❌ Failed to sync products:", err.message);
  }
});
