import authControllers from '../controllers/auth/index.js';
import auth from '../middlewares/auth.js';
import upload from '../config/multer.js';

const {
    register,
    changePassword,
    getEmailOTP,
    login,
    resetPassword,
    updateProfile,
    getProfile,
    checkEmailExists,
    checkValidOTP,
    loginWithOTP
} = authControllers;

export default async (fastify, opts, done) => {
    // console.log('Auth routes loaded');
    fastify.post('/register', register);
    fastify.post('/login', login);
    fastify.post('/login-otp', loginWithOTP)
    fastify.post('/check-email', checkEmailExists);
    fastify.post('/check-otp', checkValidOTP);
    fastify.post('/email-otp', getEmailOTP);
    fastify.post('/reset-password', resetPassword);
    fastify.post('/change-password', { preHandler: [auth], handler: changePassword });
    fastify.post('/update-profile', { preHandler: [auth, upload.single("file")], handler: updateProfile });
    fastify.get('/profile', { preHandler: [auth], handler: getProfile });
    done();
}