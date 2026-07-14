"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Program = { id: string; title: string; type: string };

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false
    });
    if (result?.error) setError("Identifiants invalides.");
    else router.push("/dashboard");
  }
  return (
    <form onSubmit={submit} className="panel mx-auto max-w-md space-y-3">
      <input className="field" name="email" type="email" placeholder="Email" required />
      <input className="field" name="password" type="password" placeholder="Mot de passe" required />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn w-full" type="submit">Se connecter</button>
    </form>
  );
}

export function RegisterForm({ programs }: { programs: Program[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const programIds = form.getAll("programIds").map(String);
    const response = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        password: form.get("password"),
        programIds
      })
    });
    if (response.ok) {
      setMessage("Demande envoyée. Vous pouvez vous connecter pendant la validation.");
      setTimeout(() => router.push("/connexion"), 1200);
    } else {
      setMessage("Impossible d'enregistrer la demande. Vérifiez les champs.");
    }
  }
  return (
    <form onSubmit={submit} className="panel mx-auto max-w-2xl space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" name="name" placeholder="Nom complet" required />
        <input className="field" name="email" type="email" placeholder="Email" required />
        <input className="field" name="phone" placeholder="Téléphone" />
        <input className="field" name="password" type="password" minLength={8} placeholder="Mot de passe" required />
      </div>
      <div className="grid gap-2">
        {programs.map((program) => (
          <label key={program.id} className="flex items-center gap-2 rounded-md border border-stone-200 p-3 text-sm">
            <input type="checkbox" name="programIds" value={program.id} />
            <span>{program.title}</span>
          </label>
        ))}
      </div>
      {message && <p className="text-sm text-palm">{message}</p>}
      <button className="btn" type="submit">Demander une inscription</button>
    </form>
  );
}

export function AvailabilityForm({ programs }: { programs: Program[] }) {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const isRecurring = form.get("mode") === "recurring";
    const response = await fetch("/api/availabilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        programId: form.get("programId") || null,
        dayOfWeek: isRecurring ? Number(form.get("dayOfWeek")) : null,
        date: isRecurring ? null : new Date(String(form.get("date"))).toISOString(),
        startTime: form.get("startTime"),
        endTime: form.get("endTime"),
        isRecurring
      })
    });
    setMessage(response.ok ? "Disponibilité enregistrée." : "Créneau invalide.");
  }
  return (
    <form onSubmit={submit} className="panel space-y-3">
      <select className="field" name="programId">
        {programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}
      </select>
      <select className="field" name="mode">
        <option value="recurring">Récurrent</option>
        <option value="single">Ponctuel</option>
      </select>
      <div className="grid gap-3 sm:grid-cols-3">
        <select className="field" name="dayOfWeek" defaultValue="1">
          {["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((day, index) => (
            <option key={day} value={index}>{day}</option>
          ))}
        </select>
        <input className="field" name="date" type="date" />
        <div className="grid grid-cols-2 gap-2">
          <input className="field" name="startTime" type="time" defaultValue="18:00" required />
          <input className="field" name="endTime" type="time" defaultValue="19:00" required />
        </div>
      </div>
      {message && <p className="text-sm text-palm">{message}</p>}
      <button className="btn" type="submit">Ajouter</button>
    </form>
  );
}

export function ContactForm() {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), email: form.get("email"), message: form.get("message") })
    });
    setMessage(response.ok ? "Message envoyé." : "Merci de compléter le formulaire.");
  }
  return (
    <form onSubmit={submit} className="panel mx-auto max-w-xl space-y-3">
      <input className="field" name="name" placeholder="Nom" required />
      <input className="field" name="email" type="email" placeholder="Email" required />
      <textarea className="field min-h-32" name="message" placeholder="Message" required />
      {message && <p className="text-sm text-palm">{message}</p>}
      <button className="btn">Envoyer</button>
    </form>
  );
}
