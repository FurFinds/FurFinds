import { supabase } from "./supabase";
import { businesses as staticBusinesses } from "./data";
import { CATEGORY_FROM_DB, TIER_FROM_DB, type DbCategory, type DbTier } from "./dbEnums";
import type { Business } from "./types";

type DbBusiness = {
  id: string;
  slug: string | null;
  name: string;
  category: DbCategory | null;
  tier: DbTier;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  business_hours: string | null;
  pet_policy: string | null;
  service_animals_allowed: boolean | null;
  esa_policy: string | null;
  photos: string[] | null;
  verification_date: string | null;
  created_at: string;
  lat: number | null;
  lng: number | null;
};

const BUSINESS_COLUMNS =
  "id, slug, name, category, tier, address, city, state, phone, website, description, business_hours, pet_policy, service_animals_allowed, esa_policy, photos, verification_date, created_at, lat, lng";

function mapDbBusiness(row: DbBusiness): Business {
  const verifiedDate = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    new Date(row.verification_date || row.created_at)
  );

  return {
    slug: row.slug ?? "",
    name: row.name,
    category: row.category ? CATEGORY_FROM_DB[row.category] : "Other",
    tier: TIER_FROM_DB[row.tier],
    description: row.description ?? "",
    longDescription: row.description ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    address: row.address ?? [row.city, row.state].filter(Boolean).join(", "),
    phone: row.phone ?? "",
    website: row.website ?? "",
    hours: row.business_hours ?? "",
    petPolicy: row.pet_policy ?? "",
    serviceAnimalPolicy: row.service_animals_allowed
      ? "Service animals welcome, no restrictions."
      : "Please contact the business about service animal accommodations.",
    esaPolicy: row.esa_policy ?? "",
    amenities: [],
    images:
      row.photos && row.photos.length > 0
        ? row.photos
        : ["https://picsum.photos/seed/furfinds-business-fallback/900/650"],
    rating: 0,
    reviewCount: 0,
    verifiedDate,
    reviews: [],
    lat: row.lat ?? 0,
    lng: row.lng ?? 0,
  };
}

async function attachReviewStats(rows: DbBusiness[], businesses: Business[]): Promise<Business[]> {
  if (rows.length === 0) return businesses;

  const slugById = new Map(rows.map((r) => [r.id, r.slug]));
  const { data: reviewRows } = await supabase
    .from("reviews")
    .select("business_id, rating")
    .in(
      "business_id",
      rows.map((r) => r.id)
    );

  const statsBySlug = new Map<string, { total: number; count: number }>();
  for (const r of reviewRows ?? []) {
    const slug = slugById.get(r.business_id as string);
    if (!slug) continue;
    const entry = statsBySlug.get(slug) ?? { total: 0, count: 0 };
    entry.total += r.rating as number;
    entry.count += 1;
    statsBySlug.set(slug, entry);
  }

  return businesses.map((b) => {
    const stats = statsBySlug.get(b.slug);
    if (!stats || stats.count === 0) return b;
    return { ...b, rating: Math.round((stats.total / stats.count) * 10) / 10, reviewCount: stats.count };
  });
}

/** Live business directory, sourced from Supabase. Falls back to the
 * curated static list only on a genuine fetch error (e.g. Supabase isn't
 * configured yet) — an empty-but-successful query means "no approved
 * businesses yet," which is shown as-is rather than papered over. */
export async function getAllBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select(BUSINESS_COLUMNS)
    .eq("verification_status", "approved")
    .eq("is_active", true)
    .not("slug", "is", null)
    .order("verification_score", { ascending: false });

  if (error) {
    console.warn("Falling back to static business data:", error.message);
    return staticBusinesses;
  }

  const rows = (data ?? []) as DbBusiness[];
  const businesses = rows.map(mapDbBusiness);
  return attachReviewStats(rows, businesses);
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  const { data, error } = await supabase
    .from("businesses")
    .select(BUSINESS_COLUMNS)
    .eq("verification_status", "approved")
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (!error && data) {
    const row = data as DbBusiness;
    const [business] = await attachReviewStats([row], [mapDbBusiness(row)]);
    return business;
  }
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
  const { data: business } = await supabase.from("businesses").select("id").eq("slug", slug).maybeSingle();
  if (!business) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, user:users(name)")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((r) => ({
    id: r.id,
    authorName: (r.user as { name?: string } | null)?.name || "FurFinds Pet Parent",
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  }));
}
