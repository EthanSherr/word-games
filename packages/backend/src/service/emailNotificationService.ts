import nodemailer from "nodemailer";
import { tryCatch } from "@word-games/common/src/promise-utils/tryCatch";
import { z } from "zod";

const envSchema = z.object({
  // e.g., SSL (465) for secure, (TLS) 587
  VITE_EMAIL_NOTIFIER_SECURE: z.boolean().optional(),
  // e.g., "smtp.gmail.com" for Gmail
  VITE_EMAIL_NOTIFIER_HOST: z.string(),
  VITE_EMAIL_NOTIFIER_EMAIL: z.string(),
  VITE_EMAIL_NOTIFIER_PASSWORD: z.string(),
});

export const makeEmailNotifier = () => {
  const {
    VITE_EMAIL_NOTIFIER_SECURE,
    VITE_EMAIL_NOTIFIER_HOST: host,
    VITE_EMAIL_NOTIFIER_EMAIL: user,
    VITE_EMAIL_NOTIFIER_PASSWORD: pass,
  } = envSchema.parse(import.meta.env);

  const secure = Boolean(VITE_EMAIL_NOTIFIER_SECURE);
  // 465 secure port, 587 insecure port.
  const PORT = secure ? 465 : 587;

  const transporter = nodemailer.createTransport({
    host,
    port: PORT,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Word Games" <${user}>`,
      to,
      subject,
      // text fallback
      text,
      // maybe we use an enriched html?
      html,
    };

    return await tryCatch(() => transporter.sendMail(mailOptions));
  };

  return {
    getUser: () => user,
    sendEmail,
  };
};

export type EmailOptions = {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type EmailNotifierService = ReturnType<typeof makeEmailNotifier>;
