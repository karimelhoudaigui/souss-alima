import Link from "next/link";
import { Archive, BookOpen, Map, ScrollText, Users } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { getAllArticles, getAllMadrassas, getAllScholars } from "@/content/store";
import { publicAsset } from "@/lib/assets";

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
  const heroImage = publicAsset("/images/brand/atlasal-maghrib.jpg") ?? "";

  return (
    <div className="overflow-hidden">
      <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-ink text-white">
        <div
          aria-hidden="true"
          className="hero-pan absolute inset-0 z-0 bg-cover bg-[58%_50%] md:bg-center"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(23,18,13,0.92),rgba(23,18,13,0.68)_54%,rgba(23,18,13,0.34)),linear-gradient(0deg,rgba(23,18,13,0.82),rgba(23,18,13,0.12)_46%,rgba(23,18,13,0.42))] md:bg-[linear-gradient(90deg,rgba(23,18,13,0.9),rgba(23,18,13,0.63)_46%,rgba(23,18,13,0.24)),linear-gradient(0deg,rgba(23,18,13,0.78),rgba(23,18,13,0.08)_46%,rgba(23,18,13,0.38))]" />
        <div className="relative z-[2] flex min-h-[calc(100svh-4rem)] items-center">
          <div className="container-page py-10 md:py-16">
            <div className="hero-copy w-full max-w-[22rem] overflow-hidden sm:max-w-xl md:max-w-4xl">
              <p className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-white/78">Atlas documentaire</p>
              <p className="brand-arabic mt-5 max-w-full overflow-hidden text-center text-[clamp(2rem,13vw,2.8rem)] leading-[1.35] text-white drop-shadow-[0_10px_32px_rgba(0,0,0,0.55)] sm:text-5xl md:text-right md:text-7xl" dir="rtl" lang="ar">المغرب العالِم</p>
              <h1 className="mt-3 max-w-5xl break-words text-[clamp(2.3rem,13vw,3.25rem)] font-medium leading-[1.02] text-white drop-shadow-[0_14px_40px_rgba(0,0,0,0.5)] sm:text-[3.6rem] md:text-[6.2rem]">
                <span className="block">Al-Maghrib</span>
                <span className="block">al-ʿĀlim.</span>
              </h1>
              <p className="mt-6 max-w-[21rem] text-lg leading-7 text-white sm:max-w-full sm:text-2xl sm:leading-9 md:max-w-3xl">
                Atlas documentaire du patrimoine savant marocain.
              </p>
              <p className="mt-4 max-w-[21rem] text-base leading-7 text-white/74 sm:max-w-full md:max-w-2xl">
                Madrassas, savants, textes, sources et territoires sont presentes comme un corpus relie, a consulter comme une archive vivante.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="button-primary w-full bg-white text-ink hover:bg-white/90 sm:w-auto" href="/madrassas">Explorer l'atlas</Link>
                <Link className="ui-sans inline-flex min-h-11 w-full items-center justify-center border-b border-white/45 px-1 text-sm font-medium text-white transition hover:border-white sm:w-auto" href="/contribuer">
                  Proposer une source
                </Link>
              </div>
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
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="page-kicker">Corpus</p>
            <h2 className="section-title mt-2">Entrer par les lieux, les personnes et les preuves.</h2>
            <p className="body-copy mt-4">
              Chaque notice est concue pour etre reliee a d'autres objets documentaires : une madrassa mene vers ses savants, un savant vers ses textes, une source vers les fiches qu'elle atteste.
            </p>
          </div>
          <div className="grid border-t border-line md:grid-cols-2">
          {pillars.map(([title, text, Icon, href]) => (
            <Link className="group border-b border-line py-5 transition hover:bg-subtle/45 md:px-5 md:odd:border-r" href={href} key={title}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-medium text-ink">{title}</h2>
                <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </Link>
          ))}
          </div>
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
