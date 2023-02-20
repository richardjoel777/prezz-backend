import mongoose from "../../init/mongoose.js";
import { io } from "../../server.js";
import { validatePermission } from "./index.js";

export default async (req, res) => {
    const { channel_id, users } = req.body
    const channel = await mongoose.channel.exists({
        _id: channel_id,
    });

    if (!channel) {
        return res.code(404).send({ message: "Channel not found" });
    }

    if (!validatePermission(req, res, channel_id, "add_participants")) {
        return;
    }

    const usersToAdd = await mongoose.user.find({
        user_id: {
            $in: users
        }
    });

    const addMembers = mongoose.channel.updateOne({
        _id: channel_id,
        members: {
            user: {
                $nin: usersToAdd.map(user => user._id)
            }
        }
    }, {
        $push: {
            members: {
                $each: usersToAdd.map(user => ({
                    user,
                    role: "MEMBER",
                }))
            }
        }
    })

    const sender = await mongoose.user.findOne({
        user_id: req.userId,
    });

    const messages = usersToAdd.map(async (user) => {
        return await mongoose.message.create({
            content: `${req.userId} have added ${user.user_id}`,
            chat_id: channel_id,
            is_private: false,
            is_notification: true,
            sender,
        })
    })

    const updateUserChannels = users.map(async (user_id) => {
        return await mongoose.user.updateOne({
            user_id,
            chat_rooms: {
                chat_id: {
                    $ne: channel_id
                }
            }
        }, {
            $push: {
                chat_rooms: {
                    chat_id: channel_id,
                    organization_id: channel.organization_id,
                }
            }
        })
    })

    await Promise.all([addMembers, updateUserChannels, messages])

    io.to(channel_id).emit("member-added", messages);

    return res.code(200).send({ message: "User added successfully" });
}
