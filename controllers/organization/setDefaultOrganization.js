import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { organization_id } = req.body;

    try {

        await prisma.user.update({
            where: {
                id: req.userId,
            },
            data: {
                default_organization_id: organization_id,
            },
        });

        return res.code(200).send({ message: "Default organization set" });
    }
    catch (error) {
        console.log(error);
        res.code(500).send({ message: "Internal server error" });
    }
}