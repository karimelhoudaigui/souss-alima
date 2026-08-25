"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, MapPin, Search, X } from "lucide-react";
import type { Scholar } from "@/content/data";
import { StatusBadge } from "@/components/status-badge";
import { publicAsset } from "@/lib/assets";

type ScholarsBrowserProps = {
  scholars: Scholar[];
};

const domains = [
  { id: "all", label: "Tous les domaines", terms: [] },
  { id: "coran", label: "Coran et lectures", terms: ["qur", "coran", "warsh", "qiraat", "hifz", "rasm", "dabt", "tajwid"] },
  { id: "fiqh", label: "Fiqh malikite", terms: ["fiqh", "malikite", "madhhab"] },
  { id: "usul", label: "Usul et methode", terms: ["usul", "hermeneutique", "methodologie", "waraqat"] },
  { id: "hadith", label: "Hadith et isnad", terms: ["hadith", "isnad", "muwatta", "bukhari"] },
  { id: "langue", label: "Langue et adab", terms: ["nahw", "sarf", "balagha", "adab", "litterature", "poesie"] },
  { id: "institution", label: "Institutions", terms: ["madrassa", "qarawiyyin", "rabita", "direction", "enseignant"] }
] as const;

const periods = [
  { id: "all", label: "Toutes les periodes" },
  { id: "contemporary", label: "Contemporains / actifs" },
  { id: "historic", label: "Historiques" }
] as const;

function excerpt(text: string) {
  return text.split("\n").find(Boolean)?.slice(0, 210) ?? "";
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function scholarText(scholar: Scholar) {
  return normalize(
    [
      scholar.nameFr,
      scholar.nameAr,
      scholar.nisba,
      scholar.period,
      scholar.places,
      scholar.biography,
      ...scholar.specialties,
      ...scholar.madrassas,
      ...scholar.teachers,
      ...scholar.students,
      ...scholar.works,
      ...scholar.sources
    ].join(" ")
  );
}

export function ScholarsBrowser({ scholars }: ScholarsBrowserProps) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<(typeof domains)[number]["id"]>("all");
  const [period, setPeriod] = useState<(typeof periods)[number]["id"]>("all");

  const filteredScholars = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const selectedDomain = domains.find((item) => item.id === domain) ?? domains[0];

    return scholars.filter((scholar) => {
      const text = scholarText(scholar);
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesDomain = selectedDomain.id === "all" || selectedDomain.terms.some((term) => text.includes(normalize(term)));
      const isContemporary = /actif|ne en|vivant|202\d|19\d/.test(normalize(scholar.period));
      const matchesPeriod = period === "all" || (period === "contemporary" ? isContemporary : !isContemporary);

      return matchesQuery && matchesDomain && matchesPeriod;
    });
  }, [domain, period, query, scholars]);

  const orderedScholars = useMemo(
    () =>
      [...filteredScholars].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.nameFr.localeCompare(b.nameFr);
      }),
    [filteredScholars]
  );
  const hasActiveFilters = query || domain !== "all" || period !== "all";

  return (
    <div>
      <header className="container-page border-b border-line py-10 md:py-14">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="min-w-0 max-w-full">
            <p className="page-kicker">Dictionnaire biographique</p>
            <h1 className="mt-3 max-w-4xl break-words text-[clamp(2.2rem,11vw,3rem)] font-medium leading-[1.03] text-ink md:text-6xl">Savants et maitres de transmission</h1>
            <p className="page-description max-w-2xl break-words">
              Des fiches reliees aux madrassas, aux chaines d'enseignement, aux textes et aux sources documentaires.
            </p>
          </div>
          <div className="grid min-w-0 max-w-full grid-cols-2 gap-3 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div>
              <p className="metadata-label">Fiches</p>
              <p className="mt-1 text-3xl font-medium text-ink">{scholars.length}</p>
            </div>
            <div>
              <p className="metadata-label">Resultats</p>
              <p className="mt-1 text-3xl font-medium text-ink">{filteredScholars.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-end">
          <form className="min-w-0 max-w-full lg:max-w-3xl" role="search">
            <label className="sr-only" htmlFor="scholar-search">Rechercher un savant</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" aria-hidden="true" />
              <input
                className="input min-h-14 pl-12 text-base"
                id="scholar-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nom, region, maitre, oeuvre, madrassa..."
                value={query}
              />
            </div>
          </form>
          <label className="ui-sans text-sm text-muted">
            Periode
            <select className="input mt-2" onChange={(event) => setPeriod(event.target.value as typeof period)} value={period}>
              {periods.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          {hasActiveFilters ? (
            <button className="button-secondary justify-self-start" onClick={() => { setQuery(""); setDomain("all"); setPeriod("all"); }} type="button">
              <X className="mr-2 h-4 w-4" aria-hidden="true" />
              Reinitialiser
            </button>
          ) : null}
        </div>

        <div className="scroll-area -mx-4 mt-5 flex gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {domains.map((item) => (
            <button
              aria-pressed={domain === item.id}
              className={`filter-chip shrink-0 ${domain === item.id ? "border-brand text-ink" : ""}`}
              key={item.id}
              onClick={() => setDomain(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <section className="container-page py-10 md:pb-16">
        <div className="mb-5 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="page-kicker">Notices documentaires</p>
            <h2 className="section-title">Toutes les fiches</h2>
          </div>
          <p className="ui-sans text-sm text-muted">{orderedScholars.length} fiche{orderedScholars.length > 1 ? "s" : ""}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {orderedScholars.map((scholar) => (
            <ScholarCard key={scholar.slug} scholar={scholar} />
          ))}
          {!orderedScholars.length ? (
            <div className="border-y border-line py-10 text-sm leading-6 text-muted sm:col-span-2 xl:col-span-3 2xl:col-span-4">Aucune fiche ne correspond a cette recherche.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function ScholarCard({ scholar }: { scholar: Scholar }) {
  return (
    <Link
      className="group flex min-w-0 flex-col overflow-hidden border border-line bg-surface transition duration-200 hover:-translate-y-0.5 hover:border-brand-line hover:bg-white hover:shadow-[0_18px_55px_rgba(35,28,21,0.08)] sm:min-h-[560px]"
      href={`/savants/${scholar.slug}`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-subtle">
        {scholar.image ? (
          <Image
            alt=""
            className="object-cover object-[center_48%] transition duration-500 group-hover:scale-[1.025]"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            src={publicAsset(scholar.image) ?? ""}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-semibold text-faint">{scholar.nameFr.slice(0, 1)}</div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <StatusBadge status={scholar.status} />
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line text-brand transition group-hover:border-brand-line group-hover:bg-subtle" aria-hidden="true">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {scholar.nameAr ? <p className="mt-4 line-clamp-2 text-right text-xl leading-8 text-ink" dir="rtl" lang="ar">{scholar.nameAr}</p> : null}
        <h3 className="mt-2 line-clamp-2 text-[1.35rem] font-medium leading-7 text-ink">{scholar.nameFr}</h3>
        <p className="ui-sans mt-2 line-clamp-2 text-sm leading-6 text-muted">{scholar.nisba}</p>

        <div className="ui-sans mt-4 grid gap-2 border-y border-line py-3 text-sm text-muted">
          <p className="grid grid-cols-[18px_1fr] gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-faint" aria-hidden="true" />
            <span className="line-clamp-2">{scholar.places}</span>
          </p>
          <p className="grid grid-cols-[18px_1fr] gap-2">
            <BookOpen className="mt-0.5 h-4 w-4 text-faint" aria-hidden="true" />
            <span className="line-clamp-1">{scholar.period}</span>
          </p>
        </div>

        <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted">{excerpt(scholar.biography)}</p>

        <div className="ui-sans mt-auto flex flex-wrap gap-2 pt-5 text-xs text-muted">
          {scholar.specialties.slice(0, 4).map((specialty) => (
            <span className="border border-line bg-subtle px-2.5 py-1" key={specialty}>{specialty}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
