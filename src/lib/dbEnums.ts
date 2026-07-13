// Maps between the UI-facing Category/Tier values (lib/types.ts) and the
// live Supabase `businesses` table's actual check-constraint values, which
// use different vocabulary (single lowercase words for category,
// underscored slugs for tier).
import type { Category, Tier } from "./types";

export type DbCategory =
  | "restaurants"
  | "hotels"
  | "parks"
  | "retail"
  | "groomers"
  | "vets"
  | "events"
  | "transportation"
  | "other";

export type DbTier = "pets_allowed" | "pet_friendly" | "pet_inclusive";

export const CATEGORY_TO_DB: Record<Category, DbCategory> = {
  "Restaurants & Cafes": "restaurants",
  "Hotels & Accommodations": "hotels",
  "Parks & Outdoor Spaces": "parks",
  "Retail & Shopping": "retail",
  "Groomers & Pet Services": "groomers",
  "Veterinary & Healthcare": "vets",
  "Events & Activities": "events",
  Transportation: "transportation",
  Other: "other",
};

export const CATEGORY_FROM_DB: Record<DbCategory, Category> = {
  restaurants: "Restaurants & Cafes",
  hotels: "Hotels & Accommodations",
  parks: "Parks & Outdoor Spaces",
  retail: "Retail & Shopping",
  groomers: "Groomers & Pet Services",
  vets: "Veterinary & Healthcare",
  events: "Events & Activities",
  transportation: "Transportation",
  other: "Other",
};

export const TIER_TO_DB: Record<Tier, DbTier> = {
  "pets-allowed": "pets_allowed",
  "pet-friendly": "pet_friendly",
  "pet-inclusive": "pet_inclusive",
};

export const TIER_FROM_DB: Record<DbTier, Tier> = {
  pets_allowed: "pets-allowed",
  pet_friendly: "pet-friendly",
  pet_inclusive: "pet-inclusive",
};
