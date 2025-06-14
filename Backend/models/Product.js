// server/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_id: String,
  product_title: String,
  price: String,
  image: String,
  category: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
