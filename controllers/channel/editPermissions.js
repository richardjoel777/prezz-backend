import mongoose from "../../init/mongoose.js";
import Joi from "joi";
import { validatePermission } from "./index.js";

const permissionsSchema = Joi.object({
    role: Joi.string().required().not("SUPERUSER"),
    permissions: Joi.object({
        edit_channel_info: Joi.boolean(),
        add_participants: Joi.boolean(),
        remove_participants: Joi.boolean(),
        clear_all_messages: Joi.boolean(),
        archive_channel: Joi.boolean(),
        delete_channel: Joi.boolean(),
        send_messages: Joi.boolean(),
        reply_in_thread: Joi.boolean(),
        mention_users: Joi.boolean(),
        leave_channel: Joi.boolean(),
        host_broadcast: Joi.boolean(),
        delete_others_messages: Joi.boolean(),
        delete_message: Joi.boolean(),
        edit_message: Joi.boolean(),
        start_stop_meeting: Joi.boolean(),
        pin_messages: Joi.boolean(),
        all_available_mentions: Joi.boolean(),
    })
})

// const validateRole = (userRole, editPermissions) => {
//     if (userRole === "SUPERUSER") {
//         return true;
//     }
//     if (userRole === "ADMIN" && editPermissions.includes("ADMIN")) {
//         return false;
//     }
//     if (userRole === "MODERATOR" && (editPermissions.includes("ADMIN") || editPermissions.includes("MODERATOR"))) {
//         return false;
//     }
//     if (userRole === "MEMBER") {
//         return false;
//     }

//     return true;

// }

export default async (req, res) => {
    const { permissions, channel_id } = req.body;

    try {
        Joi.attempt(permissions, Joi.array().items(permissionsSchema));
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        return res.code(400).send({ message: error.message });
    }

    if (!validatePermission(req, res, channel_id, "edit_channel_info")) {
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