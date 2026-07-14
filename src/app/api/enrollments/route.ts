import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { notifyUser } from "@/lib/notifications";

const statusSchema = z.object({
  enrollmentId: z.string(),
  status: z.enum(["PENDING", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"])
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const where = session.user.role === "STUDENT" ? { userId: session.user.id } : {};
  const enrollments = await prisma.enrollment.findMany({
    where,
    include: { user: true, program: true, memorizationLog: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(enrollments);
}

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      passwordHash: await hashPassword(data.password),
      role: "STUDENT",
      enrollments: {
        create: data.programIds.map((programId) => ({ programId, status: "PENDING" }))
      }
    },
    include: { enrollments: true }
  });

  await notifyUser({
    userId: user.id,
    type: "SYSTEM",
    message: "Votre demande d'inscription a été reçue et sera validée par l'équipe.",
    link: "/dashboard",
    email: {
      to: user.email,
      subject: "Demande d'inscription reçue",
      text: "Votre demande d'inscription à l'Institut Souss Alima est en attente de validation."
    }
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const enrollment = await prisma.enrollment.update({
    where: { id: parsed.data.enrollmentId },
    data: { status: parsed.data.status },
    include: { user: true, program: true }
  });
  await notifyUser({
    userId: enrollment.userId,
    type: "SYSTEM",
    message: `Votre inscription au programme ${enrollment.program.title} est maintenant ${enrollment.status}.`,
    link: "/dashboard"
  });
  return NextResponse.json(enrollment);
}
