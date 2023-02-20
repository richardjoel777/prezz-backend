import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { is_private = false, chat_id, query = "", filters = {} } = req.body;
    const regex = new RegExp(["^", ".", "*", query, ".", "*", "$"].join(""), "i");

    const whereCondition = {
        chat_id: is_private ? [chat_id, req.userId].sort().join(":") : chat_id,
        content: {
            $regex: regex,
        }
    }

    const sender = await mongoose.user.findOne({ user_id: req.userId });



    try {
        const messages = await mongoose.message.find(whereCondition)

        return res.code(200).send({ messages });
    } catch (error) {
        console.log(error);
        return res.code(500).send({ error: "Internal Server Error" });
    }
}