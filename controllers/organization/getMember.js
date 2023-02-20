import mongoose from "../../init/mongoose.js";
import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { email } = req.body;

    try {
        const profile = await mongoose.user.findOne({
            email,
        });
        res.code(200).send({ profile });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
}