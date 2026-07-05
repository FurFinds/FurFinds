import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Business } from "@/lib/types";
import { TierBadge } from "./TierBadge";
import { StarRating } from "./StarRating";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <Link
      href={`/business/${business.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={business.images[0]}
          alt={business.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <TierBadge tier={business.tier} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-dark-blue/80">
          {business.category}
        </p>
        <h3 className="font-display text-lg font-medium text-black">{business.name}</h3>
        <p className="line-clamp-2 text-sm text-black/70">{business.description}</p>
        <div className="mt-1 flex items-center gap-1 text-sm text-black/60">
          <MapPin size={14} />
          {business.city}, {business.state}
        </div>
        <StarRating rating={business.rating} reviewCount={business.reviewCount} />
        <span className="mt-2 inline-flex items-center justify-center rounded-full bg-bg-blue px-4 py-2 text-sm font-medium text-dark-blue transition-colors group-hover:bg-light-blue group-hover:text-white">
          View Details
        </span>
      </div>
    </Link>
  );
}
