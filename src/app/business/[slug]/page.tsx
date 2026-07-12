import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Globe, MapPin, Phone, Clock, ShieldCheck, Flag, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { TierBadge } from "@/components/TierBadge";
import { StarRating } from "@/components/StarRating";
import { MapCard } from "@/components/MapCard";
import { businesses, getBusinessBySlug } from "@/lib/data";
import { Gallery } from "./Gallery";
import { ReviewForm } from "./ReviewForm";

export function generateStaticParams() {
  return businesses.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) return {};
  return {
    title: `${business.name} — FurFinds`,
    description: business.description,
  };
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) notFound();

  return (
    <div className="bg-white py-10">
      <Container>
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-dark-blue/80">
              {business.category}
            </p>
            <h1 className="mt-1 font-display text-3xl font-medium text-black sm:text-4xl">
              {business.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <TierBadge tier={business.tier} />
              <span className="flex items-center gap-1 text-sm text-black/60">
                <ShieldCheck size={16} className="text-dark-blue" />
                Verified {business.verifiedDate}
              </span>
            </div>
          </div>
          <StarRating rating={business.rating} reviewCount={business.reviewCount} size={20} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <Gallery images={business.images} name={business.name} />

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-display text-xl font-medium text-black">About</h2>
              <p className="mt-3 text-black/75">{business.longDescription}</p>
            </div>

            {/* Pet Policy */}
            <div className="mt-8 rounded-2xl bg-bg-blue/40 p-6">
              <h2 className="font-display text-xl font-medium text-black">Pet Policy</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-black">General Policy</dt>
                  <dd className="mt-1 text-black/75">{business.petPolicy}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-black">Service Animal Policy</dt>
                  <dd className="mt-1 text-black/75">{business.serviceAnimalPolicy}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-black">ESA Policy</dt>
                  <dd className="mt-1 text-black/75">{business.esaPolicy}</dd>
                </div>
              </dl>
            </div>

            {/* Amenities */}
            <div className="mt-8">
              <h2 className="font-display text-xl font-medium text-black">Amenities</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {business.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2.5 text-sm text-black/80">
                    <Check size={18} className="shrink-0 text-dark-blue" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="mt-8">
              <h2 className="font-display text-xl font-medium text-black">Location</h2>
              <div className="mt-4">
                <MapCard address={business.address} name={business.name} />
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-10">
              <h2 className="font-display text-xl font-medium text-black">
                Reviews ({business.reviewCount})
              </h2>
              <div className="mt-4 space-y-5">
                {business.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-black/5 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-black">{review.author}</p>
                      <span className="text-xs text-black/50">{review.date}</span>
                    </div>
                    <div className="mt-1">
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <p className="mt-2 text-sm text-black/75">{review.comment}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <ReviewForm businessName={business.name} businessSlug={business.slug} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-black/5 p-6 shadow-sm">
              <ul className="space-y-3 text-sm text-black/80">
                <li className="flex items-start gap-2.5">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-dark-blue" />
                  {business.address}
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={18} className="mt-0.5 shrink-0 text-dark-blue" />
                  {business.phone}
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={18} className="mt-0.5 shrink-0 text-dark-blue" />
                  {business.hours}
                </li>
                <li className="flex items-start gap-2.5">
                  <Globe size={18} className="mt-0.5 shrink-0 text-dark-blue" />
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Visit website
                  </a>
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full bg-light-blue px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-dark-blue"
                >
                  Visit Website
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    business.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full border-2 border-light-blue px-5 py-2.5 text-center text-sm font-medium text-dark-blue hover:bg-bg-blue"
                >
                  Get Directions
                </a>
                <a
                  href={`tel:${business.phone.replace(/[^0-9+]/g, "")}`}
                  className="w-full rounded-full border-2 border-light-blue px-5 py-2.5 text-center text-sm font-medium text-dark-blue hover:bg-bg-blue"
                >
                  Call Now
                </a>
              </div>
            </div>

            <a
              href="/report"
              className="flex items-center gap-2.5 rounded-2xl border border-black/5 p-5 text-sm text-black/70 hover:bg-bg-blue/30"
            >
              <Flag size={18} className="text-dark-blue" />
              Report an issue with this business
            </a>
          </aside>
        </div>
      </Container>
    </div>
  );
}
