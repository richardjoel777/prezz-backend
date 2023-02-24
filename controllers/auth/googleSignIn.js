import prisma from "../../init/prisma.js";
import mongoose from "../../init/mongoose.js";
import { loginUser } from "./index.js";
import { admin } from "../../init/firebase.js";

export default async (req, res) => {
    const { idToken } = req.body;

    try {

        const ticket = await admin.auth().verifyIdToken(idToken);

        const { email, email_verified, name } = ticket;

        if (!email_verified) {
            return res.code(401).send({ message: "Email not verified" });
        }

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (user) {
            return loginUser(req, res, user.id)
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                phone: ""
            },
        });

        await mongoose.user.create({
            user_id: newUser.id,
            first_name: name.split(" ")[0],
            last_name: name.split(" ")[1],
            email: newUser.email,
        });

        return loginUser(req, res, newUser.id);
    } catch (error) {
        console.log(error);
        return res.code(500).send({ message: "Something went wrong" });
    }
}