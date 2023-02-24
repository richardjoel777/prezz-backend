import mongoose from "../../init/mongoose.js";
import { conn } from "../../init/mongodb.js";
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

    // console.log(JSON.stringify(channel, null, 2));

    if (!validatePermission(req, res, channel_id, "remove_participants")) {
        return;
    }

    const sender = await mongoose.user.findOne({
        user_id: req.userId,
    })

    const session = await conn.startSession();

    try {

        session.startTransaction();

        mongoose.channel.updateOne({
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
        }, { session })

        mongoose.message.create({
            content: `${req.userId} have added ${user_id}`,
            chat_id: channel_id,
            is_private: false,
            is_notification: true,
            sender
        }, { session })

        mongoose.user.updateOne({ user_id: user_id }, {
            $pull: {
                chat_rooms: {
                    $elemMatch: {
                        chat_id: channel_id
                    }
                }
            }
        }, { session })

        await session.commitTransaction();

        io.to(channel_id).emit("member-removed", message)

        res.code(200).send({ message: "User removed successfully" });
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        await session.abortTransaction();
        res.code(500).send({ message: error.message });
    }
    finally {
        session.endSession();
    }
}
