import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { LessonDoneButton } from "@/components/actions";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StudentProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/connexion");
  const { slug } = await params;
  const program = await prisma.program.findUnique({
    where: { slug },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" }, include: { documents: true, progress: { where: { userId: session.user.id } } } } } },
      enrollments: { where: { userId: session.user.id }, include: { memorizationLog: { orderBy: { createdAt: "desc" } } } }
    }
  });
  if (!program || program.enrollments.length === 0) notFound();
  const lessons = program.modules.flatMap((module) => module.lessons);
  const completed = lessons.filter((lesson) => lesson.progress.some((item) => item.completed)).length;
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-cedar">{program.title}</h1>
      {program.type === "COURSE" ? (
        <>
          <div className="panel">
            <p className="font-semibold text-palm">Progression : {lessons.length ? Math.round((completed / lessons.length) * 100) : 0}%</p>
          </div>
          {program.modules.map((module) => (
            <section key={module.id} className="space-y-3">
              <h2 className="text-xl font-bold text-cedar">{module.title}</h2>
              {module.lessons.map((lesson) => (
                <article key={lesson.id} className="panel">
                  <h3 className="font-semibold">{lesson.title}</h3>
                  {lesson.videoUrl && <video className="mt-3 aspect-video w-full rounded-md bg-stone-900" src={lesson.videoUrl} controls />}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lesson.documents.map((document) => <a className="btn-secondary py-1" key={document.id} href={document.fileUrl}>Télécharger {document.title}</a>)}
                    {lesson.progress.some((item) => item.completed) ? <span className="text-sm text-palm">Terminé</span> : <LessonDoneButton lessonId={lesson.id} />}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </>
      ) : (
        <section className="panel">
          <h2 className="font-semibold text-cedar">Frise de progression</h2>
          <div className="mt-4 space-y-3">
            {program.enrollments[0].memorizationLog.map((log) => (
              <div key={log.id} className="border-l-4 border-palm pl-3">
                <p className="font-semibold" dir="rtl">{log.surah}</p>
                <p className="text-sm text-stone-600">Jouz {log.juz ?? "-"}, page {log.page ?? "-"} - {log.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
