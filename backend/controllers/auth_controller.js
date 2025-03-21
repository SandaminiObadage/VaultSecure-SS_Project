import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import { sendPasswordResetEmail } from "../mailtrap/emails.js";
import dotenv from "dotenv";
import { sendResetSuccessEmail } from "../mailtrap/emails.js";
import axios from "axios";
import { validationResult } from "express-validator";

dotenv.config();


export const signup = async (req, res) => {
    const { email, password, name, recaptchaToken } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map(error => error.msg)
        });
    }
    try {
        if (!email || !password || !name) {
            throw new Error("All feilds are required");
        }

        const responsed = await axios.post(verificationUrl);
        const { success } = responsed.data;

        if (!success) {
            return res.status(400).json({ error: "ReCAPTCHA validation failed." });
        }


        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists)
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        //123456 => $_121#%$%()_+123456
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,  //24 hours
            provider: "local",
        })

        await user.save();  //save to the db

        //jwt
        const token = generateTokenAndSetCookie(res, user);

        sendVerificationEmail(user.email, user.verificationToken);

        res.status(201).json({
            success: true,
            message: "user created successfully",
            user: {
                ...user._doc,
                password: undefined,
                token,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });

    }

};

export const verifyEmail = async (req, res) => {
    // _ _ _ _ _ _
    const { code } = req.body;
    try {
      const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() }, // $gt = greater than today so thats valied
      });
  
      if (!user) {
        return res
          .status(400)
          .json({
            sucess: false,
            message: "Invalid or expired verification code Haven't a user ",
          });
      }
  
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
  
      const token = generateTokenAndSetCookie(res, user);
  
      await sendWelcomeEmail(user.email, user.name);
      res.status(200).json({
        sucess: true,
        message: "Email verified successfully",
        user: {
          ...user._doc,
          password: undefined,
          token,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ sucess: false, message: error.message });
    }
  };
export const login = async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map(error => error.msg)
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid Credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
        const token = generateTokenAndSetCookie(res, user);
        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
                token,
            },
        });
    } catch (error) {
        console.log("error in login", error);
        res.status(400).json({ success: false, message: error.message });
    }

};
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map(error => error.msg)
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        //Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        //send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "password reset link sent to your email" });
    } catch (error) {
        console.log("error in forgotPassword", error);
        res.status(500).json({ success: false, message: error.message });
    }

};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array().map(error => error.msg)
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        //update password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "password reset successfully" });
    } catch (error) {
        console.log("error in resetPassword", error);
        res.status(500).json({ success: false, message: error.message });

    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true, user: {
            }
        });
    } catch (error) {
        console.log("error in checkAuth", error);
        res.status(400).json({ success: false, message: error.message });

    }
};


export const googleOAuth = async (req, res) => {
    const { email, name, password } = req.body;
  
    try {
      // Validate incoming data
      if (!email || !name || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
  
      // Check if the user already exists
      let user = await User.findOne({ email });
  
      if (!user) {
        // If user does not exist, create a new user
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        user = new User({
          name,
          email,
          password: hashedPassword, // Store hashed password
          provider: "google",
          isVerified: true,
        });
  
        // Save the new user
        await user.save();
      }
  
      const token = generateTokenAndSetCookie(res, user);
  
  
      // Send response back to the client
      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
          ...user._doc,
          password: undefined,
          token,
        },
      });
    } catch (error) {
      console.error("Google OAuth error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message, // Include the error message for debugging
      });
    }
  };