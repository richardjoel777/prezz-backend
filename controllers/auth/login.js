import { loginUser } from "./index.js";
import prisma from "../../init/prisma.js";
import Joi from "joi";
import bcrypt from "bcrypt";

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export default async (req, res) => {
    const { email = "", phone = "", password } = req.body;
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.code(400).send({ message: error.details[0].message });
    }

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