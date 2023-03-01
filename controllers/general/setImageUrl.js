import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const users = await mongoose.user.find({});

    await Promise.all(users.map(async (user) => {
        delete user.mini_avatar_url;
        delete user.avatar_url;
        user.image_url = "profile/profile_placeholder.png";
        await user.save();
    }
    ))

    const channels = await mongoose.channel.find({});

    await Promise.all(channels.map(async (channel) => {
        channel.image_url = channel.type === "PUBLIC" ? "profile/channel_organization_placeholder.jpg" : "profile/channel_personal_placeholder.png";
        await channel.save();
    }
    ))

    return res.code(200).send({ message: "Done" });
}