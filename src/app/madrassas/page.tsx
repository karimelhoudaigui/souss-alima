import Link from "next/link";
import Image from "next/image";
import { MadrassaMap } from "@/components/madrassa-map";
import { FilterChip } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { getAllMadrassas } from "@/content/store";

export default async function MadrassasPage() {
  const madrassas = await getAllMadrassas();
  const mapMadrassas = madrassas.map((madrassa) => ({
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
    image: madrassa.image
  }));

  return (
    <div className="container-page py-8">
      <header className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="page-kicker">Explorer</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.025em] text-ink md:text-6xl">Madrassas</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Rechercher, comparer et localiser les etablissements documentes sur la carte.
          </p>
        </div>
        <form className="lg:justify-self-end lg:w-full lg:max-w-2xl" role="search">
          <label className="sr-only" htmlFor="madrassa-search">Rechercher une madrassa</label>
          <input className="input min-h-12" id="madrassa-search" placeholder="Rechercher une madrassa, ville ou region" />
        </form>
      </header>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["Qur'an", "Qiraat", "Hebergement", "Adultes", "Region", "Plus"].map((filter) => (
          <FilterChip key={filter}>{filter}</FilterChip>
        ))}
      </div>

      <div className="mt-6 grid min-h-[680px] gap-6 lg:grid-cols-[minmax(360px,0.78fr)_1.22fr]">
        <section className="order-2 lg:order-1">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted">{madrassas.length} etablissements</p>
            <div className="flex rounded-[12px] border border-line bg-surface p-1 text-sm">
              <button className="rounded-[9px] bg-subtle px-3 py-1.5 text-ink" type="button">Liste</button>
              <button className="px-3 py-1.5 text-muted" type="button">Carte</button>
            </div>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {madrassas.map((madrassa) => (
              <Link className="entity-row" href={`/madrassas/${madrassa.slug}`} key={madrassa.slug}>
                <div className="grid gap-4 sm:grid-cols-[112px_1fr]">
                  {madrassa.image ? (
                    <Image alt="" className="h-24 w-full rounded-[12px] object-cover sm:w-28" height={192} sizes="(max-width: 640px) 100vw, 112px" src={madrassa.image} unoptimized width={224} />
                  ) : null}
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-medium text-ink">{madrassa.name}</p>
                        <p className="mt-1 text-sm text-muted">{madrassa.village} · {madrassa.province}</p>
                      </div>
                      <StatusBadge status={madrassa.status} />
                    </div>
                    <p className="mt-3 text-sm text-muted">{madrassa.specialties.join(" · ")}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="order-1 lg:sticky lg:top-24 lg:order-2 lg:h-[min(720px,calc(100vh-7rem))]">
          <MadrassaMap className="h-[560px] lg:h-full" madrassas={mapMadrassas} />
        </section>
      </div>
    </div>
  );
}
