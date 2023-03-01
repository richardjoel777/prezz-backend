import Mongoose from "mongoose";
import mongoose from "../../init/mongoose.js";
import { validatePermission } from "./index.js";

export default async (req, res) => {
    const { channel_id } = req.body;
    try {

        const channel = await mongoose.channel.findOne({
            _id: new Mongoose.Types.ObjectId(channel_id),
        }).populate("members.user");

        if (!channel) {
            return res.code(404).send({ error: "Channel not found" });
        }

        if (!validatePermission(req, res, new Mongoose.Types.ObjectId(channel_id), "archive_channel")) {
            return;
        }

        channel.is_archived = !channel.is_archived;

        await channel.save();

        res.code(200).send({ channel });
    }
    catch (error) {
        console.log(error);
        res.code(500).send({ error: "Internal Server Error" });
    }
}