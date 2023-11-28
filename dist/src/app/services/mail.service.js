"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    secure: process.env.SMTP_TLS === "yes" ? true : false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendEmail = async (option) => {
    const emailOptions = {
        from: "Sales-Team <sales@mail.com>",
        to: option.email,
        subject: option.subject,
        html: option.message,
    };
    await transporter.sendMail(emailOptions);
};
exports.default = sendEmail;
//# sourceMappingURL=mail.service.js.map