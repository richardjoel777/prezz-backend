import Queue from "bull";
import nodemailer from "nodemailer";

const mailQueue = new Queue("mail", {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS
    }
})

mailQueue.process(async (job, done) => {
    try {
        const { email, subject, text } = job.data;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAILING_EMAIL,
                pass: process.env.MAILING_PASS,
            },
        });

        await transporter.verify();

        const mailOptions = {
            from: process.env.MAILING_EMAIL,
            to: email,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);
        done();
    } catch (error) {
        done(error);
    }
});

export default mailQueue;