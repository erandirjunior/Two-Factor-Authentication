const IEmail = require('./../../domain/iemail');
const nodemailer = require("nodemailer");
const bodyEmailHtml = require('./body-email-html');

module.exports = class Email extends IEmail {
    constructor() {
        super();
    }

    async send(user) {
        try {
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
        } catch (e) {
            console.log(e)
        }
    }
}