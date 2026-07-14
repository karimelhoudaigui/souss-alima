import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProgramDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await prisma.program.findUnique({ where: { slug }, include: { modules: { include: { lessons: true } } } });
  if (!program) notFound();
  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <p className="font-semibold text-palm">{program.type === "COURSE" ? "Cours en ligne" : "Suivi individuel"}</p>
      <h1 className="text-4xl font-bold text-cedar">{program.title}</h1>
      <p className="text-lg leading-8 text-stone-700">{program.description}</p>
      <div className="panel">
        <h2 className="font-semibold text-cedar">Prérequis</h2>
        <p className="mt-2 text-sm text-stone-600">{program.prerequisites}</p>
      </div>
      <div className="panel">
        <h2 className="font-semibold text-cedar">Modalités</h2>
        <p className="mt-2 text-sm text-stone-600">
          {program.type === "COURSE"
            ? "Accès à des modules vidéo, documents PDF et suivi de leçons terminées."
            : "Déclaration de disponibilités, proposition de passages, confirmation puis note de progression."}
        </p>
      </div>
      <Link className="btn" href="/inscription">Demander une inscription</Link>
    </article>
  );
}
