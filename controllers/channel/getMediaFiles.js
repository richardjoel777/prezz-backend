import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { channel_id, query = "", type = "", offset = 0 } = req.body;
    const regex = new RegExp(["^", ".", "*", query, ".", "*", "$"].join(""), "i");
    const typeRegex = new RegExp(["^", ".", "*", type, ".", "*", "$"].join(""), "i");

    try {

        const messages = await mongoose.message.aggregate([
            {
                $match: {
                    chat_id: channel_id,
                    files: {
                        $elemMatch: {
                            name: regex,
                            mimetype: {
                                $regex: typeRegex,
                            }
                        },
                    },
                },
            },
            {
                $project: {
                    files: true,
                    created_at: true,
                    sender: true,
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "sender"
                }
            },
            {
                $unwind: "$sender"
            },
            {
                $sort: {
                    created_at: -1
                }
            },
            {
                $facet: {
                    paginatedResults: [
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$created_at"
                                    }
                                },
                                messages: {
                                    $push: {
                                        files: "$files",
                                        sender: {
                                            user_id: "$sender.user_id",
                                            _id: "$sender._id",
                                            first_name: "$sender.first_name",
                                            last_name: "$sender.last_name",
                                            image_url: "$sender.image_url",
                                        },
                                        created_at: "$created_at",
                                        _id: "$_id",
                                    }
                                }
                            }
                        },
                        {
                            $sort: {
                                _id: -1
                            }
                        },
                        {
                            $skip: offset
                        },
                        {
                            $limit: 5
                        }
                    ],
                    totalCount: [
                        {
                            $group: {
                                _id: null,
                                count: {
                                    $sum: 1
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        return res.code(200).send({ messages: messages[0].paginatedResults });
    } catch (error) {
        console.log(error);
        return res.code(500).send({ error: "Internal Server Error" });
    }
}