import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { id } = req.body;
    try {
        const invite = await mongoose.contactInvite.findById(id);

        if (!invite) {
            return res.code(404).send({
                error: "Invite not found"
            });
        }

        if (invite.receiver.toString() !== req.userId) {
            return res.code(403).send({
                error: "Forbidden"
            });
        }

        await mongoose.contactInvite.deleteOne({
            _id: id
        });

        return res.code(200).send({
            message: "Invite successfully declined"
        });

    }
    catch (err) {
        console.log(err);
        res.code(500).send({
            message: "Server Error"
        });
    }
}