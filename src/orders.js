import * as mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orders: [{
        productType: mongoose.SchemaTypes.ObjectId,
        worker: mongoose.SchemaTypes.ObjectId,
        status: String,
        orderDate: Date
    }],
    orderDate: Date,
    price: Number,
    completionDate: Date
});


export const OrderDB  = mongoose.model("Order", orderSchema);