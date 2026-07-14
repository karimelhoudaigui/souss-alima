import nodemailer from "nodemailer";

export async function sendMail(input: { to: string; subject: string; text: string }) {
  if (!process.env.SMTP_HOST) {
    console.info("[mail]", input);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "Institut Souss Alima <noreply@example.test>",
    ...input
  });
}
