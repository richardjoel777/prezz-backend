import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { receiver_id, organization_id } = req.body;
    try {
        const sender = await mongoose.user.findOne({
            user_id: req.userId
        });
        if (!sender) {
            throw new Error({ status: 404, message: "User not found" });
        }

        const receiver = await mongoose.user.findOne({
            user_id: receiver_id
        });

        if (!receiver) {
            throw new Error({ status: 404, message: "User not found" });
        }

        const contactInvite = await mongoose.contactInvite.findOne({
            sender,
            receiver,
            organization_id
        });

        if (contactInvite) {
            throw new Error({ status: 400, message: "Contact Invite already exists" });
        }

        const newContactInvite = new mongoose.contactInvite({
            sender,
            receiver,
            organization_id
        });

        await newContactInvite.save();

        return res.code(200).send({
            message: "Contact Invite successfully",
            invite: newContactInvite
        });
    }
    catch (err) {

        if (err.status) {
            return res.code(err.status).send({
                message: err.message
            });
        }

        res.code(500).send({
            message: "Internal Server Error"
        });
    }
}