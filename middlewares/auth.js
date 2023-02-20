import jwt from "jsonwebtoken"

export default async (req, res, next) => {
    // console.log("[COOKIES]", req.cookies)
    // if (!req.cookies.token) {
    //     return res.code(401).send({ message: "Unauthorized" });
    // }
    // const token = req.cookies.token;
    if (!req.headers.authorization) {
        return res.code(401).send({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token)
    if (!token) {
        return res.code(401).send({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("[DECODED]", decoded)
        req.userId = decoded.id;
    } catch (error) {
        console.log(error.message)
        return res.code(401).send({ message: "Unauthorized" });
    }
}