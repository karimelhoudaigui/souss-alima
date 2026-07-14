import { prisma } from "@/lib/prisma";

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({ include: { modules: { include: { lessons: true } } }, orderBy: { title: "asc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-cedar">Programmes</h1>
      {programs.map((program) => (
        <article key={program.id} className="panel">
          <p className="text-xs font-semibold uppercase text-saffron">{program.type}</p>
          <h2 className="font-bold text-cedar">{program.title}</h2>
          <p className="mt-2 text-sm text-stone-600">{program.modules.length} module(s), {program.modules.flatMap((module) => module.lessons).length} leçon(s)</p>
        </article>
      ))}
    </div>
  );
}
