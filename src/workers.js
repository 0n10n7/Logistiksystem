import mongoose,{ Mongoose} from "mongoose";

const workerSchema = new mongoose.Schema({
    jobTitle: String,
    orderList: [mongoose.SchemaTypes.ObjectId],
    schedule: [{
        shiftStart: Date,
        shiftEnd: Date,
        repeat: Boolean
    }],
    name: String
});

export const WorkerDB  = mongoose.model("Worker", workerSchema);