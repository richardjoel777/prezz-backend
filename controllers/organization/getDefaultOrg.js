import prisma from "../../init/prisma.js";

export default async (req, res) => {
    try {
        const defaultOrg = (await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                default_organization_id: true,
            }
        })).default_organization_id;

        return res.code(200).send({ defaultOrg });
    }
    catch (error) {
        console.log(error);
        res.code(500).send({ message: "Internal server error" });
    }
}