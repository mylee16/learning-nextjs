import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcrypt from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}: any) => {
    try {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const token = await bcrypt.hash(userId.toString(), 10);
        const hashedToken = token.split('').filter(char => characters.includes(char)).join('');

        if (emailType == "VERIFY") {
            await User.findByIdAndUpdate(
                userId, 
                {verifyToken: hashedToken, 
                verifyTokenExpiry: Date.now() + 3600000})
        }
        else if (emailType == "RESET") {
            await User.findByIdAndUpdate(
                userId, 
                {forgotPasswordToken: hashedToken, 
                forgotPasswordTokenExpiry: Date.now() + 3600000});
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAILER_USER,
                pass: process.env.EMAILER_PASS
            }
            });

        const mailOptions = {
            from: 'mengyonglee.ai@gmail.com',
            to: email,
            subject: emailType == "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/${emailType.toLowerCase()}?token=${hashedToken}">here</a> to ${emailType == "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the following link in your browser <br> ${process.env.DOMAIN}/${emailType.toLowerCase()}?token=${hashedToken}
            </p>`
        }

        const mailResponse = await transport.sendMail(mailOptions);

        return mailResponse;
    }


    catch (error: any) {
        throw new Error(error.message);}
}
