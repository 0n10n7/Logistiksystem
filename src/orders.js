import mongoose,{ Mongoose} from "mongoose";

const orderSchema = new mongoose.Schema({
    orders: [{
        productType: {
            name: String,
            weight: Number,
            price: Number,
            shelfX: Number,
            shelfY: Number,
            warehouseIndex: [Number],
            inStock: Number
        },
        worker: mongoose.SchemaType.ObjectId,
        status: String,
        orderDate: Date
    }],
    orderDate: Date,
    price: Number,
    completionDate: Date
});