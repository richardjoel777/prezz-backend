import Joi from "joi";
import uploadProfilePic from "../../helpers/uploadProfilePic.js";
import mongoose from "../../init/mongoose.js";
import { validatePermission } from "./index.js";

export default async (req, res) => {
    const { id } = req.params;

    try {

        const data = JSON.parse(req.body.data);

        if (!validatePermission(req, res, id, "edit_channel_info")) {
            return;
        }

        if (req.file) {
            console.log("FILE", req.file);
            data.image_url = await uploadProfilePic(req.file);
        }


        const channel = await mongoose.channel.findByIdAndUpdate(id, data);

        return res.code(200).send({ message: "Channel updated successfully", channel });
    } catch (error) {
        console.log(error);
        return res.code(404).send({ message: "Channel not found" });
    }
}