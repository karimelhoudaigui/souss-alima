import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ lessonId: z.string(), completed: z.boolean().default(true) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId: parsed.data.lessonId } },
    update: { completed: parsed.data.completed, completedAt: parsed.data.completed ? new Date() : null },
    create: {
      userId: session.user.id,
      lessonId: parsed.data.lessonId,
      completed: parsed.data.completed,
      completedAt: parsed.data.completed ? new Date() : null
    }
  });
  return NextResponse.json(progress);
}
