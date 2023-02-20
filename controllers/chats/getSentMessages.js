import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    try {
        const { chat_id, chat_type } = req.body;
        console.log(chat_id, chat_type, req.userId);
        const sent_messages = await mongoose.message.find({
            chat_id,
            'sender.id': req.userId,
        }, {
            content: true,
            sender: true,
            created_at: true,
        }, {
            sort: {
                created_at: -1,
            },
        });
        return res.code(200).send(sent_messages);
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: "Server Error" });
    }
}