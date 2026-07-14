import { Category } from "@/lib/types";

export type SelfAssessedTier = "pets-allowed" | "pet-friendly" | "pet-inclusive" | "not-sure";

export interface ApplicationData {
  // Step 1
  businessName: string;
  website: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  socialLinks: string;

  // Step 2
  category: Category | "";

  // Step 3 — answers keyed by question text
  categoryAnswers: Record<string, string>;

  // Step 4
  selfAssessedTier: SelfAssessedTier | "";

  // Step 5
  referralSource: string;

  // Step 6
  photos: string[];

  // Step 7
  serviceAnimalsAllowed: "yes" | "no" | "";
  esaAllowed: "yes" | "no" | "";
  breedRestrictions: "yes" | "no" | "";
  breedRestrictionsDetail: string;
  staffTrainedOnServiceAnimals: "yes" | "no" | "";

  // Step 9
  consentAccuracy: boolean;
  consentTerms: boolean;
  consentPrivacy: boolean;
  consentDataStorage: boolean;
  contractAccepted: boolean;
}

export const initialApplicationData: ApplicationData = {
  businessName: "",
  website: "",
  address: "",
  phone: "",
  email: "",
  description: "",
  socialLinks: "",
  category: "",
  categoryAnswers: {},
  selfAssessedTier: "",
  referralSource: "",
  photos: [],
  serviceAnimalsAllowed: "",
  esaAllowed: "",
  breedRestrictions: "",
  breedRestrictionsDetail: "",
  staffTrainedOnServiceAnimals: "",
  consentAccuracy: false,
  consentTerms: false,
  consentPrivacy: false,
  consentDataStorage: false,
  contractAccepted: false,
};

export const CATEGORY_QUESTIONS: Record<Category, string[]> = {
  "Restaurants & Cafes": [
    "Is there an outdoor patio or seating area where pets are welcome?",
    "Are water bowls provided for pets?",
  ],
  "Hotels & Accommodations": [
    "Is there an additional pet fee? If so, how much?",
    "Are there weight or breed restrictions?",
  ],
  "Parks & Outdoor Spaces": [
    "Is the space fenced or does it allow off-leash access?",
    "Are waste stations provided on-site?",
  ],
  "Retail & Shopping": [
    "Are pets allowed to walk through the entire store?",
    "Are treats or water offered to visiting pets?",
  ],
  "Groomers & Pet Services": [
    "What services do you offer (grooming, boarding, daycare, training)?",
    "Is staff trained in low-stress handling techniques?",
  ],
  "Veterinary & Healthcare": [
    "Do you offer emergency or after-hours care?",
    "Is your practice fear-free certified?",
  ],
  "Events & Activities": [
    "How often are your pet-friendly events held?",
    "Are events typically indoor, outdoor, or both?",
  ],
  Transportation: [
    "Are pet carriers or safety restraints provided?",
    "Is there an additional fee for traveling with a pet?",
  ],
  Other: ["Please describe how your business accommodates pets."],
};

export const REFERRAL_SOURCES = [
  "Google Search",
  "Social Media",
  "Friend or Family",
  "Another FurFinds Business",
  "Press or News Article",
  "Other",
];
