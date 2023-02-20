import mongoose from "../../init/mongoose.js";
import { Mongoose } from "mongoose";

export default async (req, res) => {
    try {

        const user = await mongoose.user.findOne({
            user_id: req.userId,
        });

        const channels = await mongoose.channel.find({
            organization_id: req.body.organization_id,
            members: {
                $elemMatch: {
                    user,
                }
            }
        }, {
            _id: true,
            name: true,
            type: true,
        })
        // console.log(channels);
        return res.code(200).send({ channels });
        // return res.code(200).send({ channels: channels.filter(channel => channel.organization_id === req.body.organization_id) });
    }
    catch (err) {
        console.log(err);
        res.code(500).send({
            message: "Server Error"
        });
    }
}