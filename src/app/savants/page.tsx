import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, MapPin, Search, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { getAllScholars } from "@/content/store";

function excerpt(text: string) {
  return text.split("\n").find(Boolean)?.slice(0, 210) ?? "";
}

export default async function ScholarsPage() {
  const scholars = await getAllScholars();
  const featured = scholars.filter((scholar) => scholar.featured);
  const specialties = Array.from(new Set(scholars.flatMap((scholar) => scholar.specialties).slice(0, 24)));

  return (
    <div className="overflow-x-hidden">
      <header className="container-page py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div className="min-w-0 max-w-[22rem] sm:max-w-none">
            <p className="page-kicker">Repertoire biographique</p>
            <h1 className="mt-3 max-w-[22rem] break-words text-4xl font-semibold text-ink sm:max-w-4xl md:text-6xl">Savants et maitres de transmission</h1>
            <p className="page-description max-w-[22rem] sm:max-w-2xl">
              Des fiches reliees aux madrassas, aux chaines d'enseignement, aux textes et aux sources documentaires.
            </p>
          </div>
          <div className="grid w-full max-w-[22rem] min-w-0 grid-cols-2 gap-3 rounded-[18px] border border-line bg-surface p-4 sm:max-w-none">
            <div>
              <p className="metadata-label">Fiches</p>
              <p className="mt-1 text-3xl font-semibold text-ink">{scholars.length}</p>
            </div>
            <div>
              <p className="metadata-label">Sourcees</p>
              <p className="mt-1 text-3xl font-semibold text-ink">{scholars.filter((scholar) => scholar.status === "sourced").length}</p>
            </div>
          </div>
        </div>

        <form className="mt-8 w-full max-w-[22rem] sm:max-w-3xl" role="search">
          <label className="sr-only" htmlFor="scholar-search">Rechercher un savant</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input className="input min-h-14 pl-12 text-base" id="scholar-search" placeholder="Rechercher par nom, region, specialite ou madrassa" />
          </div>
        </form>

        <div className="mt-5 flex max-w-[22rem] flex-wrap gap-2 overflow-hidden sm:max-w-full">
          {specialties.slice(0, 10).map((specialty) => (
            <span className="filter-chip" key={specialty}>{specialty}</span>
          ))}
        </div>
      </header>

      {featured.length ? (
        <section className="container-page border-t border-line py-10">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="section-title">Fiches principales</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {featured.map((scholar) => (
              <ScholarCard key={scholar.slug} scholar={scholar} prominent />
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page border-t border-line py-10 md:pb-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="section-title">Toutes les fiches</h2>
          <p className="text-sm text-muted">{scholars.length} entree{scholars.length > 1 ? "s" : ""}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {scholars.map((scholar) => (
            <ScholarCard key={scholar.slug} scholar={scholar} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ScholarCard({ prominent = false, scholar }: { prominent?: boolean; scholar: Awaited<ReturnType<typeof getAllScholars>>[number] }) {
  return (
    <Link
      className={`group grid min-w-0 overflow-hidden rounded-[18px] border border-line bg-surface transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_24px_60px_rgba(37,45,48,0.10)] ${prominent ? "md:grid-cols-[240px_1fr]" : ""}`}
      href={`/savants/${scholar.slug}`}
    >
      <div className={`relative bg-subtle ${prominent ? "min-h-[300px]" : "aspect-[4/5]"}`}>
        {scholar.image ? (
          <Image
            alt=""
            className="h-full w-full object-cover object-[center_58%] transition duration-500 group-hover:scale-[1.03]"
            fill
            sizes={prominent ? "(max-width: 768px) 100vw, 240px" : "(max-width: 768px) 100vw, 33vw"}
            src={scholar.image}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-semibold text-faint">{scholar.nameFr.slice(0, 1)}</div>
        )}
      </div>

      <div className="flex min-w-0 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <StatusBadge status={scholar.status} />
          <ArrowUpRight className="h-5 w-5 shrink-0 text-faint transition group-hover:text-brand" aria-hidden="true" />
        </div>

        {scholar.nameAr ? <p className="mt-5 text-right text-xl leading-8 text-ink" dir="rtl" lang="ar">{scholar.nameAr}</p> : null}
        <h3 className="mt-2 text-xl font-semibold leading-7 text-ink">{scholar.nameFr}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{scholar.nisba}</p>

        <div className="mt-4 grid gap-2 text-sm text-muted">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
            <span className="line-clamp-1">{scholar.places}</span>
          </p>
          <p className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
            <span>{scholar.period}</span>
          </p>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">{excerpt(scholar.biography)}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {scholar.specialties.slice(0, 4).map((specialty) => (
            <span className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-muted" key={specialty}>{specialty}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
