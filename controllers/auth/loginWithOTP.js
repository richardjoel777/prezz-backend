import { loginUser } from "./index.js";
import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { email, otp } = req.body

    if (!otp || !email) {
        return res.code(400).send({ message: "OTP and email are required" });
    }

    const otpObj = await prisma.emailOTP.findFirst({
        where: {
            email,
            otp,
            expires_at: {
                gt: new Date(),
            },
        },
    })


    if (!otpObj) {
        return res.code(401).send({ message: "Invalid OTP" });
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        return res.code(400).send({ message: "User Does Not Exist" })
    }

    await prisma.emailOTP.delete({
        where: {
            id: otpObj.id
        }
    })

    await loginUser(req, res, user.id)
}