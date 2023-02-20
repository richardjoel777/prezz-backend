import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { receiver_id, organization_id } = req.body;
    try {
        const sender = await mongoose.user.findOne({
            user_id: req.userId
        });
        if (!sender) {
            return res.code(404).send({
                error: "User not found"
            });
        }

        const receiver = await mongoose.user.findOne({
            user_id: receiver_id
        });

        if (!receiver) {
            return res.code(404).send({
                error: "User not found"
            })
        }

        const contactInvite = await mongoose.contactInvite.findOne({
            sender,
            receiver,
            organization_id
        });

        if (contactInvite) {
            return res.code(400).send({
                error: "Contact invite already sent"
            });
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
        res.code(500).send({
            message: "Server Error"
        });
    }
}