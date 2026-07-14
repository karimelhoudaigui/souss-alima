import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  await sendMail({
    to: process.env.SMTP_FROM ?? "admin@souss-alima.test",
    subject: `Contact site - ${parsed.data.name}`,
    text: `${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`
  });
  return NextResponse.json({ ok: true });
}
