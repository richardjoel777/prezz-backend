import auth from '../middlewares/auth.js';
import upload from '../config/multer.js';
import { validatePasswordChange, validateLogin, validateRegister, validateOTP, validatePasswordReset } from '../middlewares/validators.js';

import {
    register,
    changePassword,
    getEmailOTP,
    login,
    resetPassword,
    updateProfile,
    getProfile,
    checkEmailExists,
    checkValidOTP,
    loginWithOTP,
    googleSignIn
} from '../controllers/auth/index.js';

export default async (fastify, opts, done) => {
    fastify.post('/register', { preHandler: [validateRegister], handler: register });
    fastify.post('/login', { preHandler: [validateLogin], handler: login });
    fastify.post('/login-otp', { preHandler: [validateOTP], handler: loginWithOTP })
    fastify.post('/check-email', checkEmailExists);
    fastify.post('/check-otp', { preHandler: [validateOTP], handler: checkValidOTP });
    fastify.post('/email-otp', getEmailOTP);
    fastify.post('/reset-password', { preHandler: [validatePasswordReset], handler: resetPassword });
    fastify.post('/change-password', { preHandler: [auth, validatePasswordChange], handler: changePassword });
    fastify.post('/update-profile', { preHandler: [auth, upload.single("file")], handler: updateProfile });
    fastify.get('/profile', { preHandler: [auth], handler: getProfile });
    fastify.post('/google-signin', googleSignIn);
    done();
}