import mongoose from "../../init/mongoose.js";
import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { channel_id } = req.body;

    try {
        const channel = await mongoose.channel.findById(channel_id)

        if (!channel) {
            return res.code(404).send({ message: "Channel not found" });
        }

        const user = await mongoose.user.findOne({
            user_id: req.userId,
        });

        // console.log("[USER]", user)

        if (!user) {
            return res.code(404).send({ message: "Organization not found" });
        }

        if (channel.type === "PRIVATE") {
            return res.code(403).send({ message: "You are not authorized to join this channel" });
        }

        const memberExists = await mongoose.channel.exists({
            _id: channel._id,
            members: {
                $elemMatch: {
                    user: user._id,
                }
            }
        })

        // console.log("[MEMBER EXISTS]", memberExists)

        if (memberExists) {
            return res.code(400).send({ message: "User already a member" });
        }

        const addMember = mongoose.channel.updateOne({
            _id: channel._id,
        }, {
            $push: {
                members: {
                    user,
                    role: "MEMBER"
                }
            }
        })

        const updateUserChannels = mongoose.user.updateOne({ user_id: req.userId }, {
            $push: {
                chat_rooms: {
                    chat_id: channel_id,
                    organization_id: channel.organization_id,
                }
            }
        })

        await Promise.all([addMember, updateUserChannels])

        return res.code(200).send({ message: "User added successfully" });
    }
    catch (err) {
        console.log(err)
        return res.code(500).send({ message: "Internal server error" });
    }
}