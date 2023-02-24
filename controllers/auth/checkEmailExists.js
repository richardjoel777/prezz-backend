import prisma from "../../init/prisma.js";

export default async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });
        if (user) {
            res.code(200).send({ exists: true, is_google_login: user.password === null });
        } else {
            res.code(401).send({ exists: false });
        }
    } catch (err) {
        console.log(err);
        res.code(500).send({ message: "Internal server error" });
    }
}