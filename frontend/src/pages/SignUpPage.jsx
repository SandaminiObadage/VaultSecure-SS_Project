import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../components/Input';
import { Mail, User, Lock } from "lucide-react";
import { Link } from 'react-router-dom';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import shieldImage from '../images/shield.png';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";
import { Loader } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { signup, error } = useAuthStore();
    const navigate = useNavigate();
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    function onChange(value) {
        console.log("Captcha value:", value);
        setRecaptchaToken(value);
    }

    const validateForm = () => {
        const errors = {};

        const usernameRegex = /^[A-Za-z\s]+$/;

        if (recaptchaToken === null) {
            errors.recaptcha = "Please complete the recaptcha";
        }

        if (!name) {
            errors.name = "Username is required";
        } else if (!usernameRegex.test(name)) {
            errors.name = "Username can only contain letters and spaces";
        }

        if (!email) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.email = "Invalid email address";

        if (!password) errors.password = "Password is required";

        if (!ConfirmPassword)
            errors.ConfirmPassword = "Confirm password is required";

        if (password !== ConfirmPassword)
            errors.passwordMatch = "Passwords do not match";

        // if (passwordStrength > 8)
        //   errors.passwordStrength = "Password must be Strong before signing up";

        if (!recaptchaToken) errors.recaptcha = "Please complete the recaptcha";

        return errors;
    };


    const handleSignUp = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Set loading state to true during sign up process
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            console.log("Validation Errors:", errors);

            return;
        }

        try {
            if (error) {
              console.error("Signup error 123:", error); // Log error details
              return; // Stop further execution if there's an error
            } else if (!error) {
              await signup(email, password, name, recaptchaToken);
              navigate("/verify-email");
            }
          } catch (err) {
            console.log(err);
          }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                {/* Application Name and Description */}
                <div className='text-center mb-6'>
                    <h1 className='text-4xl font-bold text-white mb-2'>VaultSecure</h1>
                    <p className='text-sm text-gray-400'>
                        Protecting financial data with precision for a secure tomorrow.
                    </p>
                    {/* Add your image here */}
                    <img
                        src={shieldImage}  // Replace with your image path
                        alt="VaultSecure Logo"
                        className="mt-4 w-32 mx-auto" // Adjust size and positioning as needed
                    />
                </div>

                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                    Create Account
                </h2>

                <form onSubmit={handleSignUp}>
                    <Input
                        icon={User}
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {formErrors.name && (
                        <p className="text-red-500 font-bold text-sm">
                            {formErrors.name}
                        </p>
                    )}

                    <Input
                        icon={Mail}
                        type="text"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {formErrors.email && (
                        <p className="text-red-500  font-bold text-sm">
                            {formErrors.email}
                        </p>
                    )}
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {formErrors.password && (
                        <p className="text-red-500 font-bold text-sm">
                            {formErrors.password}
                        </p>
                    )}

                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Confirm Password"
                        value={ConfirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {formErrors.ConfirmPassword && (
                        <p className="text-red-500 font-bold text-sm">
                            {formErrors.ConfirmPassword}
                        </p>
                    )}
                    {formErrors.passwordMatch && (
                        <p className="text-red-500 font-bold text-sm">
                            {formErrors.passwordMatch}
                        </p>
                    )}

                    
                    {/* Password Strength Meter */}
                    <PasswordStrengthMeter password={password} />
                    {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

                    <div className="my-4 flex justify-center">
                        <div className="bg-gray-900 rounded-lg shadow-lg p-4">
                            <ReCAPTCHA
                                sitekey="6Lf6SHIqAAAAAGhnHvrNZzp7AZJywSSlyytHOX1f"
                                onChange={onChange}
                                className="w-full"
                            />
                            {formErrors.recaptcha && (
                                <p className="text-red-500 font-bold text-sm">
                                    {formErrors.recaptcha}
                                </p>
                            )}
                        </div>
                    </div>

                    <motion.button
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-green-600
                        hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        focus:ring-offset-gray-900 transition duration-200'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        disabled={isLoading}>
                        {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Sign Up"}
                    </motion.button>
                </form>
            </div>

            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400'>
                    Already have an account?{" "}
                    <Link to={"/login"} className='text-green-400 hover:underline'>
                        Login
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

export default SignUpPage;
