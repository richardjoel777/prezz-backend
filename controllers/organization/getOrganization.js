import prisma from "../../db/prisma.js";

export default async (req, res) => {
    const { id } = req.params;

    const organization = await prisma.organization.findUnique({
        where: {
            id,
        },
    });

    const owner = await mongoose.user.findOne({
        user_id: organization.owner_id,
    }, {
        user_id: true,
        first_name: true,
        last_name: true,
    });

    organization.owner = owner;

    if (!organization) {
        return res.code(404).send({ message: "Organization not found" });
    }

    return res.code(200).send(organization);
}