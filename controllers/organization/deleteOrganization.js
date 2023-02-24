import prisma from '../../init/prisma.js';

export default async (req, res) => {
    const { id } = req.params;

    try {

        const organizationExists = await prisma.organization.findUnique({
            where: { id: id },
        });

        if (!organizationExists) {
            res.code(404).send({ message: 'Organization not found' });
            return;
        }

        if (organizationExists.owner_id !== req.userId) {
            res.code(403).send({ message: 'You are not authorized to delete this organization' });
            return;
        }

        const deleteMembers = prisma.userOrganizations.deleteMany({
            where: { organization_id: id },
        });

        const deleteOrganizationInvites = prisma.organizationInvite.deleteMany({
            where: { organization_id: id },
        });

        const deleteOrganization = prisma.organization.delete({
            where: { id: id },
        });

        await prisma.$transaction([deleteMembers, deleteOrganizationInvites, deleteOrganization])
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: 'Internal server error' });
        return;
    }

    res.code(200).send({ message: 'Organization deleted successfully' });
}