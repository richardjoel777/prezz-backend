import mongoose from "../../init/mongoose.js";
import prisma from "../../init/prisma.js";
import uploadProfilePic from "../../helpers/uploadProfilePic.js";

export default async (req, res) => {
    const id = req.userId;
    try {

        const data = req.body.data ? JSON.parse(req.body.data) : {};

        console.log("[DATA]", data);

        if (data.remove_profile_image) {
            data.mini_avatar_url = `${process.env.ASSESTS_ENDPOINT}/dp_placeholder.png`;
            data.avatar_url = `${process.env.ASSESTS_ENDPOINT}/dp_placeholder.png`;

            delete data.remove_profile_image
        }

        if (req.file) {
            const url = await uploadProfilePic(req.file);
            data.mini_avatar_url = url;
            data.avatar_url = url;
        }

        await mongoose.user.findOneAndUpdate(
            { user_id: id },
            data,
        );

        const profile = await mongoose.user.findOne(
            {
                user_id: id
            }, {
            chat_rooms: false,
            contacts: false,
            pinned_chats: false,
            star_messages: false,
            __v: false,
        }
        );

        return res.code(200).send({ message: "Profile updated", profile });
    } catch (error) {
        console.log(error);
        return res.code(500).send({ message: "Internal server error" });
    }
};