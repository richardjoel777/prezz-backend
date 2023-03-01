import mongoose from "../../init/mongoose.js";
import { addReactions, populateMessage } from "../../listeners/index.js";

export default async (req, res) => {
    try {
        const { chat_id } = req.body;

        const messages = await populateMessage(mongoose.message.find(
            {
                chat_id,
            },
        ).sort({ createdAt: -1 }).limit(10));

        const messagesData = addReactions(messages);

        return res.code(200).send({ messages: messagesData });

    } catch (error) {
        console.log(error);
        res.code(500).send({ message: "Internal Server Error" });
    }
}