import { supabase } from "./supabase";
import { businesses as staticBusinesses } from "./data";
import type { Business, Category, Tier } from "./types";

type DbBusiness = {
  slug: string | null;
  name: string;
  category: string | null;
  tier: "basic" | "verified" | "premium";
  description: string | null;
  long_description: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  hours: string | null;
  pet_policy: string | null;
  service_animal_policy: string | null;
  esa_policy: string | null;
  amenities: string[] | null;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  featured: boolean;
  lat: number | null;
  lng: number | null;
  updated_at: string;
  created_at: string;
};

const TIER_FROM_SCHEMA: Record<DbBusiness["tier"], Tier> = {
  basic: "pets-allowed",
  verified: "pet-friendly",
  premium: "pet-inclusive",
};

const BUSINESS_COLUMNS =
  "slug, name, category, tier, description, long_description, city, state, address, phone, website, hours, pet_policy, service_animal_policy, esa_policy, amenities, images, rating, review_count, featured, lat, lng, updated_at, created_at";

function mapDbBusiness(row: DbBusiness): Business {
  const verifiedDate = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    new Date(row.updated_at || row.created_at)
  );

  return {
    slug: row.slug ?? "",
    name: row.name,
    category: (row.category as Category) ?? "Other",
    tier: TIER_FROM_SCHEMA[row.tier] ?? "pets-allowed",
    description: row.description ?? "",
    longDescription: row.long_description ?? row.description ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    address: row.address ?? [row.city, row.state].filter(Boolean).join(", "),
    phone: row.phone ?? "",
    website: row.website ?? "",
    hours: row.hours ?? "",
    petPolicy: row.pet_policy ?? "",
    serviceAnimalPolicy: row.service_animal_policy ?? "",
    esaPolicy: row.esa_policy ?? "",
    amenities: row.amenities ?? [],
    images:
      row.images && row.images.length > 0
        ? row.images
        : ["https://picsum.photos/seed/furfinds-business-fallback/900/650"],
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    verifiedDate,
    reviews: [],
    lat: row.lat ?? 0,
    lng: row.lng ?? 0,
  };
}

/** Live business directory, sourced from Supabase. Falls back to the
 * curated static list only on a genuine fetch error (e.g. Supabase isn't
 * configured yet) — an empty-but-successful query means "no active
 * businesses yet," which is shown as-is rather than papered over. */
export async function getAllBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select(BUSINESS_COLUMNS)
    .eq("status", "active")
    .not("slug", "is", null)
    .order("featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) {
    console.warn("Falling back to static business data:", error.message);
    return staticBusinesses;
  }

  return (data ?? []).map((row) => mapDbBusiness(row as DbBusiness));
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  const { data, error } = await supabase
    .from("businesses")
    .select(BUSINESS_COLUMNS)
    .eq("status", "active")
    .eq("slug", slug)
    .maybeSingle();

  if (!error && data) return mapDbBusiness(data as DbBusiness);
  return staticBusinesses.find((b) => b.slug === slug);
}

export interface LiveReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export async function getReviewsForBusiness(slug: string): Promise<LiveReview[]> {
  const { data, error } = await supabase
    .from("site_reviews")
    .select("id, author_name, rating, comment, created_at")
    .eq("business_slug", slug)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((r) => ({
    id: r.id,
    authorName: r.author_name || "FurFinds Pet Parent",
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  }));
}
