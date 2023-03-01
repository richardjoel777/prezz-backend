import mongoose from "../../init/mongoose.js";
import { populateMessage } from "../../listeners/index.js";

export default async (req, res) => {
    try {
        const { organization_id, query = "", offset = 0 } = req.body;
        const regex = new RegExp(["^", ".", "*", query, ".", "*", "$"].join(""), "i");
        const sent_messages = await populateMessage(mongoose.message.find({
            organization_id,
            content: {
                $regex: regex,
            },
        }).populate({
            path: "sender",
            select: {
                first_name: true,
                last_name: true,
                image_url: true,
            },
            match: {
                user_id: {
                    $ne: req.userId,
                }
            }
        })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(20)
        );

        console.log("SENT MESSAGES", sent_messages.length);

        return res.code(200).send(sent_messages);
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: "Server Error" });
    }
}