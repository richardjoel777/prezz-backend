import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { otp, email } = req.body;
    // console.log(req.body)
    if (!otp || !email) {
        // console.log("OTP or email missing")
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
        return res.code(200).send({ message: "Invalid OTP", isValid: false });
    }

    return res.code(200).send({ message: "OTP verified successfully", isValid: true });
}
