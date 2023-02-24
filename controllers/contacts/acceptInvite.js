import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { id } = req.body;
    try {
        const invite = await mongoose.contactInvite.findById({
            _id: id
        }).populate("sender").populate("receiver");

        console.log("[INVITE]", invite)

        if (!invite) {
            return res.code(404).send({
                error: "Invite not found"
            });
        }

        await mongoose.user.updateOne({
            _id: invite.receiver._id
        }, {
            $push: {
                contacts: {
                    user: invite.sender,
                    organization_id: invite.organization_id
                }
            }
        });

        await mongoose.user.updateOne({
            _id: invite.sender._id
        }, {
            $push: {
                contacts: {
                    user: invite.receiver,
                    organization_id: invite.organization_id
                }
            }
        });

        await invite.delete();

        return res.code(200).send({
            message: "Invite accepted successfully"
        });

    }
    catch (err) {
        console.log(err);
        res.code(500).send({
            message: "Server Error"
        });
    }
}