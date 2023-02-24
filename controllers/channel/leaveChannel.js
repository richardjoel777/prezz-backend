import mongoose from "../../init/mongoose.js";
import { validatePermission } from "./index.js";

export default async (req, res) => {
    const { channel_id } = req.body;

    try {

        if (!validatePermission(req, res, channel_id, "leave_channel")) {
            return;
        }

        const memberExists = await mongoose.channel.exists({
            _id: channel_id,
            members: {
                $elemMatch: {
                    user: {
                        user_id: req.userId
                    }
                }
            }
        })

        // console.log("[MEMBER EXISTS]", memberExists)

        if (!memberExists) {
            return res.code(400).send({ message: "User is not a member" });
        }

        const userProfile = await mongoose.user.findOne({
            user_id
        });

        const removeMember = mongoose.channel.updateOne({
            _id: channel_id,
        }, {
            $pull: {
                members: {
                    user: userProfile,
                    role: "MEMBER"
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