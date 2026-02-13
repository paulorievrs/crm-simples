import sgMail from "@sendgrid/mail";

import { getResetPasswordEmailHtml } from "./reset-password-template";

export async function sendResetPasswordEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL");
  }

  sgMail.setApiKey(apiKey);

  await sgMail.send({
    to,
    from: {
      email: from,
      name: "SaaS CRM"
    },
    subject: "Redefinir sua senha — SaaS CRM",
    html: getResetPasswordEmailHtml(resetUrl)
  });
}
