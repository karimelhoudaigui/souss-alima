"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { ImagePlus, Lock, LogOut, UploadCloud } from "lucide-react";
import { themes } from "@/content/data";
import { mediaBucket, supabaseBrowser } from "@/lib/supabase-browser";

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
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function listValue(formData: FormData, key: string) {
  return value(formData, key).split(";").map((item) => item.trim()).filter(Boolean);
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function uniqueSlug(title: string) {
  const base = slugify(title) || "contenu";
  return `${base}-${Date.now().toString(36)}`;
}

function pathFor(type: ActiveContent, slug: string) {
  if (type === "madrassa") return `/madrassas/${slug}`;
  if (type === "scholar") return `/savants/${slug}`;
  return `/articles/lecture?slug=${slug}`;
}

function fileExt(file: File) {
  return file.name.split(".").pop()?.toLowerCase() || "jpg";
}

async function uploadPrimaryImage(files: FileList | null, type: ActiveContent, slug: string) {
  const file = files?.[0];
  if (!file) return "";
  if (!allowedImageTypes.includes(file.type)) throw new Error("Format image non accepte. Utilise JPG, PNG, WebP ou GIF.");

  const storagePath = `${type}s/${slug}/cover.${fileExt(file)}`;
  const { error } = await supabaseBrowser.storage.from(mediaBucket).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type
  });

  if (error) throw new Error(error.message);
  return supabaseBrowser.storage.from(mediaBucket).getPublicUrl(storagePath).data.publicUrl;
}

export function ModeratorForms({ totals, recentMadrassas, recentArticles, recentScholars }: ModeratorFormsProps) {
  const [active, setActive] = useState<ActiveContent>("madrassa");
  const [state, setState] = useState<SubmitState>(initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMessage, setAuthMessage] = useState("Connexion requise.");

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      const currentEmail = data.session?.user.email ?? null;
      setSessionEmail(currentEmail);
      if (currentEmail) void checkAdmin(currentEmail);
    });

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      const currentEmail = session?.user.email ?? null;
      setSessionEmail(currentEmail);
      if (currentEmail) void checkAdmin(currentEmail);
      else {
        setIsAdmin(false);
        setAuthMessage("Connexion requise.");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function checkAdmin(currentEmail: string) {
    const { data, error } = await supabaseBrowser.from("admin_emails").select("email").ilike("email", currentEmail).maybeSingle();
    setIsAdmin(Boolean(data && !error));
    setAuthMessage(data && !error ? "Acces administrateur confirme." : "Compte connecte, mais non autorise pour l'administration.");
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage("Connexion en cours...");
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setAuthMessage(error ? error.message : "Connexion reussie.");
  }

  async function signUp() {
    setAuthMessage("Creation du compte...");
    const { error } = await supabaseBrowser.auth.signUp({ email, password });
    setAuthMessage(error ? error.message : "Compte cree. Verifie l'email si Supabase demande une confirmation.");
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
  }

  const activeRecent = active === "madrassa" ? recentMadrassas : active === "article" ? recentArticles : recentScholars;

  return (
    <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
      <aside className="space-y-6">
        <section className="rounded-[18px] border border-line bg-surface p-4">
          <p className="metadata-label">Acces prive</p>
          {sessionEmail ? (
            <div className="mt-4">
              <p className="text-sm font-medium text-ink">{sessionEmail}</p>
              <p className={`mt-2 text-xs leading-5 ${isAdmin ? "text-muted" : "text-red-600"}`}>{authMessage}</p>
              <button className="mt-4 flex items-center gap-2 rounded-[12px] border border-line px-3 py-2 text-sm text-muted hover:bg-subtle" onClick={signOut} type="button">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Deconnexion
              </button>
            </div>
          ) : (
            <form className="mt-4 grid gap-3" onSubmit={signIn}>
              <Field label="Email administrateur" name="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
              <Field label="Mot de passe" name="password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
              <button className="button-primary w-full" type="submit">Se connecter</button>
              <button className="rounded-[12px] border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-subtle" onClick={signUp} type="button">
                Creer le compte admin
              </button>
              <p className="text-xs leading-5 text-muted">{authMessage}</p>
            </form>
          )}
        </section>

        <section className="rounded-[18px] border border-line bg-surface p-4">
          <p className="metadata-label">Publier</p>
          <div className="mt-4 grid gap-2">
            <TabButton active={active === "madrassa"} count={totals.madrassas} onClick={() => setActive("madrassa")}>Madrassa</TabButton>
            <TabButton active={active === "article"} count={totals.articles} onClick={() => setActive("article")}>Article</TabButton>
            <TabButton active={active === "scholar"} count={totals.scholars} onClick={() => setActive("scholar")}>Savant</TabButton>
          </div>
        </section>
      </aside>

      <section className="min-w-0 rounded-[20px] border border-line bg-surface">
        <div className="border-b border-line px-5 py-4 md:px-6">
          <p className="metadata-label">Administration</p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">
            {active === "madrassa" ? "Publier une madrassa" : active === "article" ? "Publier un article" : "Publier un savant"}
          </h2>
        </div>
        <div className="p-5 md:p-6">
          {!isAdmin ? (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-[16px] border border-dashed border-line bg-subtle p-8 text-center">
              <Lock className="h-8 w-8 text-faint" aria-hidden="true" />
              <p className="mt-4 text-base font-medium text-ink">Interface reservee aux administrateurs.</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">Connecte-toi avec l'email autorise pour afficher les formulaires de publication.</p>
            </div>
          ) : active === "madrassa" ? (
            <MadrassaForm state={state} onState={setState} />
          ) : active === "article" ? (
            <ArticleForm state={state} onState={setState} />
          ) : (
            <ScholarForm state={state} onState={setState} />
          )}
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[18px] border border-line bg-surface p-4">
          <p className="metadata-label">Images</p>
          <div className="mt-4 flex items-start gap-3">
            <ImagePlus className="mt-0.5 h-5 w-5 text-brand" aria-hidden="true" />
            <p className="text-sm leading-6 text-muted">Ajoute une photo principale au moment de publier. Elle est stockee dans Supabase Storage et reutilisee par la page publique.</p>
          </div>
        </section>
        <RecentPanel title="Dernieres publications" items={activeRecent} />
      </aside>
    </div>
  );
}

function MadrassaForm({ onState, state }: { onState: (state: SubmitState) => void; state: SubmitState }) {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = value(formData, "name");
    const slug = uniqueSlug(name);
    onState({ status: "loading", message: "Publication en cours..." });

    try {
      const uploadedImage = await uploadPrimaryImage(form.imageFile.files, "madrassa", slug);
      const image = uploadedImage || value(formData, "image") || null;
      const { error } = await supabaseBrowser.from("madrassas").insert({
        slug,
        name,
        name_ar: value(formData, "nameAr") || null,
        village: value(formData, "village") || null,
        commune: value(formData, "commune"),
        province: value(formData, "province"),
        lat: Number(value(formData, "lat")),
        lng: Number(value(formData, "lng")),
        specialties: listValue(formData, "specialties"),
        history: value(formData, "history"),
        current_status: value(formData, "currentStatus") || null,
        contact: value(formData, "contact") || null,
        scholars: listValue(formData, "scholars"),
        sources: listValue(formData, "sources"),
        image,
        image_credit: value(formData, "imageCredit") || null,
        status: value(formData, "status") || "to_verify",
        featured: false
      });
      if (error) throw new Error(error.message);
      form.reset();
      onState({ status: "success", message: "Madrassa publiee dans Supabase.", href: pathFor("madrassa", slug) });
    } catch (error) {
      onState({ status: "error", message: error instanceof Error ? error.message : "Publication impossible." });
    }
  }

  return (
    <form className="grid gap-8" onSubmit={onSubmit}>
      <FormSection title="Identite">
        <Field label="Nom francais / translittere" name="name" required />
        <Field label="Nom arabe" name="nameAr" />
      </FormSection>
      <FormSection title="Localisation">
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
      <FormSection title="Contenu et media">
        <Field label="Enseignements, separes par ;" name="specialties" />
        <TextArea label="Presentation historique sourcee" name="history" required />
        <Field label="Sources, separees par ;" name="sources" />
        <Field label="Slugs des savants lies, separes par ;" name="scholars" />
        <ImageField />
        <Field label="URL image existante" name="image" placeholder="Optionnel si une photo est envoyee" />
        <Field label="Credit image" name="imageCredit" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Statut actuel" name="currentStatus" />
          <Field label="Contact public" name="contact" />
        </div>
        <StatusSelect />
      </FormSection>
      <FormActions loading={state.status === "loading"} state={state} submitLabel="Publier la madrassa" />
    </form>
  );
}

function ArticleForm({ onState, state }: { onState: (state: SubmitState) => void; state: SubmitState }) {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = value(formData, "title");
    const slug = uniqueSlug(title);
    onState({ status: "loading", message: "Publication en cours..." });

    try {
      const uploadedImage = await uploadPrimaryImage(form.imageFile.files, "article", slug);
      const { error } = await supabaseBrowser.from("articles").insert({
        slug,
        title,
        title_ar: value(formData, "titleAr") || null,
        theme: value(formData, "theme") || "recherche-etudes",
        author: value(formData, "author") || "Equipe editoriale",
        published_at: value(formData, "publishedAt") || new Date().toISOString().slice(0, 10),
        reading_time: Number(value(formData, "readingTime").match(/\d+/)?.[0] ?? 5),
        excerpt: value(formData, "summary"),
        content: value(formData, "body"),
        sources: listValue(formData, "sources"),
        tags: listValue(formData, "tags"),
        scholar_slugs: listValue(formData, "scholarSlugs"),
        madrassa_slugs: listValue(formData, "madrassaSlugs"),
        image: uploadedImage || value(formData, "image") || null,
        image_credit: value(formData, "imageCredit") || null,
        status: value(formData, "status") || "to_verify"
      });
      if (error) throw new Error(error.message);
      form.reset();
      onState({ status: "success", message: "Article publie dans Supabase.", href: pathFor("article", slug) });
    } catch (error) {
      onState({ status: "error", message: error instanceof Error ? error.message : "Publication impossible." });
    }
  }

  return (
    <form className="grid gap-8" onSubmit={onSubmit}>
      <FormSection title="Publication">
        <Field label="Titre francais" name="title" required />
        <Field label="Titre arabe" name="titleAr" />
        <label className="block">
          <span className="text-sm font-medium text-ink">Theme</span>
          <select className="input mt-2" defaultValue="qiraat" name="theme">
            {themes.map((theme) => <option key={theme.slug} value={theme.slug}>{theme.label}</option>)}
          </select>
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Auteur" name="author" />
          <Field label="Date" name="publishedAt" type="date" />
          <Field label="Temps de lecture" name="readingTime" placeholder="8 min" />
        </div>
      </FormSection>
      <FormSection title="Contenu et media">
        <TextArea label="Resume court" name="summary" required />
        <TextArea label="Contenu de l'article" name="body" required />
        <Field label="Sources, separees par ;" name="sources" />
        <Field label="Tags, separes par ;" name="tags" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slugs des savants lies" name="scholarSlugs" />
          <Field label="Slugs des madrassas liees" name="madrassaSlugs" />
        </div>
        <ImageField />
        <Field label="URL image existante" name="image" />
        <Field label="Credit image" name="imageCredit" />
        <StatusSelect />
      </FormSection>
      <FormActions loading={state.status === "loading"} state={state} submitLabel="Publier l'article" />
    </form>
  );
}

function ScholarForm({ onState, state }: { onState: (state: SubmitState) => void; state: SubmitState }) {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = value(formData, "nameFr");
    const slug = uniqueSlug(name);
    onState({ status: "loading", message: "Publication en cours..." });

    try {
      const uploadedImage = await uploadPrimaryImage(form.imageFile.files, "scholar", slug);
      const { error } = await supabaseBrowser.from("scholars").insert({
        slug,
        name,
        arabic_name: value(formData, "nameAr") || null,
        nisba: value(formData, "nisba") || null,
        period: value(formData, "period") || null,
        places: value(formData, "places") || null,
        specialties: listValue(formData, "specialties"),
        madrassa_slugs: listValue(formData, "madrassas"),
        teachers: listValue(formData, "teachers"),
        students: listValue(formData, "students"),
        works: listValue(formData, "works"),
        biography: value(formData, "biography"),
        sources: listValue(formData, "sources"),
        image: uploadedImage || value(formData, "image") || null,
        image_credit: value(formData, "imageCredit") || null,
        status: value(formData, "status") || "to_verify",
        featured: false
      });
      if (error) throw new Error(error.message);
      form.reset();
      onState({ status: "success", message: "Savant publie dans Supabase.", href: pathFor("scholar", slug) });
    } catch (error) {
      onState({ status: "error", message: error instanceof Error ? error.message : "Publication impossible." });
    }
  }

  return (
    <form className="grid gap-8" onSubmit={onSubmit}>
      <FormSection title="Identite">
        <Field label="Nom francais / translittere" name="nameFr" required />
        <Field label="Nom arabe" name="nameAr" />
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Nisba / nom complet" name="nisba" />
          <Field label="Periode" name="period" />
          <Field label="Lieux" name="places" />
        </div>
      </FormSection>
      <FormSection title="Transmission et media">
        <Field label="Specialites, separees par ;" name="specialties" />
        <Field label="Slugs des madrassas liees, separes par ;" name="madrassas" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Maitres, separes par ;" name="teachers" />
          <Field label="Eleves, separes par ;" name="students" />
        </div>
        <TextArea label="Biographie" name="biography" required />
        <Field label="Oeuvres, separees par ;" name="works" />
        <Field label="Sources, separees par ;" name="sources" />
        <ImageField label="Portrait principal" />
        <Field label="URL portrait existante" name="image" />
        <Field label="Credit portrait" name="imageCredit" />
        <StatusSelect />
      </FormSection>
      <FormActions loading={state.status === "loading"} state={state} submitLabel="Publier le savant" />
    </form>
  );
}

function ImageField({ label = "Photo principale" }: { label?: string }) {
  const [fileName, setFileName] = useState("");

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setFileName(event.target.files?.[0]?.name ?? "");
  }

  return (
    <label className="block rounded-[16px] border border-dashed border-line bg-subtle p-4">
      <span className="flex items-center gap-2 text-sm font-medium text-ink">
        <UploadCloud className="h-4 w-4 text-brand" aria-hidden="true" />
        {label}
      </span>
      <input className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-[10px] file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-medium file:text-white" name="imageFile" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onChange} type="file" />
      {fileName ? <span className="mt-2 block text-xs text-muted">{fileName}</span> : null}
    </label>
  );
}

function FormSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="grid gap-4 border-b border-line pb-8 last:border-b-0 last:pb-0 lg:grid-cols-[190px_1fr]">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
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

function TabButton({ active, children, count, onClick }: { active: boolean; children: ReactNode; count: number; onClick: () => void }) {
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
