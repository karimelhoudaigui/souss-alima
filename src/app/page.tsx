import Link from "next/link";
import { Archive, BookOpen, Map, Network, ScrollText, Users } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { getAllArticles, getAllMadrassas, getAllScholars } from "@/content/store";

const pillars = [
  ["Madrassas", "Recenser les ecoles traditionnelles, leur localisation, leur histoire et leurs enseignements.", Map, "/madrassas"],
  ["Savants", "Constituer des biographies reliees aux maitres, disciples, lieux et chaines de transmission.", Users, "/savants"],
  ["Sources", "Referencer ouvrages, manuscrits, notices, publications et temoignages verifiables.", Archive, "/ressources"],
  ["Articles", "Publier des etudes organisees par themes : qiraat, patrimoine, histoire, methodes et textes.", ScrollText, "/articles"]
] as const;

const aims = [
  ["Cartographier", "les madrassas, zawiyas, lieux d'enseignement et foyers savants."],
  ["Documenter", "les programmes, cheikhs, textes et pratiques de transmission."],
  ["Relier", "les ecoles, savants, oeuvres, sources et territoires dans une meme base."]
];

export default async function HomePage() {
  const [articles, madrassas, scholars] = await Promise.all([getAllArticles(), getAllMadrassas(), getAllScholars()]);

  return (
    <div>
      <section className="container-page py-12 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <p className="page-kicker">Plateforme documentaire patrimoniale</p>
            <h1 className="mt-4 max-w-5xl text-[3.2rem] font-semibold leading-[0.98] text-ink md:text-[6.4rem]">
              Explorer le Souss savant.
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-ink">
              Une cartographie documentee des madrassas, savants, oeuvres et publications liees au patrimoine scientifique traditionnel du Souss.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Souss Alima construit progressivement une base documentaire ou chaque fiche peut etre reliee a des lieux, biographies, textes, sources et reseaux de transmission.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="button-primary" href="/madrassas">Explorer la carte</Link>
              <Link className="rounded-[12px] border border-line px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-subtle" href="/contribuer">
                Proposer une source
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-[18px] border border-line bg-surface p-4">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Madrassas" value={madrassas.length} />
              <Stat label="Savants" value={scholars.length} />
              <Stat label="Articles" value={articles.length} />
            </div>
            <div className="rounded-[14px] bg-subtle p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-ink">
                <Network className="h-4 w-4 text-brand" aria-hidden="true" />
                Base relationnelle
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Le projet n'est pas un simple annuaire : les contenus sont penses pour etre croises, verifies et enrichis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid md:grid-cols-3">
          {aims.map(([title, text]) => (
            <div className="border-line py-7 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0" key={title}>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map(([title, text, Icon, href]) => (
            <Link className="group rounded-[18px] border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_24px_60px_rgba(37,45,48,0.10)]" href={href} key={title}>
              <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-10 border-t border-line py-10 md:py-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="page-kicker">Carte documentaire</p>
              <h2 className="section-title mt-2">Madrassas documentees</h2>
            </div>
            <Link className="text-sm font-medium text-brand hover:text-brand-hover" href="/madrassas">Tout explorer</Link>
          </div>
          <div className="mt-5 divide-y divide-line border-y border-line">
            {madrassas.slice(0, 5).map((madrassa) => (
              <Link className="entity-row grid gap-3 md:grid-cols-[1fr_0.8fr_auto] md:items-center" href={`/madrassas/${madrassa.slug}`} key={madrassa.slug}>
                <div>
                  <p className="text-base font-medium text-ink">{madrassa.name}</p>
                  <p className="mt-1 text-sm text-muted">{madrassa.commune} · {madrassa.province}</p>
                </div>
                <p className="text-sm text-muted">{madrassa.specialties.slice(0, 3).join(" · ")}</p>
                <StatusBadge status={madrassa.status} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="page-kicker">Transmission</p>
              <h2 className="section-title mt-2">Savants et biographies</h2>
            </div>
            <Link className="text-sm font-medium text-brand hover:text-brand-hover" href="/savants">Voir</Link>
          </div>
          <div className="mt-5 divide-y divide-line border-y border-line">
            {scholars.slice(0, 4).map((scholar) => (
              <Link className="entity-row" href={`/savants/${scholar.slug}`} key={scholar.slug}>
                <p className="text-right text-lg text-ink" dir="rtl" lang="ar">{scholar.nameAr}</p>
                <p className="mt-1 text-base font-medium text-ink">{scholar.nameFr}</p>
                <p className="mt-1 text-sm text-muted">{scholar.places}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page border-t border-line py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand" aria-hidden="true" />
            <h2 className="section-title">Publications editoriales</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Les articles servent a contextualiser les fiches : qiraat, methodes d'enseignement, histoire des madrassas, manuscrits et savants du Souss.
          </p>
        </div>
        <div className="mt-5 divide-y divide-line border-y border-line">
          {articles.slice(0, 4).map((article) => (
            <Link className="entity-row" href={`/articles/${article.slug}`} key={article.slug}>
              <p className="text-base font-medium text-ink">{article.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{article.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] border border-line bg-background p-4">
      <p className="metadata-label">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}
