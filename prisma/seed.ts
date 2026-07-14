import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.document.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.memorizationLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.program.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hashPassword("SoussAlima2026!");

  const [admin, teacherA, teacherB, studentA, studentB, studentC, studentD] = await Promise.all([
    prisma.user.create({ data: { name: "Admin Souss Alima", email: "admin@souss-alima.test", passwordHash, role: "ADMIN" } }),
    prisma.user.create({ data: { name: "Cheikh Abdellah", email: "abdellah@souss-alima.test", passwordHash, role: "TEACHER" } }),
    prisma.user.create({ data: { name: "Oustadha Maryam", email: "maryam@souss-alima.test", passwordHash, role: "TEACHER" } }),
    prisma.user.create({ data: { name: "Youssef Amrani", email: "youssef@example.test", passwordHash, phone: "+212600000001" } }),
    prisma.user.create({ data: { name: "Salma El Idrissi", email: "salma@example.test", passwordHash, phone: "+212600000002" } }),
    prisma.user.create({ data: { name: "Nour Eddine", email: "nour@example.test", passwordHash } }),
    prisma.user.create({ data: { name: "Amina Benali", email: "amina@example.test", passwordHash } })
  ]);

  const programs = await Promise.all([
    prisma.program.create({
      data: {
        slug: "memorisation-hafs",
        title: "Mémorisation du Coran - Riwaya Hafs",
        description: "Suivi individuel pour l'apprentissage, la révision et la correction en riwaya Hafs.",
        type: "MEMORIZATION",
        riwaya: "HAFS"
      }
    }),
    prisma.program.create({
      data: {
        slug: "memorisation-qalun",
        title: "Mémorisation du Coran - Riwaya Qâlûn",
        description: "Programme de mémorisation avec passages réguliers auprès d'un enseignant.",
        type: "MEMORIZATION",
        riwaya: "QALUN"
      }
    }),
    prisma.program.create({
      data: {
        slug: "memorisation-warsh",
        title: "Mémorisation du Coran - Riwaya Warsh",
        description: "Accompagnement progressif en riwaya Warsh, avec calendrier de récitation.",
        type: "MEMORIZATION",
        riwaya: "WARSH"
      }
    }),
    prisma.program.create({
      data: {
        slug: "shatibiyya",
        title: "Étude et mémorisation de la Shâtibiyya",
        description: "Étude guidée du matn avec passages, corrections et notes de progression.",
        type: "MEMORIZATION",
        riwaya: "NONE"
      }
    }),
    prisma.program.create({
      data: {
        slug: "tajwid",
        title: "Cours de Tajwîd",
        description: "Modules vidéo structurés pour consolider la lecture et les règles de tajwîd.",
        type: "COURSE",
        riwaya: "NONE"
      }
    }),
    prisma.program.create({
      data: {
        slug: "rasm",
        title: "Cours de Rasm",
        description: "Introduction au rasm coranique avec leçons vidéo et supports PDF.",
        type: "COURSE",
        riwaya: "NONE"
      }
    })
  ]);

  const [hafs, qalun, warsh, shatibiyya, tajwid, rasm] = programs;

  await prisma.module.create({
    data: {
      programId: tajwid.id,
      title: "Fondations de la récitation",
      order: 1,
      lessons: {
        create: [
          {
            title: "Makharij : points de sortie",
            description: "Identifier les points de sortie principaux.",
            videoUrl: "demo/videos/tajwid-makharij.mp4",
            order: 1,
            documents: { create: [{ title: "Fiche makharij", fileUrl: "demo/docs/makharij.pdf", fileType: "application/pdf" }] }
          },
          {
            title: "Sifât : caractéristiques des lettres",
            description: "Différencier les caractéristiques fortes et faibles.",
            videoUrl: "demo/videos/tajwid-sifat.mp4",
            order: 2,
            documents: { create: [{ title: "Tableau des sifât", fileUrl: "demo/docs/sifat.pdf", fileType: "application/pdf" }] }
          }
        ]
      }
    }
  });

  await prisma.module.create({
    data: {
      programId: tajwid.id,
      title: "Règles de lecture",
      order: 2,
      lessons: {
        create: [
          { title: "Nûn sakina et tanwîn", videoUrl: "demo/videos/nun-sakina.mp4", order: 1 },
          { title: "Mîm sakina", videoUrl: "demo/videos/mim-sakina.mp4", order: 2 },
          { title: "Madd : prolongations", videoUrl: "demo/videos/madd.mp4", order: 3 }
        ]
      }
    }
  });

  await prisma.module.create({
    data: {
      programId: rasm.id,
      title: "Introduction au rasm",
      order: 1,
      lessons: {
        create: [
          { title: "Principes du rasm 'uthmânî", videoUrl: "demo/videos/rasm-principes.mp4", order: 1 },
          { title: "Cas fréquents d'écriture", videoUrl: "demo/videos/rasm-cas.mp4", order: 2 }
        ]
      }
    }
  });

  const enrollmentA = await prisma.enrollment.create({ data: { userId: studentA.id, programId: hafs.id, status: "ACTIVE" } });
  await prisma.enrollment.createMany({
    data: [
      { userId: studentA.id, programId: tajwid.id, status: "ACTIVE" },
      { userId: studentB.id, programId: warsh.id, status: "ACTIVE" },
      { userId: studentB.id, programId: qalun.id, status: "PENDING" },
      { userId: studentC.id, programId: shatibiyya.id, status: "ACTIVE" },
      { userId: studentD.id, programId: rasm.id, status: "PENDING" }
    ]
  });

  await prisma.availability.createMany({
    data: [
      { userId: studentA.id, programId: hafs.id, dayOfWeek: 1, startTime: "18:00", endTime: "20:00", isRecurring: true },
      { userId: studentA.id, programId: tajwid.id, dayOfWeek: 3, startTime: "19:00", endTime: "20:30", isRecurring: true },
      { userId: studentB.id, programId: warsh.id, dayOfWeek: 2, startTime: "17:00", endTime: "19:00", isRecurring: true },
      { userId: studentC.id, programId: shatibiyya.id, dayOfWeek: 6, startTime: "09:00", endTime: "11:00", isRecurring: true }
    ]
  });

  const soon = new Date();
  soon.setDate(soon.getDate() + ((1 + 7 - soon.getDay()) % 7 || 7));
  soon.setHours(18, 15, 0, 0);

  await prisma.session.createMany({
    data: [
      { studentId: studentA.id, teacherId: teacherA.id, programId: hafs.id, scheduledAt: soon, status: "PROPOSED", durationMin: 20 },
      { studentId: studentB.id, teacherId: teacherB.id, programId: warsh.id, scheduledAt: new Date(Date.now() + 3 * 86400000), status: "CONFIRMED", durationMin: 20 },
      { studentId: studentA.id, teacherId: teacherA.id, programId: hafs.id, scheduledAt: new Date(Date.now() - 7 * 86400000), status: "DONE", notes: "Lecture stable, travailler les madd.", durationMin: 20 }
    ]
  });

  await prisma.memorizationLog.create({
    data: {
      enrollmentId: enrollmentA.id,
      surah: "البقرة",
      ayahFrom: 1,
      ayahTo: 25,
      juz: 1,
      page: 5,
      note: "Dernier passage validé avec reprise des fins d'ayat."
    }
  });

  await prisma.notification.createMany({
    data: [
      { userId: studentA.id, type: "SESSION_PROPOSED", message: "Un passage Hafs vous a été proposé lundi à 18:15.", link: "/dashboard/calendrier" },
      { userId: admin.id, type: "SYSTEM", message: "Une inscription Rasm est en attente de validation.", link: "/admin/inscriptions" }
    ]
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
