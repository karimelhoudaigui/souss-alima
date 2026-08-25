import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MetadataItem } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { getAllMadrassas, getAllScholars } from "@/content/store";
import { publicAsset } from "@/lib/assets";

export const dynamicParams = false;

export async function generateStaticParams() {
  const scholars = await getAllScholars();
  return scholars.map((scholar) => ({ slug: scholar.slug }));
}

export default async function ScholarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scholars = await getAllScholars();
  const scholar = scholars.find((item) => item.slug === slug);
  if (!scholar) notFound();

  const madrassas = await getAllMadrassas();
  const linkedMadrassas = madrassas.filter((madrassa) => scholar.madrassas.includes(madrassa.slug));

  return (
    <article>
      <header className="container-page border-b border-line py-8 md:py-12">
        <Link className="ui-sans text-sm font-medium text-muted hover:text-ink" href="/savants">← Tous les savants</Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <p className="arabic-title" dir="rtl" lang="ar">{scholar.nameAr}</p>
            <h1 className="mt-3 break-words text-[clamp(2.15rem,11vw,3rem)] font-medium text-ink md:text-6xl">{scholar.nameFr}</h1>
            <p className="ui-sans mt-4 text-base text-muted">{scholar.nisba}</p>
            <div className="mt-5">
              <StatusBadge status={scholar.status} />
            </div>
          </div>
          <dl className="grid gap-5 border-t border-line pt-5 sm:grid-cols-2 lg:border-t-0 lg:pt-0">
            <MetadataItem label="Periode" value={scholar.period} />
            <MetadataItem label="Region" value={scholar.places} />
            <MetadataItem label="Portrait" value={scholar.image ? "Renseigne" : "Non renseigne"} />
            <MetadataItem label="Sources" value={`${scholar.sources.length} entree`} />
          </dl>
        </div>
      </header>

      {scholar.image ? (
        <div className="container-page pb-10">
          <figure className="mx-auto max-w-3xl border-b border-line bg-subtle">
            <Image alt="" className="h-auto max-h-[760px] w-full object-contain" height={1600} priority sizes="(max-width: 768px) 100vw, 768px" src={publicAsset(scholar.image) ?? ""} unoptimized width={1200} />
            {scholar.imageCredit ? <figcaption className="border-t border-line px-4 py-3 text-xs text-muted">{scholar.imageCredit}</figcaption> : null}
          </figure>
        </div>
      ) : null}

      <div className="container-page grid gap-10 pb-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="max-w-3xl">
          <section className="border-b border-line pb-9">
            <h2 className="section-title">Biographie</h2>
            <div className="body-copy mt-4 whitespace-pre-line">{scholar.biography}</div>
          </section>

          <section className="border-b border-line py-9">
            <h2 className="section-title">Formation et transmission</h2>
            <div className="mt-6 grid gap-0 border-y border-line md:grid-cols-2">
              <div>
                <h3 className="metadata-label py-3">Maitres</h3>
                <ul className="divide-y divide-line text-sm text-muted">
                  {scholar.teachers.map((item) => <li className="py-3" key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="md:border-l md:border-line md:pl-6">
                <h3 className="metadata-label py-3">Eleves</h3>
                <ul className="divide-y divide-line text-sm text-muted">
                  {scholar.students.map((item) => <li className="py-3" key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <p className="caption mt-5">La representation des filiations sera reliee progressivement aux fiches verifiees.</p>
          </section>

          <section className="border-b border-line py-9">
            <h2 className="section-title">Madrassas liees</h2>
            <div className="mt-4 grid gap-3 border-y border-line py-4">
              {linkedMadrassas.map((madrassa) => (
                <Link className="grid gap-1 md:grid-cols-[150px_1fr]" href={`/madrassas/${madrassa.slug}`} key={madrassa.slug}>
                  <span className="metadata-label">A etudie / enseigne</span>
                  <span className="text-sm font-medium text-ink hover:text-brand">{madrassa.name}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="border-b border-line py-9">
            <h2 className="section-title">Oeuvres</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {scholar.works.map((work) => <li className="grid gap-2 py-4 text-sm text-muted md:grid-cols-[72px_1fr]" key={work}><span className="metadata-label">Oeuvre</span><span>{work}</span></li>)}
            </ul>
          </section>

          <section className="pt-9">
            <h2 className="section-title">Sources</h2>
            <div className="mt-5 divide-y divide-line border-y border-line">
              {scholar.sources.map((source, index) => (
                <div className="grid gap-3 py-5 md:grid-cols-[72px_1fr]" key={source}>
                  <span className="metadata-label">SRC {String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-6 text-muted">{source}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="h-fit border-t border-line pt-6 lg:sticky lg:top-24 lg:border-t-0 lg:pt-0">
          <dl className="grid gap-6 lg:border-l lg:border-line lg:pl-5">
            <MetadataItem label="Specialites" value={scholar.specialties.join(" · ")} />
            <MetadataItem label="Lieux" value={scholar.places} />
            <MetadataItem label="Verification" value={<StatusBadge status={scholar.status} />} />
          </dl>
        </aside>
      </div>
    </article>
  );
}
