import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { user_id, organization_id } = req.body;
    try {

        const receiver = await mongoose.user.findOne({
            user_id
        });

        const sender = await mongoose.user.findOne({
            user_id: req.userId
        });

        await mongoose.user.updateOne({
            user_id: req.userId
        }, {
            $pull: {
                contacts: {
                    user: receiver,
                    organization_id
                }
            }
        })

        await mongoose.user.updateOne({
            user_id
        }, {
            $pull: {
                contacts: {
                    user: sender,
                    organization_id
                }
            }
        })

        return res.code(200).send({
            message: "Contact deleted successfully"
        });
    }
    catch (err) {
        res.code(500).send({
            message: "Server Error"
        });
    }
}