import mongoose,{ Mongoose} from "mongoose";

const warehouseSchema = new mongoose.Schema({
    locationName: String,
    productsInStock: [mongoose.SchemaTypes.ObjectId],
    workers: [mongoose.SchemaTypes.ObjectId],
});

export const WarehouseDB  = mongoose.model("Warehouse", warehouseSchema);