import jwt from "jsonwebtoken";

export default async (req, res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });
    res
        // .setCookie("token", token, {
        //     path: "/",
        // })
        // .header("Authorization", `Bearer ${token}`)
        .code(200)
        .send({ token, message: "Login Successful" });
};