import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { organization_id } = req.body;
    try {
        const contacts = (await mongoose.user.findOne({
            user_id: req.userId,
        }, {
            contacts: true
        }).populate({
            path: "contacts.user",
            select: {
                user_id: true,
                first_name: true,
                last_name: true,
                image_url: true,
            }
        })).contacts;

        const receiver = await mongoose.user.findOne({
            user_id: req.userId
        });

        const pendingInvites = await mongoose.contactInvite.find({
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

        const sentInvites = await mongoose.contactInvite.find({
            sender: receiver,
            organization_id: req.body.organization_id
        }).populate({
            path: "receiver",
            select: {
                user_id: 1,
                first_name: 1,
                last_name: 1,
                image_url: 1
            }
        });

        return res.code(200).send({
            contacts: contacts.filter(contact => contact.organization_id === organization_id).map(contact => contact.user),
            invites: pendingInvites,
            pendingInvites: sentInvites
        });
    }
    catch (err) {
        console.log(err);
        res.code(500).send({
            error: err
        });
    }
}