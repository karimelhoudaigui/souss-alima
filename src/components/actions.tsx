"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function EnrollmentStatusForm({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  async function change(nextStatus: string) {
    await fetch("/api/enrollments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId: id, status: nextStatus })
    });
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <button className="btn-secondary py-1" disabled={status === "ACTIVE"} onClick={() => change("ACTIVE")}>Valider</button>
      <button className="btn-secondary py-1" onClick={() => change("CANCELLED")}>Refuser</button>
    </div>
  );
}

export function ProposeSessionForm({ availabilityId }: { availabilityId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        availabilityId,
        scheduledAt: new Date(String(form.get("scheduledAt"))).toISOString(),
        durationMin: Number(form.get("durationMin"))
      })
    });
    setMessage(response.ok ? "Passage proposé." : "Horaire hors disponibilité.");
    router.refresh();
  }
  return (
    <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-[1fr_90px_auto]">
      <input className="field" name="scheduledAt" type="datetime-local" required />
      <input className="field" name="durationMin" type="number" defaultValue="20" min="10" max="120" />
      <button className="btn" type="submit">Proposer</button>
      {message && <p className="text-sm text-palm sm:col-span-3">{message}</p>}
    </form>
  );
}

export function SessionActionForm({ id, canComplete }: { id: string; canComplete?: boolean }) {
  const router = useRouter();
  async function update(status: string, extra = {}) {
    await fetch("/api/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, ...extra })
    });
    router.refresh();
  }
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-secondary py-1" onClick={() => update("CONFIRMED")}>Confirmer</button>
      <button className="btn-secondary py-1" onClick={() => update("CANCELLED")}>Décliner</button>
      {canComplete && (
        <button
          className="btn py-1"
          onClick={() => update("DONE", { surah: "البقرة", ayahFrom: 1, ayahTo: 20, juz: 1, page: 4, notes: "Passage validé depuis le back-office." })}
        >
          Marquer réalisé
        </button>
      )}
    </div>
  );
}

export function LessonDoneButton({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  async function done() {
    await fetch("/api/lesson-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completed: true })
    });
    router.refresh();
  }
  return <button className="btn-secondary py-1" onClick={done}>Marquer terminé</button>;
}
