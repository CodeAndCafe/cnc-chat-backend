import nodemailer from "nodemailer";
import { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } from "@/configs/env";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  host: MAIL_HOST || "smtp.gmail.com",
  port: Number(MAIL_PORT) || 587,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});
