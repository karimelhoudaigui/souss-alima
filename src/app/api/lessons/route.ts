import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  moduleId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  order: z.coerce.number().int().min(1)
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const lesson = await prisma.lesson.create({ data: parsed.data, include: { module: { include: { program: { include: { enrollments: true } } } } } });
  await Promise.all(
    lesson.module.program.enrollments
      .filter((enrollment) => enrollment.status === "ACTIVE")
      .map((enrollment) =>
        notifyUser({
          userId: enrollment.userId,
          type: "NEW_CONTENT",
          message: `Nouvelle leçon publiée dans ${lesson.module.program.title}.`,
          link: `/dashboard/programmes/${lesson.module.program.slug}`
        })
      )
  );
  return NextResponse.json(lesson, { status: 201 });
}
