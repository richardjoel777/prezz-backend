import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { id } = req.params;
    try {
        const organization = await prisma.organization.findUnique({
            where: {
                id: id,
            },
        });

        if (!organization) {
            return res.code(404).send({ message: "Organization not found" });
        }

        if (organization.owner_id !== req.userId) {
            return res.code(403).send({ message: "Forbidden" });
        }

        const updatedOrganization = await prisma.organization.update({
            where: {
                id: id,
            },
            data: req.body,
        });

        return res
            .code(200)
            .send({ message: "Organization updated", organization: updatedOrganization });
    } catch (error) {
        console.log(error);
        return res.code(500).send({ message: "Internal server error" });
    }
}