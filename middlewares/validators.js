import Joi from "joi";

export const validatePasswordChange = (req, res, next) => {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    if (password === newPassword) {
        return res.status(400).send({ message: "New password cannot be the same as the old password" });
    }

    next();
}

export const validateOTP = (req, res, next) => {
    const { otp, email } = req.body;

    if (!otp || !email) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    next();
}

export const validatePasswordReset = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        otp: Joi.string().length(6).pattern(/^[0-9]+$/),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    next();
}

export const validateLogin = (req, res, next) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    next();
}

export const validateRegister = (req, res, next) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6),
        phone: Joi.string().min(10).required().pattern(/^[0-9]+$/),
        otp: Joi.string().length(6).pattern(/^[0-9]+$/),
    })

    const { error } = userSchema.validate(req.body);
    if (error) {
        console.log(error.message)
        return res.code(400).send({ message: error.details[0].message });
    }

    next();

}

export const validateEditPermissions = (req, res, next) => {

    const permissionsSchema = Joi.object({
        role: Joi.string().required().not("SUPERUSER"),
        permissions: Joi.object({
            edit_channel_info: Joi.boolean(),
            add_participants: Joi.boolean(),
            remove_participants: Joi.boolean(),
            clear_all_messages: Joi.boolean(),
            archive_channel: Joi.boolean(),
            delete_channel: Joi.boolean(),
            send_messages: Joi.boolean(),
            reply_in_thread: Joi.boolean(),
            mention_users: Joi.boolean(),
            leave_channel: Joi.boolean(),
            host_broadcast: Joi.boolean(),
            delete_others_messages: Joi.boolean(),
            delete_message: Joi.boolean(),
            edit_message: Joi.boolean(),
            start_stop_meeting: Joi.boolean(),
            pin_messages: Joi.boolean(),
            all_available_mentions: Joi.boolean(),
        })
    })

    try {
        Joi.attempt(permissions, Joi.array().items(permissionsSchema));
    }
    catch (error) {
        console.log("[ERROR]", error.message);
        return res.code(400).send({ message: error.message });
    }
}