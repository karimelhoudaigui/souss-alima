import Link from "next/link";
import Image from "next/image";
import { FilterChip, PageHeader } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { scholars } from "@/content/data";

export default function ScholarsPage() {
  const grouped = scholars.reduce<Record<string, typeof scholars>>((acc, scholar) => {
    const letter = scholar.nameFr[0]?.toUpperCase() ?? "#";
    acc[letter] = [...(acc[letter] ?? []), scholar];
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        kicker="Repertoire"
        title="Savants"
        description="Un repertoire structure pour relier biographies, lieux d'enseignement, specialites, oeuvres et sources."
      >
        <form className="max-w-2xl" role="search">
          <label className="sr-only" htmlFor="scholar-search">Rechercher un savant</label>
          <input className="input min-h-12" id="scholar-search" placeholder="Nom, region, specialite ou madrassa" />
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Region", "Siecle", "Specialite", "Madrassa"].map((filter) => <FilterChip key={filter}>{filter}</FilterChip>)}
        </div>
      </PageHeader>

      <section className="container-page pb-12">
        <div className="max-w-4xl divide-y divide-line border-y border-line">
          {Object.entries(grouped).map(([letter, items]) => (
            <div className="grid gap-4 py-6 md:grid-cols-[80px_1fr]" key={letter}>
              <h2 className="text-sm font-semibold text-ink">{letter}</h2>
              <div className="divide-y divide-line">
                {items.map((scholar) => (
                  <Link className="entity-row grid gap-4 md:grid-cols-[84px_1fr_auto]" href={`/savants/${scholar.slug}`} key={scholar.slug}>
                    {scholar.image ? (
                      <Image alt="" className="h-20 w-20 rounded-[14px] object-cover object-[center_38%]" height={160} sizes="80px" src={scholar.image} width={160} />
                    ) : (
                      <div className="hidden h-20 w-20 rounded-[14px] bg-subtle md:block" />
                    )}
                    <div className="min-w-0">
                      <p className="text-right text-lg text-ink" dir="rtl" lang="ar">{scholar.nameAr}</p>
                      <h3 className="mt-1 text-base font-medium text-ink">{scholar.nameFr}</h3>
                      <p className="mt-1 text-sm text-muted">{scholar.period} · {scholar.places}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">{scholar.specialties.join(" · ")}</p>
                    </div>
                    <StatusBadge status={scholar.status} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
