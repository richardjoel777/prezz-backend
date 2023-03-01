import prisma from "../../init/prisma.js";
import mongoose from "../../init/mongoose.js";
import bcrypt from "bcrypt";
import { loginUser } from "./index.js";
import redis from '../../init/redis.js'


export default async (req, res) => {
    const { email, password, phone, otp } = req.body;

    try {

        const otpObj = await prisma.emailOTP.findFirst({
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


        let encryptedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

        const user = await prisma.user.create({
            data: {
                email,
                password: encryptedPassword,
                phone,
                is_email_verified: true,
            },
        })

        await prisma.emailOTP.delete({
            where: {
                id: otpObj.id,
            },
        })

        const profile = await mongoose.user.create({
            user_id: user.id,
            first_name: user.email.split("@")[0],
            email: user.email,
            phone_personal: user.phone,
        })

        await redis.set(`user:${user.id}`, JSON.stringify(profile))

        await loginUser(req, res, user.id)
    }
    catch (err) {
        console.log(err)
        if (err.code === "P2002") {
            res.code(400).send({ message: "User already exists" });
        }
        else {
            res.code(500).send({ message: "Internal server error" });
        }
    }
}