import IEmail from './../../domain/iemail.js';
import nodemailer from "nodemailer";
import bodyEmailHtml from './body-email-html.js';

export default class Email extends IEmail {
    constructor() {
        super();
    }

    async send(user) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Hello, see you token",
            html: bodyEmailHtml(user.emailToken)
        });
    }
}