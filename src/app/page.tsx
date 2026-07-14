import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const programs = await prisma.program.findMany({ where: { isPublished: true }, take: 6, orderBy: { title: "asc" } });
  return (
    <div className="space-y-10">
      <section className="grid min-h-[62vh] items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <p className="font-semibold text-palm">Enseignement coranique traditionnel, organisation moderne</p>
          <h1 className="text-4xl font-bold tracking-normal text-cedar md:text-6xl">Institut Souss Alima</h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-700">
            Mémorisation, tajwîd, rasm et suivi individuel avec un calendrier clair des disponibilités, passages et progressions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn" href="/inscription">S'inscrire</Link>
            <Link className="btn-secondary" href="/programmes">Voir les programmes</Link>
          </div>
        </div>
        <div className="rounded-lg bg-cedar p-6 text-linen shadow-sm">
          <p className="text-sm uppercase tracking-wide text-linen/70">Flux central</p>
          <ol className="mt-4 space-y-4 text-lg">
            <li>1. L'élève déclare ses disponibilités.</li>
            <li>2. L'enseignant propose un passage.</li>
            <li>3. La progression est consignée après correction.</li>
          </ol>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {programs.map((program) => (
          <Link className="panel block" key={program.id} href={`/programmes/${program.slug}`}>
            <p className="text-xs font-semibold uppercase text-saffron">{program.type === "COURSE" ? "Cours en ligne" : "Suivi individuel"}</p>
            <h2 className="mt-2 font-bold text-cedar">{program.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-stone-600">{program.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
