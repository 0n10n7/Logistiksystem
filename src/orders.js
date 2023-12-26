import mongoose,{ Mongoose} from "mongoose";

const orderSchema = new mongoose.Schema({
    orders: [{
        productType: { // Change
            name: String,
            weight: Number,
            price: Number,
            shelfX: Number,
            shelfY: Number,
            warehouseIndex: [Number],
            inStock: Number
        },
        worker: String, // Change
        status: String,
        orderDate: Date
    }],
    orderDate: Date,
    price: Number,
    completionDate: Date
});