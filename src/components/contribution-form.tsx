"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type SubmitState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function sendEmail(payload: Record<string, string>) {
  const response = await fetch("https://formsubmit.co/ajax/elhoudaiguikarim91@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      _subject: `[Souss savant] Contribution - ${payload.entity || payload.contribution_type}`,
      _template: "table",
      ...payload
    })
  });

  if (!response.ok) throw new Error("La contribution est enregistree, mais l'email n'a pas pu etre envoye.");
}

export function ContributionForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      contributor_name: value(formData, "contributor_name"),
      contributor_email: value(formData, "contributor_email"),
      contribution_type: value(formData, "contribution_type"),
      entity: value(formData, "entity"),
      message: value(formData, "message"),
      source: value(formData, "source"),
      url: value(formData, "url")
    };

    if (!payload.contribution_type || !payload.message) {
      setState({ status: "error", message: "Le type de contribution et le message sont obligatoires." });
      return;
    }

    setState({ status: "loading", message: "Envoi en cours..." });

    try {
      const { error } = await supabaseBrowser.from("contributions").insert(payload);
      if (error) throw new Error(error.message);

      await sendEmail(payload);
      form.reset();
      setState({ status: "success", message: "Merci, la contribution a ete enregistree et envoyee par email." });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "Envoi impossible." });
    }
  }

  return (
    <form className="grid gap-5 border-t border-line pt-6" onSubmit={onSubmit}>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="contribution_type">Type de contribution</label>
        <select className="input mt-2" id="contribution_type" name="contribution_type" defaultValue="" required>
          <option value="">Selectionner</option>
          <option>Madrassa</option>
          <option>Savant</option>
          <option>Source bibliographique</option>
          <option>Article</option>
          <option>Correction</option>
          <option>Information complementaire</option>
          <option>Lien utile</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="entity">Madrassa, savant ou sujet concerne</label>
        <input className="input mt-2" id="entity" name="entity" placeholder="Nom de la fiche, du lieu ou du sujet" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="message">Message</label>
        <textarea className="input mt-2 min-h-36" id="message" name="message" placeholder="Information proposee, correction, contexte" required />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="source">Source ou reference</label>
          <input className="input mt-2" id="source" name="source" placeholder="Ouvrage, article, archive, publication" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="url">URL eventuelle</label>
          <input className="input mt-2" id="url" name="url" placeholder="https://..." type="url" />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="contributor_name">Nom</label>
          <input className="input mt-2" id="contributor_name" name="contributor_name" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="contributor_email">Email</label>
          <input className="input mt-2" id="contributor_email" name="contributor_email" type="email" />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="button-primary flex w-fit items-center gap-2" disabled={state.status === "loading"} type="submit">
          <Send className="h-4 w-4" aria-hidden="true" />
          {state.status === "loading" ? "Envoi..." : "Soumettre"}
        </button>
        {state.status !== "idle" ? <p className={`text-sm ${state.status === "error" ? "text-red-600" : "text-muted"}`}>{state.message}</p> : null}
      </div>
    </form>
  );
}
