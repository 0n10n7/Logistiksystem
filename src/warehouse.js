import mongoose,{ Mongoose} from "mongoose";

const warehouseSchema = new mongoose.Schema({
    locationName: String,
    productsInStock: [],
    workers: [],
});