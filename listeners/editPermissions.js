import mongoose from "../init/mongoose.js"
import Mongoose from "mongoose"
import Joi from "joi";

const permissionsSchema = Joi.object({
    role: Joi.string().required(),
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
    }),
    _id: Joi.string(),
})

export default async (socket, io, data) => {
    const { permissions, channel_id } = data;

    try {
        Joi.attempt(permissions, Joi.array().items(permissionsSchema));

        if (!validatePermission(socket, new Mongoose.Types.ObjectId(channel_id), "edit_channel_info")) {
            return;
        }

        await mongoose.channel.updateOne({
            channel_id,
        }, {
            $set: {
                permissions
            }
        })

        console.log("edit-permissions", permissions)

        return io.to(channel_id).emit("edit-permissions", permissions)
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        return;
    }
}