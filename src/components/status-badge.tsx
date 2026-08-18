import { statusLabel, type VerificationStatus } from "@/content/data";

export function StatusBadge({ status }: { status: VerificationStatus }) {
  const dotClass = status === "sourced" ? "verification-dot-sourced" : status === "example" ? "verification-dot-example" : "";

  return (
    <span className="verification">
      <span className={`verification-dot ${dotClass}`} aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}
