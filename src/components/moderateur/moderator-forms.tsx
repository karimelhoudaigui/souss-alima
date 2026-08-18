"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { themes } from "@/content/data";

type SubmitState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  href?: string;
};

type RecentItem = {
  name: string;
  href: string;
  meta: string;
};

type ModeratorFormsProps = {
  totals: {
    madrassas: number;
    articles: number;
    scholars: number;
  };
  recentMadrassas: RecentItem[];
  recentArticles: RecentItem[];
  recentScholars: RecentItem[];
};

type ActiveContent = "madrassa" | "article" | "scholar";

const initialState: SubmitState = { status: "idle", message: "" };

const workflow = [
  ["1", "Identifier", "Relever le sujet, les lieux/personnes cites et les sources."],
  ["2", "Structurer", "Saisir uniquement les donnees verifiables."],
  ["3", "Publier", "Le contenu devient visible immediatement."],
  ["4", "Relier", "Connecter ensuite l'article aux madrassas, savants, oeuvres et sources."]
];

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function submitJson(endpoint: string, payload: Record<string, unknown>, moderatorKey: string) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-moderator-key": moderatorKey },
    body: JSON.stringify(payload)
  });
  const data = await response.json() as { error?: string; madrassa?: { slug: string }; article?: { slug: string }; scholar?: { slug: string } };

  if (!response.ok) throw new Error(data.error ?? "Publication impossible.");
  return data;
}

export function ModeratorForms({ totals, recentMadrassas, recentArticles, recentScholars }: ModeratorFormsProps) {
  const [active, setActive] = useState<ActiveContent>("madrassa");
  const [madrassaState, setMadrassaState] = useState<SubmitState>(initialState);
  const [articleState, setArticleState] = useState<SubmitState>(initialState);
  const [scholarState, setScholarState] = useState<SubmitState>(initialState);
  const [moderatorKey, setModeratorKey] = useState("");

  const activeHelp = useMemo(() => {
    if (active === "madrassa") {
      return {
        title: "Publication madrassa",
        items: ["Ajout dans /madrassas", "Marqueur sur la carte", "Fiche publique", "Presence dans la homepage"]
      };
    }

    if (active === "article") return {
      title: "Publication article",
      items: ["Ajout dans /articles", "Fiche article publique", "Classement par theme", "Relations possibles vers savants et madrassas"]
    };

    return {
      title: "Publication savant",
      items: ["Ajout dans /savants", "Fiche biographique", "Relations vers madrassas", "Portrait et sources"]
    };
  }, [active]);

  async function onMadrassaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setMadrassaState({ status: "loading", message: "Publication en cours..." });

    try {
      const data = await submitJson("/api/moderateur/madrassas", {
        name: value(formData, "name"),
        nameAr: value(formData, "nameAr"),
        village: value(formData, "village"),
        commune: value(formData, "commune"),
        province: value(formData, "province"),
        lat: value(formData, "lat"),
        lng: value(formData, "lng"),
        specialties: value(formData, "specialties"),
        history: value(formData, "history"),
        currentStatus: value(formData, "currentStatus"),
        contact: value(formData, "contact"),
        sources: value(formData, "sources"),
        scholars: value(formData, "scholars"),
        image: value(formData, "image"),
        imageCredit: value(formData, "imageCredit"),
        status: value(formData, "status")
      }, moderatorKey);

      form.reset();
      setMadrassaState({ status: "success", message: "Madrassa publiee.", href: `/madrassas/${data.madrassa?.slug}` });
    } catch (error) {
      setMadrassaState({ status: "error", message: error instanceof Error ? error.message : "Erreur inconnue." });
    }
  }

  async function onArticleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setArticleState({ status: "loading", message: "Publication en cours..." });

    try {
      const data = await submitJson("/api/moderateur/articles", {
        title: value(formData, "title"),
        titleAr: value(formData, "titleAr"),
        theme: value(formData, "theme"),
        author: value(formData, "author"),
        publishedAt: value(formData, "publishedAt"),
        readingTime: value(formData, "readingTime"),
        summary: value(formData, "summary"),
        body: value(formData, "body"),
        sources: value(formData, "sources"),
        tags: value(formData, "tags"),
        scholarSlugs: value(formData, "scholarSlugs"),
        madrassaSlugs: value(formData, "madrassaSlugs"),
        image: value(formData, "image"),
        imageCredit: value(formData, "imageCredit"),
        status: value(formData, "status")
      }, moderatorKey);

      form.reset();
      setArticleState({ status: "success", message: "Article publie.", href: `/articles/${data.article?.slug}` });
    } catch (error) {
      setArticleState({ status: "error", message: error instanceof Error ? error.message : "Erreur inconnue." });
    }
  }

  async function onScholarSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setScholarState({ status: "loading", message: "Publication en cours..." });

    try {
      const data = await submitJson("/api/moderateur/savants", {
        nameFr: value(formData, "nameFr"),
        nameAr: value(formData, "nameAr"),
        nisba: value(formData, "nisba"),
        period: value(formData, "period"),
        places: value(formData, "places"),
        specialties: value(formData, "specialties"),
        madrassas: value(formData, "madrassas"),
        teachers: value(formData, "teachers"),
        students: value(formData, "students"),
        works: value(formData, "works"),
        biography: value(formData, "biography"),
        sources: value(formData, "sources"),
        image: value(formData, "image"),
        imageCredit: value(formData, "imageCredit"),
        status: value(formData, "status")
      }, moderatorKey);

      form.reset();
      setScholarState({ status: "success", message: "Savant publie.", href: `/savants/${data.scholar?.slug}` });
    } catch (error) {
      setScholarState({ status: "error", message: error instanceof Error ? error.message : "Erreur inconnue." });
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="space-y-6">
        <section className="rounded-[18px] border border-line bg-surface p-4">
          <p className="metadata-label">Publication</p>
          <div className="mt-4 grid gap-2">
            <TabButton active={active === "madrassa"} count={totals.madrassas} onClick={() => setActive("madrassa")}>
              Madrassa
            </TabButton>
            <TabButton active={active === "article"} count={totals.articles} onClick={() => setActive("article")}>
              Article
            </TabButton>
            <TabButton active={active === "scholar"} count={totals.scholars} onClick={() => setActive("scholar")}>
              Savant
            </TabButton>
          </div>
        </section>

        <section className="rounded-[18px] border border-line bg-surface p-4">
          <p className="metadata-label">Acces</p>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-ink">Code moderateur</span>
            <input className="input mt-2" onChange={(event) => setModeratorKey(event.target.value)} placeholder="MODERATOR_KEY" type="password" value={moderatorKey} />
          </label>
          <p className="mt-3 text-xs leading-5 text-muted">En production, ce code doit etre configure et obligatoire.</p>
        </section>
      </aside>

      <section className="min-w-0 rounded-[20px] border border-line bg-surface">
        <div className="border-b border-line px-5 py-4 md:px-6">
          <p className="metadata-label">{active === "madrassa" ? "Nouvelle entree cartographique" : active === "article" ? "Nouvelle publication editoriale" : "Nouvelle fiche biographique"}</p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">{active === "madrassa" ? "Publier une madrassa" : active === "article" ? "Publier un article" : "Publier un savant"}</h2>
        </div>

        <div className="p-5 md:p-6">
          {active === "madrassa" ? <MadrassaForm onSubmit={onMadrassaSubmit} state={madrassaState} /> : active === "article" ? <ArticleForm onSubmit={onArticleSubmit} state={articleState} /> : <ScholarForm onSubmit={onScholarSubmit} state={scholarState} />}
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[18px] border border-line bg-surface p-4">
          <p className="metadata-label">Workflow</p>
          <div className="mt-4 space-y-4">
            {workflow.map(([number, title, text]) => (
              <div className="grid grid-cols-[28px_1fr] gap-3" key={number}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-subtle text-xs font-medium text-muted">{number}</span>
                <div>
                  <p className="text-sm font-medium text-ink">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[18px] border border-line bg-surface p-4">
          <p className="metadata-label">{activeHelp.title}</p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
            {activeHelp.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <RecentPanel title={active === "madrassa" ? "Dernieres madrassas" : active === "article" ? "Derniers articles" : "Derniers savants"} items={active === "madrassa" ? recentMadrassas : active === "article" ? recentArticles : recentScholars} />
      </aside>
    </div>
  );
}

function MadrassaForm({ onSubmit, state }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; state: SubmitState }) {
  return (
    <form className="grid gap-8" onSubmit={onSubmit}>
      <FormSection description="Ce bloc identifie la madrassa dans les listes et dans la fiche publique." title="Identite">
        <Field label="Nom francais / translittere" name="name" required />
        <Field label="Nom arabe" name="nameAr" />
      </FormSection>

      <FormSection description="Ces champs alimentent la carte. Les coordonnees doivent etre verifiees." title="Localisation">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Village / quartier" name="village" />
          <Field label="Commune" name="commune" required />
          <Field label="Province" name="province" required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Latitude" name="lat" required step="any" type="number" />
          <Field label="Longitude" name="lng" required step="any" type="number" />
        </div>
      </FormSection>

      <FormSection description="Ces champs restent descriptifs. Les articles servent maintenant a traiter les grands sujets editoriaux." title="Contenu">
        <Field label="Enseignements / specialites, separes par ;" name="specialties" placeholder="qiraat; fiqh; rasm" />
        <TextArea label="Resume historique source" name="history" required />
        <Field label="Sources, separees par ;" name="sources" />
        <Field label="Slugs des savants lies, separes par ;" name="scholars" placeholder="sidi-mohammed-nazir" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Statut actuel" name="currentStatus" placeholder="Active, historique, a verifier..." />
          <Field label="Contact public" name="contact" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Image" name="image" placeholder="/images/madrassas/nom.png ou https://..." />
          <Field label="Credit image" name="imageCredit" />
        </div>
        <StatusSelect />
      </FormSection>

      <FormActions loading={state.status === "loading"} submitLabel="Publier la madrassa" state={state} />
    </form>
  );
}

function ArticleForm({ onSubmit, state }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; state: SubmitState }) {
  return (
    <form className="grid gap-8" onSubmit={onSubmit}>
      <FormSection description="Un article est une publication editoriale, classee par theme." title="Publication">
        <Field label="Titre francais" name="title" required />
        <Field label="Titre arabe" name="titleAr" />
        <label className="block">
          <span className="text-sm font-medium text-ink">Theme</span>
          <select className="input mt-2" defaultValue="qiraat" name="theme">
            {themes.map((theme) => <option key={theme.slug} value={theme.slug}>{theme.label}</option>)}
          </select>
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Auteur" name="author" placeholder="Equipe editoriale" />
          <Field label="Date" name="publishedAt" type="date" />
          <Field label="Temps de lecture" name="readingTime" placeholder="8 min" />
        </div>
      </FormSection>

      <FormSection description="Le resume apparait dans les listes. Le contenu compose la page article." title="Contenu">
        <TextArea label="Resume court" name="summary" required />
        <TextArea label="Contenu de l'article" name="body" required />
        <Field label="Sources, separees par ;" name="sources" />
        <Field label="Tags, separes par ;" name="tags" placeholder="Qiraat; Manuscrits; Transmission" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slugs des savants lies" name="scholarSlugs" placeholder="sidi-mohammed-nazir" />
          <Field label="Slugs des madrassas liees" name="madrassaSlugs" placeholder="ecole-traditionnelle-zawiya-assa" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Image" name="image" placeholder="/images/articles/nom.png ou https://..." />
          <Field label="Credit image" name="imageCredit" />
        </div>
        <StatusSelect />
      </FormSection>

      <FormActions loading={state.status === "loading"} submitLabel="Publier l'article" state={state} />
    </form>
  );
}

function ScholarForm({ onSubmit, state }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; state: SubmitState }) {
  return (
    <form className="grid gap-8" onSubmit={onSubmit}>
      <FormSection description="La fiche biographique apparait dans le repertoire des savants." title="Identite">
        <Field label="Nom francais / translittere" name="nameFr" required />
        <Field label="Nom arabe" name="nameAr" />
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Nisba / nom complet" name="nisba" />
          <Field label="Periode" name="period" placeholder="Ne en 1981, XIIIe siecle..." />
          <Field label="Lieux" name="places" placeholder="Souss, Tata, Assa..." />
        </div>
      </FormSection>

      <FormSection description="Ces relations permettent aux fiches de se repondre entre elles." title="Transmission">
        <Field label="Specialites, separees par ;" name="specialties" placeholder="qiraat; fiqh; rasm" />
        <Field label="Slugs des madrassas liees, separes par ;" name="madrassas" placeholder="ecole-traditionnelle-zawiya-assa" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Maitres, separes par ;" name="teachers" />
          <Field label="Eleves, separes par ;" name="students" />
        </div>
      </FormSection>

      <FormSection description="Le texte peut etre long ; les retours a la ligne seront conserves." title="Contenu">
        <TextArea label="Biographie" name="biography" required />
        <Field label="Oeuvres, separees par ;" name="works" />
        <Field label="Sources, separees par ;" name="sources" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Portrait" name="image" placeholder="/images/scholars/nom.png ou https://..." />
          <Field label="Credit portrait" name="imageCredit" />
        </div>
        <StatusSelect />
      </FormSection>

      <FormActions loading={state.status === "loading"} submitLabel="Publier le savant" state={state} />
    </form>
  );
}

function FormSection({ children, description, title }: { children: React.ReactNode; description: string; title: string }) {
  return (
    <section className="grid gap-4 border-b border-line pb-8 last:border-b-0 last:pb-0 lg:grid-cols-[190px_1fr]">
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field({ label, name, ...props }: { label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input className="input mt-2" name={name} {...props} />
    </label>
  );
}

function TextArea({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <textarea className="input mt-2 min-h-32" name={name} required={required} />
    </label>
  );
}

function StatusSelect() {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">Niveau de verification</span>
      <select className="input mt-2" defaultValue="to_verify" name="status">
        <option value="to_verify">A verifier</option>
        <option value="sourced">Source</option>
        <option value="example">Exemple</option>
      </select>
    </label>
  );
}

function FormActions({ loading, state, submitLabel }: { loading: boolean; state: SubmitState; submitLabel: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <button className="button-primary w-fit" disabled={loading} type="submit">{loading ? "Publication..." : submitLabel}</button>
      <SubmitMessage state={state} />
    </div>
  );
}

function SubmitMessage({ state }: { state: SubmitState }) {
  if (state.status === "idle") return null;
  return (
    <p className={`text-sm ${state.status === "error" ? "text-red-600" : "text-muted"}`}>
      {state.message} {state.href ? <Link className="font-medium text-brand hover:text-brand-hover" href={state.href}>Voir la fiche</Link> : null}
    </p>
  );
}

function TabButton({ active, children, count, onClick }: { active: boolean; children: React.ReactNode; count: number; onClick: () => void }) {
  return (
    <button className={`flex items-center justify-between rounded-[12px] px-3 py-2 text-left text-sm transition ${active ? "bg-ink text-white" : "text-muted hover:bg-subtle hover:text-ink"}`} onClick={onClick} type="button">
      <span>{children}</span>
      <span className={active ? "text-white/70" : "text-faint"}>{count}</span>
    </button>
  );
}

function RecentPanel({ items, title }: { items: RecentItem[]; title: string }) {
  return (
    <section className="rounded-[18px] border border-line bg-surface p-4">
      <p className="metadata-label">{title}</p>
      <div className="mt-4 divide-y divide-line">
        {items.length ? items.map((item) => (
          <Link className="block py-3 first:pt-0 last:pb-0" href={item.href} key={item.href}>
            <p className="text-sm font-medium text-ink">{item.name}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{item.meta}</p>
          </Link>
        )) : <p className="text-sm text-muted">Aucun contenu publie.</p>}
      </div>
    </section>
  );
}
