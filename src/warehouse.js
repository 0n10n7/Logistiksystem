import mongoose,{ Mongoose} from "mongoose";

const warehouseSchema = new mongoose.Schema({
    locationName: String,
    productsInStock: [mongoose.SchemaType.ObjectId],
    workers: [mongoose.SchemaType.ObjectId],
});