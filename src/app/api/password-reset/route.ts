import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/mail";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({ token: z.string().min(20), password: z.string().min(8) });

export async function POST(request: Request) {
  const body = await request.json();
  if ("token" in body) {
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const user = await prisma.user.findFirst({ where: { resetToken: parsed.data.token, resetTokenExp: { gt: new Date() } } });
    if (!user) return NextResponse.json({ error: "Lien invalide." }, { status: 400 });
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(parsed.data.password), resetToken: null, resetTokenExp: null } });
    return NextResponse.json({ ok: true });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExp: new Date(Date.now() + 3600000) } });
    await sendMail({
      to: user.email,
      subject: "Réinitialisation du mot de passe",
      text: `Lien de réinitialisation : ${process.env.NEXTAUTH_URL}/connexion?reset=${token}`
    });
  }
  return NextResponse.json({ ok: true });
}
