import mongoose from "../../db/mongoose.js";

export default async (req, res) => {
    try {
        const { chat_id, chat_type } = req.body;
        await mongoose.user.updateOne({
            user_id: req.userId,
        }, {
            $push: {
                pinned_chats: {
                    chat_id,
                    chat_type,
                }
            }
        })
        return res.code(200).send({ message: "Chat pinned successfully" });
    } catch (error) {
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}