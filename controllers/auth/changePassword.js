import prisma from "../../init/prisma.js";
import bcrypt from "bcrypt";

export default async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        })

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.code(401).send({ message: "Incorrect password" });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: encryptedPassword,
            },
        })
    
        return res.code(200).send({ message: "Password updated successfully" });
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        return res.code(500).send({ message: error.message });
    }

}