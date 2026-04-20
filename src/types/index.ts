// ─── Shoe core ────────────────────────────────────────────────────────────────

export type ShoeCategory =
  | "road-running"
  | "trail-running"
  | "basketball"
  | "football"
  | "gym-training"
  | "hiking"
  | "tennis"
  | "cycling"
  | "sneakers"
  | "walking"
  | "sandals"
  | "boots"
  | "work-safety"
  | "healthcare"
  | "wide-orthopaedic"
  | "kids";

export type TerrainType = "road" | "trail" | "gym" | "court" | "street" | "treadmill" | "all-terrain";
export type ArchType    = "flat" | "neutral" | "high";
export type PronationType = "underpronation" | "neutral" | "overpronation";
export type FootWidth   = "narrow" | "regular" | "wide" | "extra-wide";
export type FootStrike  = "heel" | "midfoot" | "forefoot";
export type CushionFeel = "firm" | "medium" | "plush";

export interface LabData {
  weightG:             number;          // grams, men's US 10
  heelDropMm:          number;
  heelStackMm:         number;
  forefootStackMm:     number;
  midsoleHardnessHC:   number;          // Shore C durometer
  energyReturnPct:     number;
  toeboxWidthMm:       number;
  toeboxHeightMm:      number;
  heelCounterStiffness: 1 | 2 | 3 | 4 | 5;
  breathabilityScore:  number;          // 0–100
  outsoleGripScore:    number;          // 0–100
  flexibilityScore:    number;          // 0–100
  removableInsole:     boolean;
  reflective:          boolean;
  sustainabilityPct:   number;
}

export interface ShoeScores {
  coreScore:   number;   // 0–100, weighted aggregate
  comfort:     number;
  durability:  number;
  performance: number;
  value:       number;
  fit:         number;
}

export interface PricePoint {
  month: string;
  price: number;
}

export interface RetailerPrice {
  name:  string;
  price: number;
  url:   string;
  inStock: boolean;
}

export interface ShoeConstruction {
  upper:         string;
  midsole:       string;
  outsole:       string;
  insole:        string;
  heelCounter:   string;
  lacing:        string;
}

export interface ShoeFit {
  widthOptions:     string[];
  sizeRange:        string;
  fitNote:          string;
  archSupport:      "neutral" | "stability" | "motion-control";
  orthoticFriendly: boolean;
}

export interface ReviewSummary {
  totalReviews:   number;
  expertReviews:  number;
  sentimentScore: number;
  pros:           string[];
  cons:           string[];
}

export interface Shoe {
  id:           string;
  slug:         string;
  name:         string;
  brand:        string;
  tagline:      string;
  category:     ShoeCategory;
  subcategory:  string;
  year:         number;
  colorway:     string;
  msrp:         number;
  currentLow:   number;
  imageUrl:     string;
  labData:      LabData;
  scores:       ShoeScores;
  priceHistory: PricePoint[];
  retailers:    RetailerPrice[];
  construction: ShoeConstruction;
  fit:          ShoeFit;
  bestFor:      string[];
  notIdealFor:  string[];
  terrain:      TerrainType[];
  reviews:      ReviewSummary;
  similarIds:   string[];
  createdAt:    string;
  updatedAt:    string;
}

// ─── Catalogue / filter ───────────────────────────────────────────────────────

export interface CatalogueFilters {
  query:       string;
  categories:  ShoeCategory[];
  brands:      string[];
  terrain:     TerrainType[];
  minPrice:    number;
  maxPrice:    number;
  minScore:    number;
  heelDrop:    [number, number];    // [min, max] mm
  weightMax:   number;              // grams
  widthOptions: FootWidth[];
  archSupport: ArchType[];
  sortBy:      SortOption;
}

export type SortOption =
  | "score-desc"
  | "price-asc"
  | "price-desc"
  | "weight-asc"
  | "newest"
  | "most-reviewed";

// ─── AI Finder / user profile ─────────────────────────────────────────────────

export interface FootProfile {
  // Anatomy
  sizeUS:          number;
  width:           FootWidth;
  archType:        ArchType;
  toeShape:        "tapered" | "square" | "wide";
  instepHeight:    "low" | "medium" | "high";
  heelWidth:       "narrow" | "regular" | "wide";

  // Biomechanics
  bodyWeightKg:    number;
  pronation:       PronationType;
  footStrike:      FootStrike;
  injuryHistory:   string[];        // e.g. ["plantar-fasciitis", "shin-splints"]

  // Use case
  primaryUse:      ShoeCategory;
  terrain:         TerrainType[];
  weeklyKm:        number;
  budget:          number;
  cushionFeel:     CushionFeel;
  stackPreference: "minimal" | "moderate" | "maximal";
}

export interface Recommendation {
  shoe:         Shoe;
  matchScore:   number;             // 0–100
  reasons:      string[];           // e.g. ["Wide toebox matches your EE width"]
  warnings:     string[];           // e.g. ["Slightly above your budget"]
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data:       T[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code:    string;
}
