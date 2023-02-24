import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { otp, email } = req.body;

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

        if (!otpObj) {
            return res.code(200).send({ message: "Invalid OTP", isValid: false });
        }

        return res.code(200).send({ message: "OTP verified successfully", isValid: true });
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        return res.code(500).send({ message: error.message });
    }
}
