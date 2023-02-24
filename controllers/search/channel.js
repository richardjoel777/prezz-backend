import mongoose from '../../init/mongoose.js';

export default async (req, res) => {
    const { organization_id, query = "" } = req.body;
    const regex = new RegExp(["^", ".", "*", query, ".", "*", "$"].join(""), "i");

    try {
        const channels = await mongoose.channel.find({
            organization_id,
            $or: [
                {
                    $and: [
                        {
                            type: 'PUBLIC'
                        },
                        {
                            visibility: true
                        }
                    ]
                },
                {
                    $and: [
                        {
                            type: "PRIVATE"
                        },
                        {
                            members: {
                                $elemMatch: {
                                    user_id: req.userId
                                }
                            }
                        }
                    ]
                }
            ],
            name: {
                $regex: regex
            }
        });

        return res.code(200).send({ channels });
    } catch (error) {
        console.log(error);
        return res.code(500).send({ error: "Internal Server Error" });
    }
}