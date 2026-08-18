import { PageHeader } from "@/components/ui";
import { glossary } from "@/content/data";

export default function GlossaryPage() {
  return (
    <div>
      <PageHeader
        kicker="Glossaire"
        title="Termes de reference"
        description="Une interface de consultation rapide pour les termes arabes, leur usage et leur definition."
      >
        <form className="max-w-2xl" role="search">
          <label className="sr-only" htmlFor="glossary-search">Rechercher un terme</label>
          <input className="input min-h-12" id="glossary-search" placeholder="Rechercher un terme, une racine ou une categorie" />
        </form>
        <div className="mt-4 flex gap-2 overflow-x-auto text-sm text-muted" aria-label="Alphabet">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => <span className="px-1.5" key={letter}>{letter}</span>)}
        </div>
      </PageHeader>

      <section className="container-page pb-12">
        <div className="max-w-4xl divide-y divide-line border-y border-line">
          {glossary.map((item) => (
            <article className="grid gap-3 py-5 md:grid-cols-[120px_1fr]" key={item.term}>
              <div>
                <p className="text-lg font-medium text-ink">{item.term}</p>
                <p className="mt-1 text-right text-xl text-ink" dir="rtl" lang="ar">{item.ar}</p>
              </div>
              <div>
                <p className="text-sm leading-7 text-muted">{item.definition}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-faint">{item.category}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
