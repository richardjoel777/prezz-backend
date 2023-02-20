import prisma from "../../init/prisma.js";
import mongoose from "../../init/mongoose.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import { loginUser } from "./index.js";

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6),
    phone: Joi.string().min(10).required().pattern(/^[0-9]+$/),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/),
    is_google_login: Joi.boolean(),
    country: Joi.string(),
    state: Joi.string(),
    first_name: Joi.string(),
    last_name: Joi.string()
})

export default async (req, res) => {
    const { email, password, phone, otp, is_google_login = false, country, state, first_name, last_name } = req.body;
    const { error } = userSchema.validate(req.body);
    if (error) {
        console.log(error.message)
        return res.code(400).send({ message: error.details[0].message });
    }

    // console.log(req.body)

    let otpObj

    if (!is_google_login) {

        otpObj = await prisma.emailOTP.findFirst({
            where: {
                email,
                otp,
                expires_at: {
                    gt: new Date(),
                },
            },
        })

        // console.log(otpObj)

        if (!otpObj || otpObj.otp !== otp) {
            return res.code(401).send({ message: "Invalid OTP" });
        }
    }

    const userExists = await prisma.user.findFirst({
        where: {
            email
        },
    })

    if (userExists) {
        return res.code(400).send({
            message: "User already exists",
        });
    }

    let encryptedPassword = null;
    if (password) {
        encryptedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    }

    const user = await prisma.user.create({
        data: {
            email,
            password: encryptedPassword,
            phone,
            is_email_verified: true,
        },
    })

    if (!is_google_login) {
        await prisma.emailOTP.delete({
            where: {
                id: otpObj.id,
            },
        })

        await mongoose.user.create({
            user_id: user.id,
            first_name: user.email.split("@")[0],
            email: user.email,
        })
    } else {
        await mongoose.user.create({
            user_id: user.id,
            first_name,
            last_name,
            country,
            state,
            email: user.email,
        })
    }

    await loginUser(req, res, user.id)
}