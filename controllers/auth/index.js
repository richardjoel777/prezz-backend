import register from "./register.js";
import login from "./login.js";
import getEmailOTP from "./getEmailOTP.js";
import resetPassword from "./resetPassword.js";
import changePassword from "./changePassword.js";
import updateProfile from "./updateProfile.js";
import getProfile from "./getProfile.js";
import checkEmailExists from "./checkEmailExists.js";
import checkValidOTP from "./checkValidOTP.js";
import loginWithOTP from "./loginWithOTP.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res, id) => {
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

export default {
    register,
    login,
    getEmailOTP,
    resetPassword,
    changePassword,
    updateProfile,
    getProfile,
    checkEmailExists,
    checkValidOTP,
    loginWithOTP
}