import { Tier } from "@/lib/types";

const tierConfig: Record<Tier, { label: string; bg: string; text: string }> = {
  "pet-inclusive": { label: "Pet-Inclusive", bg: "#C9A84C", text: "#ffffff" },
  "pet-friendly": { label: "Pet-Friendly", bg: "#A8A8A8", text: "#ffffff" },
  "pets-allowed": { label: "Pets Allowed", bg: "#A97142", text: "#ffffff" },
};

export function TierBadge({ tier, className = "" }: { tier: Tier; className?: string }) {
  const { label, bg, text } = tierConfig[tier];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
      <span aria-hidden="true">🐾</span>
      {label}
    </span>
  );
}
