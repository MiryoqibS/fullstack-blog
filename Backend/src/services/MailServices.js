// Настройка dotenv
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });

import nodemailer from "nodemailer";

class MailServices {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendMail(to, subject, text, html) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                text,
                html
            }, (err, info) => {
                if (err) {
                    console.log(`Ошибка при отправки письма: ${err}`);
                } else {
                    console.log(`Сообщение отправлено ${info.response}`);
                };
            });
        } catch (error) {
            console.log(`Ошибка при отправки письма: ${error.message}`);
        };
    };
};

export const mailServices = new MailServices();