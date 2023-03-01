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
        console.log("[JOB CALLED]", job.data);
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
        console.log("Email sent to", email);
        done();
    } catch (error) {
        console.log(error);
        done(error);
    }
});

export default mailQueue;