import mongoose, { Mongoose } from "mongoose";

const warehouseSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  price: Number,
  shelfX: Number,
  shelfY: Number,
  warehouseIndex: [Number],
  inStock: Number,
});
