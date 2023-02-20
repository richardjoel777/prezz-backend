import mongoose from "../../db/mongoose.js";

export default async (req, res) => {
    try {
        const { chat_id, chat_type } = req.body;
        const last_message = await mongoose.message.findOne({
            chat_id: chat_type === "PRIVATE" ? [chat_id, req.userId].sort().join(":") : chat_id,
        }, {
            content: true,
            sender: true,
            created_at: true,
        }, {
            sort: {
                created_at: -1,
            },
            limit: 1,
        });
        return res.code(200).send(last_message);
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: "Server Error" });
    }
}