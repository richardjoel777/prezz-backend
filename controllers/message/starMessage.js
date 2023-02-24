import mongoose from "../../init/mongoose.js";
import Mongoose from "mongoose";

export default async (req, res) => {
    try {
        const { id, type } = req.body;

        const user = await mongoose.user.findOne({ user_id: req.userId });

        const message = await mongoose.message.findOne({
            _id: Mongoose.Types.ObjectId(id),
            starred_by: {
                $elemMatch: {
                    user: user._id,
                }
            }
        })

        if (message) {
            console.log("star message");
            await mongoose.message.updateOne({
                _id: Mongoose.Types.ObjectId(id),
            }, {
                $pull: {
                    starred_by: {
                        user: user._id,
                    }
                }
            })
        }
        else {
            console.log("unstar message");
            await mongoose.message.updateOne({
                _id: Mongoose.Types.ObjectId(id),
            }, {
                $push: {
                    starred_by: {
                        user,
                        message_type: type,
                    }
                }
            })
        }

        const updatedMessage
            = await mongoose.message
                .findById(id)
                .populate({
                    path: "sender",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        mini_avatar_url: 1,
                    }
                })
                .populate({
                    path: "receiver",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        mini_avatar_url: 1,
                    }
                })
                .populate({
                    path: "read_by",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        mini_avatar_url: 1,
                    }
                })
                .populate({
                    path: "reactions.user",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
                    }
                })
                .populate({
                    path: "starred_by.user",
                    select: {
                        user_id: 1,
                    }
                });

        res.code(200).send({
            message: updatedMessage,
        });

    } catch (error) {
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}