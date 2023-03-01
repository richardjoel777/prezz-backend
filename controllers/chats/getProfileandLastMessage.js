import mongoose from "../../init/mongoose.js";
export default async (req, res) => {
    try {
        console.log(req.body);
        const { chat_type, chat_id } = req.body;

        const last_message = await mongoose.message
            .findOne({ chat_id })
            .sort({ created_at: -1 })
            .populate({
                path: "sender",
                select: {
                    first_name: 1,
                    last_name: 1,
                    user_id: 1,
                    image_url: 1,
                }
            })
            .select({
                content: 1,
                created_at: 1,
                sender: 1,
                chat_id: 1,
            })

        let profile

        if (chat_type === "CHANNEL") {
            profile = await mongoose.channel.findById(req.body.channel._id, {
                id: 1,
                name: 1,
                image_url: 1,
                type: 1,
            })
        } else {
            profile = await mongoose.user.findById(req.body.user._id, {
                first_name: 1,
                last_name: 1,
                user_id: 1,
                image_url: 1,
                country: 1,
                email: 1,
                timezone: 1,
                phone_personal: 1,
            })
        }

        return res.code(200).send({
            profile,
            last_message,
            chat_type
        });

    } catch (error) {
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}