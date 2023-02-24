import mongoose from "mongoose";

export default async function () {
    try {
        mongoose.set('strictQuery', true)
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        })
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export const conn = mongoose.connection;