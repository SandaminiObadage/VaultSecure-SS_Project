import express from 'express';

import{login,
       logout,
       signup,
       verifyEmail, 
       forgotPassword,
       resetPassword,
       checkAuth,
    } from '../controllers/auth_controller.js';
    import { verifyToken } from '../middleware/verifyToken.js';
// import { verify } from 'crypto';
import {validateSignup,validateLogin,validateForgotPassword,validateResetPassword} from '../validators/auth.validator.js';

const router=express.Router();


router.get("/check-auth",verifyToken,checkAuth)

router.post("/signup",validateSignup, signup);   //route setup for authentication
router.post("/login",validateLogin,login);
router.post("/logout",logout);

router.post("/verify-email",verifyEmail);
router.post("/forgot-password",validateForgotPassword,forgotPassword);
router.post("/reset-password/:token",validateResetPassword,resetPassword);

export default router;