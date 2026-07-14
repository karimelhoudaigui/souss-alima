import { SessionActionForm } from "@/components/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminCalendarPage() {
  const sessions = await prisma.session.findMany({ include: { student: true, teacher: true, program: true }, orderBy: { scheduledAt: "asc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-cedar">Calendrier global</h1>
      {sessions.map((item) => (
        <article className="panel" key={item.id}>
          <p className="text-xs font-semibold uppercase text-saffron">{item.status}</p>
          <h2 className="font-bold text-cedar">{item.program.title}</h2>
          <p className="text-sm text-stone-600">{item.student.name} - {item.scheduledAt.toLocaleString("fr-FR")}</p>
          <div className="mt-3"><SessionActionForm id={item.id} canComplete /></div>
        </article>
      ))}
    </div>
  );
}
