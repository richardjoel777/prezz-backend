import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    try {
        const updated = await mongoose.message.updateMany({
        }, {
            $set: {
                organization_id: req.body.organization_id,
            }
        })

        return res.code(200).send({ updated });
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: "Server Error" });
    }
}