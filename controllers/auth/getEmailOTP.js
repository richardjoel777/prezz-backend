import prisma from "../../init/prisma.js";
import mailQueue from "../../helpers/mailQueue.js";

export default async (req, res) => {
    // console.log(req.body)
    const { email } = req.body;
    if (!email) {
        return res.code(400).send({ message: "Email is required" });
    }

    try {

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.emailOTP.deleteMany({
            where: {
                email,
            },
        });

        await prisma.emailOTP.create({
            data: {
                email,
                otp,
            },
        });

        const subjectLine = "OTP: Prezz";
        const emailBody =
            `Dear User, \n\n` +
            "Your OTP for verification is : \n\n" +
            `${otp}\n\n` +
            "This is a auto-generated email. Please do not reply to this email.\n\n" +
            "Regards\n" +
            "Team Prezz\n\n";

        mailQueue.add({ email, subject: subjectLine, text: emailBody });

        console.log("[OTP]", otp);

        return res.code(200).send({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        return res.code(500).send({ message: error.message });
    }

}