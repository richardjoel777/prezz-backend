import mongoose from "../../init/mongoose.js";
import es from "../../init/es.js";
import prisma from '../../init/prisma.js'

export default async (req, res) => {

    try {

        const { query = "", organization_id } = req.body;

        const organizationUsers = await prisma.userOrganizations.findMany({
            where: {
                organization_id
            },
        })

        const userIds = organizationUsers.map((user) => user.user_id);

        console.log(userIds);

        // console.log(query, req.userId);

        const data = await es.search({
            index: "users",
            query: {
                bool: {
                    must: [
                        {
                            query_string: {
                                query: `*${query}*`,
                                fields: ["first_name", "last_name", "email"]
                            }
                        },
                        {
                            terms: {
                                user_id: userIds
                            }
                        }
                    ],
                    must_not: [
                        {
                            term: {
                                user_id: req.userId
                            }
                        }
                    ]
                }
            }
        });

        const users = data.hits.hits.map((user) => user._source);

        return res.code(200).send({ users });

    } catch (error) {
        console.log(error);
        return res.code(500).send({ error: "Internal Server Error" });
    }
}