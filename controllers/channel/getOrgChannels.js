import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { organization_id, query = "" } = req.body;
    const regex = new RegExp(["^", ".", "*", query, ".", "*", "$"].join(""), "i");
    try {

        const user = await mongoose.user.findOne({
            user_id: req.userId,
        });

        const userChannels = await mongoose.channel.find({
            organization_id,
            members: {
                $elemMatch: {
                    user,
                }
            }
        }, {
            _id: 1,
        });

        const channels = await mongoose.channel.find({
            organization_id,
            type: "PUBLIC",
            visibility: true,
            name: {
                $regex: regex,
            },
            _id: {
                $nin: userChannels,
            },
        }, {
            name: 1,
            description: 1,
            organization_id: 1,
            created_at: 1,
            chat_id: 1,
            type: 1,
            owner: 1,
            image_url: 1,
            members: 1,
        })
            .populate({
                path: "owner",
                select: {
                    user_id: 1,
                    first_name: 1,
                    last_name: 1,
                }
            })

        const channelsWithLastMessage = await Promise.all(channels.map(async channel => {
            const lastMessage = await mongoose.message.findOne({
                chat_id: channel._id.toString(),
            }, {
                created_at: 1,
            }).sort({
                created_at: -1,
            });
            return {
                ...channel._doc,
                last_active: lastMessage ? lastMessage.created_at : channel.created_at,
            }
        }));

        res.code(200).send({
            channels: channelsWithLastMessage,
        });
    } catch (err) {
        console.log(err);
        res.code(500).send({
            message: "Internal Server Error",
        });
    }
};