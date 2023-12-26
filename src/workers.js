import mongoose,{ Mongoose} from "mongoose";

const workerSchema = new mongoose.Schema({
    jobTitle: String,
    orderList: [], //Change
    schedule: [{
        shiftStart: Date,
        shiftEnd: Date,
        repeat: Boolean
    }],
    name: String
});