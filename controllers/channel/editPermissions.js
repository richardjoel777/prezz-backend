import mongoose from "../../init/mongoose.js";
import Joi from "joi";
import { validatePermission } from "./index.js";
import Mongoose from 'mongoose'

export default async (req, res) => {
    const { permissions, channel_id } = req.body;

    if (!validatePermission(req, res, new Mongoose.Types.ObjectId(channel_id), "edit_channel_info")) {
        return;
    }

    try {
        await mongoose.channel.updateOne({
            channel_id,
        }, {
            $set: {
                permissions
            }
        })

        return res.code(200).send({ message: "Permissions updated successfully" })
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        return res.code(500).send({ message: error.message });
    }
}