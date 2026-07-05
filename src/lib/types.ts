export type Tier = "pet-inclusive" | "pet-friendly" | "pets-allowed";

export type Category =
  | "Restaurants & Cafes"
  | "Hotels & Accommodations"
  | "Parks & Outdoor Spaces"
  | "Retail & Shopping"
  | "Groomers & Pet Services"
  | "Veterinary & Healthcare"
  | "Events & Activities"
  | "Transportation"
  | "Other";

export const CATEGORIES: Category[] = [
  "Restaurants & Cafes",
  "Hotels & Accommodations",
  "Parks & Outdoor Spaces",
  "Retail & Shopping",
  "Groomers & Pet Services",
  "Veterinary & Healthcare",
  "Events & Activities",
  "Transportation",
  "Other",
];

export const TIERS: { id: Tier; label: string }[] = [
  { id: "pet-inclusive", label: "Pet-Inclusive" },
  { id: "pet-friendly", label: "Pet-Friendly" },
  { id: "pets-allowed", label: "Pets Allowed" },
];

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  photoUrl?: string;
}

export interface Business {
  slug: string;
  name: string;
  category: Category;
  tier: Tier;
  description: string;
  longDescription: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  website: string;
  hours: string;
  petPolicy: string;
  serviceAnimalPolicy: string;
  esaPolicy: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  verifiedDate: string;
  reviews: Review[];
  lat: number;
  lng: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: "Pet-Friendly Travel" | "Business Spotlights" | "Pet Care Tips" | "Industry News";
  author: string;
  date: string;
  image: string;
}
