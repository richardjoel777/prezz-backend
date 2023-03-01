import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    try {
        const receiver = await mongoose.user.findOne({
            user_id: req.userId
        });

        const invites = await mongoose.contactInvite.find({
            receiver,
            organization_id: req.body.organization_id
        }).populate({
            path: "sender",
            select: {
                user_id: 1,
                first_name: 1,
                last_name: 1,
                image_url: 1
            }
        });

        return res.code(200).send({
            invites
        });

    }
    catch (err) {
        console.log(err);
        res.code(500).send({
            message: "Server Error"
        });
    }
}