import mongoose,{ Mongoose} from "mongoose";

const workerSchema = new mongoose.Schema({
    jobTitle: String,
    orderList: [mongoose.SchemaType.ObjectId],
    schedule: [{
        shiftStart: Date,
        shiftEnd: Date,
        repeat: Boolean
    }],
    name: String
});