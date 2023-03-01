import mongoose from "../../init/mongoose.js";
import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { id } = req.params;

    try {

        const user = await mongoose.user.findOne({
            user_id: req.userId,
        });

        const channel = await mongoose.channel.findOne({
            _id: id,
            members: {
                $elemMatch: {
                    user: user._id,
                }
            }
        }).populate({
            path: "owner",
            select: {
                first_name: true,
                last_name: true,
                user_id: true,
            }
        }).populate({
            path: "members.user",
            select: {
                first_name: true,
                last_name: true,
                user_id: true,
                email: true,
                image_url: true,
            },
        });

        if (!channel) {
            return res.code(404).send({ message: "Channel not found" });
        }

        return res.code(200).send({ channel });
    }
    catch (err) {
        console.log(err);
        res.code(500).send({
            message: "Server Error"
        });
    }

}