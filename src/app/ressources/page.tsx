import { PageHeader } from "@/components/ui";

const resources = [
  ["Bibliographie source", "Ouvrages, articles, catalogues et references a relier aux fiches savants, madrassas et publications."],
  ["Manuscrits numerises", "Liens vers collections publiques, bibliotheques, notices et fac-similes autorises."],
  ["Methode editoriale", "Chaque affirmation sensible doit etre sourcee, datee et marquee selon son niveau de verification."]
];

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader
        kicker="Ressources"
        title="Sources et documentation"
        description="Un espace sobre pour organiser les references qui soutiennent les fiches historiques."
      />
      <section className="container-page pb-12">
        <div className="max-w-4xl divide-y divide-line border-y border-line">
          {resources.map(([title, text], index) => (
            <article className="grid gap-3 py-5 md:grid-cols-[44px_1fr]" key={title}>
              <span className="text-sm text-faint">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-base font-medium text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
