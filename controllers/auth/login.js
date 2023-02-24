import { loginUser } from "./index.js";
import prisma from "../../init/prisma.js";
import bcrypt from "bcrypt";

export default async (req, res) => {
    const { email = "", password } = req.body;

    const user = await prisma.user.findFirst({
        where: {
            email
        },
    });

    if (!user) {
        return res.code(401).send({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.code(401).send({ message: "Invalid Credentials" });
    }

    await loginUser(req, res, user.id);
}