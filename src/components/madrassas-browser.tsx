"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Madrassa } from "@/content/data";
import { MadrassaMap } from "@/components/madrassa-map";
import { StatusBadge } from "@/components/status-badge";
import { publicAsset } from "@/lib/assets";

type MadrassasBrowserProps = {
  madrassas: Madrassa[];
};

const axes = [
  { id: "all", label: "Tous les axes", terms: [] },
  { id: "coran", label: "Coran et hifz", terms: ["qur", "coran", "hifz", "tajwid", "alwah"] },
  { id: "fiqh", label: "Fiqh malikite", terms: ["fiqh", "malikite", "mukhtasar", "khalil"] },
  { id: "usul", label: "Usul al-fiqh", terms: ["usul", "fondements", "waraqat"] },
  { id: "langue", label: "Langue arabe", terms: ["nahw", "sarf", "balagha", "adab", "grammaire"] },
  { id: "hadith", label: "Hadith et isnad", terms: ["hadith", "isnad", "muwatta", "bukhari"] },
  { id: "accueil", label: "Internat et accueil", terms: ["internat", "hebergement", "restauration", "bourse"] },
  { id: "archives", label: "Bibliotheque et sources", terms: ["bibliotheque", "manuscrit", "source", "archive"] },
  { id: "qiraat", label: "Qiraat", terms: ["qiraat", "sept lectures", "shatibiyya", "warsh", "rasm", "dabt"] }
] as const;

const verificationFilters = [
  { id: "all", label: "Tous les statuts" },
  { id: "sourced", label: "Sources verifiees" },
  { id: "to_verify", label: "A verifier" }
] as const;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function madrassaText(madrassa: Madrassa) {
  return normalize(
    [
      madrassa.name,
      madrassa.nameAr,
      madrassa.village,
      madrassa.commune,
      madrassa.province,
      madrassa.currentStatus,
      madrassa.contact,
      madrassa.history,
      ...madrassa.specialties,
      ...(madrassa.sources ?? [])
    ].join(" ")
  );
}

export function MadrassasBrowser({ madrassas }: MadrassasBrowserProps) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("all");
  const [axis, setAxis] = useState<(typeof axes)[number]["id"]>("all");
  const [verification, setVerification] = useState<(typeof verificationFilters)[number]["id"]>("all");

  const provinces = useMemo(
    () => Array.from(new Set(madrassas.map((madrassa) => madrassa.province).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [madrassas]
  );

  const filteredMadrassas = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const selectedAxis = axes.find((item) => item.id === axis) ?? axes[0];

    return madrassas.filter((madrassa) => {
      const text = madrassaText(madrassa);
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesProvince = province === "all" || madrassa.province === province;
      const matchesAxis = selectedAxis.id === "all" || selectedAxis.terms.some((term) => text.includes(normalize(term)));
      const matchesVerification = verification === "all" || madrassa.status === verification;

      return matchesQuery && matchesProvince && matchesAxis && matchesVerification;
    });
  }, [axis, madrassas, province, query, verification]);

  const mapMadrassas = filteredMadrassas.map((madrassa) => ({
    id: madrassa.slug,
    slug: madrassa.slug,
    name: madrassa.name,
    nameAr: madrassa.nameAr,
    latitude: madrassa.lat,
    longitude: madrassa.lng,
    city: madrassa.commune,
    province: madrassa.province,
    specialties: madrassa.specialties,
    status: madrassa.status,
    description: madrassa.history,
    image: publicAsset(madrassa.image) ?? undefined
  }));

  const hasActiveFilters = query || province !== "all" || axis !== "all" || verification !== "all";

  return (
    <>
      <header className="grid min-w-0 gap-8 border-b border-line pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="page-kicker">Index territorial</p>
          <h1 className="mt-3 break-words text-[clamp(2.25rem,12vw,3rem)] font-medium text-ink md:text-6xl">Madrassas</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Rechercher, comparer et localiser les etablissements documentes sur la carte.
          </p>
        </div>
        <form className="min-w-0 lg:justify-self-end lg:w-full lg:max-w-2xl" role="search">
          <label className="sr-only" htmlFor="madrassa-search">Rechercher une madrassa</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input
              className="input min-h-12 pl-12"
              id="madrassa-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nom, ville, province, cheikh, source..."
              value={query}
            />
          </div>
        </form>
      </header>

      <section className="border-b border-line py-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="ui-sans text-sm text-muted">
                Territoire
                <select className="input mt-2" onChange={(event) => setProvince(event.target.value)} value={province}>
                  <option value="all">Tous les territoires</option>
                  {provinces.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="ui-sans text-sm text-muted">
                Verification documentaire
                <select className="input mt-2" onChange={(event) => setVerification(event.target.value as typeof verification)} value={verification}>
                  {verificationFilters.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="scroll-area -mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {axes.map((item) => (
                <button
                  aria-pressed={axis === item.id}
                  className={`filter-chip shrink-0 ${axis === item.id ? "border-brand text-ink" : ""}`}
                  key={item.id}
                  onClick={() => setAxis(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {hasActiveFilters ? (
            <button className="button-secondary justify-self-start" onClick={() => { setQuery(""); setProvince("all"); setAxis("all"); setVerification("all"); }} type="button">
              <X className="mr-2 h-4 w-4" aria-hidden="true" />
              Reinitialiser
            </button>
          ) : null}
        </div>
      </section>

      <div className="mt-6 grid min-w-0 gap-6 lg:min-h-[680px] lg:grid-cols-[minmax(360px,0.78fr)_1.22fr]">
        <section className="order-2 min-w-0 lg:order-1">
          <div className="mb-3 flex items-center justify-between">
            <p className="ui-sans text-sm text-muted">
              {filteredMadrassas.length} etablissement{filteredMadrassas.length > 1 ? "s" : ""}
            </p>
            <p className="metadata-label">Index</p>
          </div>
          <div className="scroll-area divide-y divide-line border-y border-line lg:max-h-[calc(100vh-14.5rem)] lg:overflow-y-auto lg:pr-2">
            {filteredMadrassas.map((madrassa) => (
              <Link className="entity-row group min-w-0" href={`/madrassas/${madrassa.slug}`} key={madrassa.slug}>
                <div className="grid min-w-0 gap-4 sm:grid-cols-[200px_minmax(0,1fr)]">
                  {madrassa.image ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-subtle">
                      <Image
                        alt=""
                        className="object-cover transition duration-500 group-hover:scale-[1.015]"
                        fill
                        sizes="(max-width: 640px) calc(100vw - 3rem), 200px"
                        src={publicAsset(madrassa.image) ?? ""}
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                      <div className="min-w-0">
                        <p className="break-words text-right text-lg leading-8 text-ink" dir="rtl" lang="ar">{madrassa.nameAr}</p>
                        <p className="mt-1 break-words text-lg font-medium leading-6 text-ink">{madrassa.name}</p>
                        <p className="ui-sans mt-2 break-words text-sm text-muted">{madrassa.village} · {madrassa.commune} · {madrassa.province}</p>
                      </div>
                      <StatusBadge status={madrassa.status} />
                    </div>
                    <p className="ui-sans mt-3 break-words text-sm leading-6 text-muted">{madrassa.specialties.slice(0, 8).join(" · ")}</p>
                  </div>
                </div>
              </Link>
            ))}
            {!filteredMadrassas.length ? (
              <div className="py-10 text-sm leading-6 text-muted">Aucune madrassa ne correspond a cette recherche.</div>
            ) : null}
          </div>
        </section>

        <section className="order-1 min-w-0 lg:sticky lg:top-24 lg:order-2 lg:h-[min(720px,calc(100vh-7rem))]">
          <MadrassaMap className="h-[360px] sm:h-[440px] lg:h-full" madrassas={mapMadrassas} />
        </section>
      </div>
    </>
  );
}
