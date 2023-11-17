import { EmailOption } from "../types/email-option";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number.parseInt(process.env.EMAIL_PORT),
  secure: process.env.SMTP_TLS === "yes" ? true : false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (option: EmailOption) => {
  const emailOptions = {
    from: "Sales-Team <sales@mail.com>",
    to: option.email,
    subject: option.subject,
    html: option.message,
  };
  await transporter.sendMail(emailOptions);
};

export default sendEmail;
