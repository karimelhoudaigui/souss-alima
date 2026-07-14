import { NotificationType } from "@prisma/client";
import { prisma } from "./prisma";
import { sendMail } from "./mail";

export async function notifyUser(input: {
  userId: string;
  type: NotificationType;
  message: string;
  link?: string;
  email?: { to: string; subject: string; text: string };
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      message: input.message,
      link: input.link
    }
  });

  if (input.email) {
    await sendMail(input.email);
  }

  return notification;
}
