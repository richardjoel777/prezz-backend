import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { channel_id, query = "" } = req.body;
    const regex = new RegExp(["^", ".", "*", query, ".", "*", "$"].join(""), "i");

    try {
        const messages = await mongoose.message.find({
            is_private: false,
            chat_id: channel_id,
            files: {
                $elemMatch: {
                    name: regex,
                    $exists: true
                },
            },
        })

        return res.code(200).send({ messages });
    } catch (error) {
        console.log(error);
        return res.code(500).send({ error: "Internal Server Error" });
    }
}