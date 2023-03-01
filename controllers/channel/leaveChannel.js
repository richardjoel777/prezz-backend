import mongoose from "../../init/mongoose.js";
import Mongoose from 'mongoose';
import redis from '../../init/redis.js';
import { validatePermission } from "./index.js";

export default async (req, res) => {
    const { channel_id } = req.body;

    console.log("[LEAVE CHANNEL]", channel_id);

    try {

        if (!validatePermission(req, res, new Mongoose.Types.ObjectId(channel_id), "leave_channel")) {
            return;
        }

        const user = JSON.parse((await redis.get(`user:${req.userId}`)));

        const memberExists = await mongoose.channel.exists({
            _id: channel_id,
            members: {
                $elemMatch: {
                    user: user._id
                }
            }
        })

        // console.log("[MEMBER EXISTS]", memberExists)

        if (!memberExists) {
            return res.code(400).send({ message: "User is not a member" });
        }

        const removeMember = mongoose.channel.findByIdAndUpdate(channel_id, {
            $pull: {
                members: {
                    user: user._id
                }
            }
        })

        const updateUserChannels = mongoose.user.updateOne({ user_id: req.userId }, {
            $pull: {
                chat_rooms: {
                    $elemMatch: {
                        chat_id: channel_id
                    }
                }
            }
        })

        await Promise.all([removeMember, updateUserChannels])

        return res.code(200).send({ message: "User Left successfully" });
    }
    catch (err) {
        console.log(err)
        return res.code(500).send({ message: "Internal server error" });
    }
}