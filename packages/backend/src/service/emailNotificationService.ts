import { tryCatch } from "@word-games/common"
import * as nodemailer from "nodemailer"

export type EmailNotifierProps = {
  host: string
  user: string
  pass: string
  secure: boolean
}

export const makeEmailNotifier = ({
  host,
  user,
  pass,
  secure,
}: EmailNotifierProps) => {
  // 465 secure port, 587 insecure port.
  const PORT = secure ? 465 : 587

  const transporter = nodemailer.createTransport({
    host,
    port: PORT,
    secure,
    auth: {
      user,
      pass,
    },
  })

  const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Word Games" <${user}>`,
      to,
      subject,
      // text fallback
      text,
      // maybe we use an enriched html?
      html,
    }

    return await tryCatch(() => transporter.sendMail(mailOptions))
  }

  return {
    getUser: () => user,
    sendEmail,
  }
}

export type EmailOptions = {
  from?: string
  to: string
  subject: string
  text: string
  html?: string
}

export type EmailNotifierService = ReturnType<typeof makeEmailNotifier>
