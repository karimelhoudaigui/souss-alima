import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProgramsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const type = params.type === "COURSE" || params.type === "MEMORIZATION" ? params.type : undefined;
  const programs = await prisma.program.findMany({ where: { isPublished: true, type }, orderBy: { title: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cedar">Nos programmes</h1>
        <div className="mt-4 flex gap-2">
          <Link className="btn-secondary" href="/programmes">Tous</Link>
          <Link className="btn-secondary" href="/programmes?type=MEMORIZATION">Suivi individuel</Link>
          <Link className="btn-secondary" href="/programmes?type=COURSE">Cours en ligne</Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((program) => (
          <Link className="panel block" key={program.id} href={`/programmes/${program.slug}`}>
            <h2 className="font-bold text-cedar">{program.title}</h2>
            <p className="mt-2 text-sm text-stone-600">{program.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
