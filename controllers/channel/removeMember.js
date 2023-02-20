import mongoose from "../../init/mongoose.js";
import prisma from "../../init/prisma.js";
import { io } from "../../server.js";
import { validatePermission } from "./index.js";

export default async (req, res) => {
    const { channel_id, user_id } = req.body
    const channelExists = await mongoose.channel.exists({
        _id: channel_id,
    })
    if (!channelExists) {
        return res.code(404).send({ message: "Channel not found" });
    }

    const channel = await mongoose.channel.findOne({
        _id: channel_id,
        members: {
            $elemMatch: {
                user: {
                    user_id
                }
            }
        }
    })

    // console.log(JSON.stringify(channel, null, 2));

    if (!validatePermission(req, res, channel_id, "remove_participants")) {
        return;
    }

    const removeMember = mongoose.channel.updateOne({
        _id: channel_id,
    }, {
        $pull: {
            members: {
                $elemMatch: {
                    user: {
                        user_id
                    }
                }
            }
        }
    })

    const sender = await mongoose.user.findOne({
        user_id: req.userId,
    })

    const message = mongoose.message.create({
        content: `${req.userId} have added ${user_id}`,
        chat_id: channel_id,
        is_private: false,
        is_notification: true,
        sender
    })

    const updateUserChannels = mongoose.user.updateOne({ user_id: user_id }, {
        $pull: {
            chat_rooms: {
                $elemMatch: {
                    chat_id: channel_id
                }
            }
        }
    })

    await Promise.all([removeMember, updateUserChannels, message])

    io.to(channel_id).emit("member-removed", message)

    return res.code(200).send({ message: "User removed successfully" });
}
