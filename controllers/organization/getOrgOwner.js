import mongoose from "../../db/mongoose.js";
import prisma from "../../db/prisma.js";

export default async (req, res) => {
    const { id } = req.params;

    const organization = await prisma.organization.findUnique({
        where: {
            id,
        },
    });

    if (!organization) {
        return res.code(404).send({ message: "Organization not found" });
    }

    const profile = await mongoose.user.findOne({
        user_id: organization.owner_id,
    }, {
        user_id: 1,
        name: 1,
        email: 1,
    })


    return res.code(200).send({
        owner: profile
    });
}