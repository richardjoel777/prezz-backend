import mongoose from "../../init/mongoose.js";
import { conn } from "../../init/mongodb.js";
import { io } from "../../server.js";
import { validatePermission } from "./index.js";
import Mongoose from "mongoose";

export default async (req, res) => {
    const { channel_id, user_id } = req.body
    const channel = await mongoose.channel.findOne({
        _id: channel_id,
    })
    if (!channel) {
        return res.code(404).send({ message: "Channel not found" });
    }

    // console.log(JSON.stringify(channel, null, 2));

    if (!validatePermission(req, res, new Mongoose.Types.ObjectId(channel_id), "remove_participants")) {
        return;
    }

    console.log("USER ID", user_id);

    // const user = await mongoose.user.findOne({
    //     user_id,
    // })

    const session = await conn.startSession();

    try {

        session.startTransaction();

        await mongoose.channel.findByIdAndUpdate(channel_id, {
            $pull: {
                members: {
                    user: Mongoose.Types.ObjectId(user_id)
                }
            }
        }, { session })

        // mongoose.message.create({
        //     content: `${req.userId} have added ${user_id}`,
        //     chat_id: channel_id,
        //     is_private: false,
        //     is_notification: true,
        //     sender,
        //     channel,
        //     organization_id: channel.organization_id,
        // }, { session })

        await mongoose.user.updateOne({ user_id: user_id }, {
            $pull: {
                chat_rooms: {
                    chat_id: channel_id
                }
            }
        }, { session })

        await session.commitTransaction();

        // io.to(channel_id).emit("member-removed", message)

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
