import Mongoose from "mongoose";
import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    try {
        const messages = await mongoose.message.find({});
        // console.log(messages.length)
        await Promise.all(messages.forEach(async (message) => {
            if (!message.is_private) {
                message.channel = Mongoose.Types.ObjectId(message.chat_id);
                return message.save();
            }
        }))

        return res.code(200).send({ message: "Success" });
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: "Server Error" });
    }
}