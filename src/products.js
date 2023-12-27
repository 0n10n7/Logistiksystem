import mongoose, { Mongoose } from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  price: Number,
  shelfX: Number,
  shelfY: Number,
  warehouseIndex: [Number],
  inStock: Number,
});

export const ProductDB = mongoose.model("Product", productSchema);


