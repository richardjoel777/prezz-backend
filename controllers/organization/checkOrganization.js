import prisma from '../../init/prisma.js';

export default async (req, res) => {
    const { email } = req.body;
    try {
        const organizations = (await prisma.user.findFirst({
            where: {
                email,
            },
            select: {
                organizations: true
            }
        })).organizations;
        if (organizations.length > 0) {
            return res.code(200).send({ message: "Organization Exists", exists: true, organizations });
        }
        return res.code(200).send({ message: "Organization Does Not Exist", exists: false });
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: "Server Error" });
    }
}