import prisma from "../../init/prisma.js";
import bcrypt from "bcrypt"; 

export default async (req, res) => {
    const { otp, email, password } = req.body;

    try {

        const otpObj = await prisma.emailOTP.findFirst({
            where: {
                email,
                expires_at: {
                    gt: new Date(),
                },
                otp,
            },
        })

        if (!otpObj) {
            return res.code(401).send({ message: "Invalid OTP" });
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            return res.code(400).send({ message: "User does not exist" });
        }

        const isSamePassword = await bcrypt.compare(password, user.password);

        if (isSamePassword) {
            return res.code(400).send({ message: "New password cannot be same as old password" });
        }

        const encryptedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: encryptedPassword,
            },
        })

        await prisma.emailOTP.delete({
            where: {
                id: otpObj.id,
            },
        })
    
        return res.code(200).send({ message: "Password updated successfully" });
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        return res.code(500).send({ message: error.message });
    }
}