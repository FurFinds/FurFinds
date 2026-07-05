import { MapPin, ExternalLink } from "lucide-react";

export function MapCard({ address, name }: { address: string; name?: string }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-72 flex-col items-center justify-center gap-3 rounded-2xl bg-bg-blue/50 text-center ring-1 ring-black/5 transition-colors hover:bg-bg-blue"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-dark-blue shadow-sm">
        <MapPin size={26} />
      </div>
      <div>
        <p className="font-medium text-black">{name ?? "View on map"}</p>
        <p className="mt-1 max-w-xs text-sm text-black/60">{address}</p>
      </div>
      <span className="flex items-center gap-1.5 text-sm font-medium text-dark-blue">
        Open in Google Maps <ExternalLink size={14} />
      </span>
    </a>
  );
}
