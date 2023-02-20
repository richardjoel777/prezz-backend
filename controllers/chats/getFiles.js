import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    try {
        const { chat_id, file_type } = req.body;
        const whereCondition = {
            chat_id,
            files: {
                $exists: true,
                $ne: [],
            },
            is_deleted: false,
        };
        if (file_type) {
            whereCondition.files = {
                ...whereCondition.files,
                $elemMatch: {
                    mimetype: {
                        $regex: file_type,
                    }
                }
            }
        }
        const files = await mongoose.message.find(whereCondition);

        return res.code(200).send(files);
    }
    catch (error) {
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}