import {mailtrapClient,sender} from "./mailtrap.config.js";
import {PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE} from "./emailTemplates.js";



export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}',verificationToken),
            category: "Email Verification"   
        })
        console.log("Email Sent Sucessfully",response);
    }
    catch(error){
        console.log(error);
        throw new Error(`Failed to send verification email:${error}`);

    }
 };

 export const sendWelcomeEmail = async (email, name) => {
     const recipient = [{ email }];

     try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid:"ee94ecda-3cfb-473b-9270-e2bdfc120e44", 
            template_variables:{
                "name": name
            },
           
        });
        console.log("Welcome Email Sent Sucessfully",response);
     }
     catch(error){
        console.log("Error sending welcome email",error);
        throw new Error(`Error sending welcome email:${error}`);
     }
 };

 export const sendPasswordResetEmail = async (email, resetURL) => {   
    const recipient = [{ email }];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category: "Password Reset"   
        })
        console.log("Email Sent Sucessfully",response);
    }
    catch(error){
        console.log(error);
        throw new Error('Failed to send password reset email:${error}');
 }
 };

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];
    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"   
        });
        console.log("Email Sent Sucessfully",response);
    }
    catch(error){
        console.log(error);
        throw new Error('Error sending password reset success email:${error}');
 }
 };