import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { MetadataItem } from "@/components/ui";
import { getAllMadrassas, getAllScholars } from "@/content/store";
import { publicAsset } from "@/lib/assets";

export const dynamicParams = false;

export async function generateStaticParams() {
  const madrassas = await getAllMadrassas();
  return madrassas.map((madrassa) => ({ slug: madrassa.slug }));
}

export default async function MadrassaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const madrassas = await getAllMadrassas();
  const madrassa = madrassas.find((item) => item.slug === slug);
  if (!madrassa) notFound();
  const scholars = await getAllScholars();
  const linkedScholars = scholars.filter((scholar) => madrassa.scholars.includes(scholar.slug));
  const sources = madrassa.sources?.length ? madrassa.sources : [];

  return (
    <article>
      <header className="container-page border-b border-line py-8 md:py-12">
        <Link className="ui-sans text-sm font-medium text-muted hover:text-ink" href="/madrassas">← Toutes les madrassas</Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="arabic-title" dir="rtl" lang="ar">{madrassa.nameAr}</p>
            <h1 className="mt-3 break-words text-[clamp(2.15rem,11vw,3rem)] font-medium text-ink md:text-6xl">{madrassa.name}</h1>
            <p className="ui-sans mt-4 text-base text-muted">{madrassa.commune} · Province de {madrassa.province}</p>
            <div className="mt-5">
              <StatusBadge status={madrassa.status} />
            </div>
          </div>
          <dl className="grid gap-5 border-t border-line pt-5 sm:grid-cols-2 lg:border-t-0 lg:pt-0">
            <MetadataItem label="Localisation" value={`${madrassa.village}, ${madrassa.commune}`} />
            <MetadataItem label="Statut" value={madrassa.currentStatus} />
            <MetadataItem label="Contact" value={<LinkedText value={madrassa.contact} />} />
            <MetadataItem label="Coordonnees" value={`${madrassa.lat}, ${madrassa.lng}`} />
          </dl>
        </div>
      </header>

      <div className="container-page">
        {madrassa.image ? (
          <figure className="border-b border-line bg-subtle">
            <Image alt="" className="h-auto max-h-[680px] w-full object-contain" height={1125} priority sizes="(max-width: 768px) 100vw, 1200px" src={publicAsset(madrassa.image) ?? ""} unoptimized width={1800} />
            {madrassa.imageCredit ? <figcaption className="border-t border-line px-4 py-3 text-xs text-muted">{madrassa.imageCredit}</figcaption> : null}
          </figure>
        ) : (
          <div className="h-[280px] border border-line bg-subtle md:h-[420px]">
            <div className="flex h-full items-center justify-center text-sm text-muted">Image a renseigner lorsqu'une source fiable est disponible</div>
          </div>
        )}
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <main className="max-w-3xl">
          <section className="border-b border-line pb-9">
            <h2 className="section-title">Presentation</h2>
            <p className="body-copy mt-4">{madrassa.history}</p>
          </section>

          <section className="border-b border-line py-9">
            <h2 className="section-title">Enseignement</h2>
            <div className="ui-sans mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {madrassa.specialties.map((specialty) => (
                <span className="border-b border-line pb-1" key={specialty}>{specialty}</span>
              ))}
            </div>
          </section>

          <section className="border-b border-line py-9">
            <h2 className="section-title">Personnes liees</h2>
            <div className="mt-4 grid gap-3 border-y border-line py-4">
              {linkedScholars.length ? linkedScholars.map((scholar) => (
                <Link className="grid gap-1 md:grid-cols-[150px_1fr]" href={`/savants/${scholar.slug}`} key={scholar.slug}>
                  <span className="metadata-label">Personne liee</span>
                  <span className="text-sm font-medium text-ink hover:text-brand">{scholar.nameFr}</span>
                </Link>
              )) : <p className="body-copy">A renseigner apres verification.</p>}
            </div>
          </section>

          <section className="pt-9">
            <h2 className="section-title">Sources</h2>
            <div className="mt-5 divide-y divide-line border-y border-line">
              {sources.length ? sources.map((source, index) => (
                <div className="grid gap-3 py-5 md:grid-cols-[72px_1fr]" key={source}>
                  <span className="metadata-label">SRC {String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-6 text-muted"><LinkedText value={source} /></p>
                </div>
              )) : (
                <div className="grid gap-3 py-5 md:grid-cols-[72px_1fr]">
                  <span className="metadata-label">SRC 01</span>
                  <div>
                    <p className="text-sm font-medium text-ink">Source non renseignee</p>
                    <p className="mt-1 text-sm leading-6 text-muted">Cette fiche doit etre completee avec des references avant validation editoriale.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="h-fit border-t border-line pt-6 lg:sticky lg:top-24 lg:border-t-0 lg:pt-0">
          <dl className="grid gap-6 lg:border-l lg:border-line lg:pl-5">
            <MetadataItem label="Province" value={madrassa.province} />
            <MetadataItem label="Commune" value={madrassa.commune} />
            <MetadataItem label="Village" value={madrassa.village} />
            <MetadataItem label="Verification" value={<StatusBadge status={madrassa.status} />} />
          </dl>
        </aside>
      </div>
    </article>
  );
}

function LinkedText({ value }: { value: string }) {
  const parts = value.split(/(https?:\/\/\S+)/g);

  return (
    <>
      {parts.map((part) => {
        if (!part.startsWith("http")) return part;
        const href = part.replace(/[),.;]+$/, "");
        const suffix = part.slice(href.length);

        return (
          <span key={part}>
            <a className="font-medium text-brand hover:text-brand-hover" href={href} rel="noreferrer" target="_blank">
              {href.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
            {suffix}
          </span>
        );
      })}
    </>
  );
}
