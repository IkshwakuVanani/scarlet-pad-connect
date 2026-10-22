export const campuses = [
  "College Avenue",
  "Busch",
  "Livingston",
  "Cook / Douglass",
] as const;
export type Campus = (typeof campuses)[number];
export interface Home {
  id: string;
  user_id: string;
  title: string;
  campus: Campus;
  location: string;
  price: number;
  utilities: number;
  bedrooms: number;
  bathrooms: number;
  lease_term: string;
  available_from: string;
  description: string;
  features: string[];
  photo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}
export interface Roommate {
  user_id: string;
  display_name: string;
  major: string;
  campus: Campus;
  budget: number;
  sleep: string;
  tidy: string;
  social: string;
  bio: string;
  is_visible: boolean;
}
export interface Connection {
  id: string;
  from_user: string;
  to_user: string;
  target_label: string;
  note: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}
export interface Planner {
  names: string[];
  points: number[];
  selection: string;
  tasks: Record<string, boolean>;
}
export const defaultPlan: Planner = {
  names: ["You", "", "", ""],
  points: [0, 0, 0, 0],
  selection: "",
  tasks: {},
};
export const tasks = [
  [
    "eligibility",
    "Check your eligibility",
    "Read the current Residence Life rules for your housing type.",
  ],
  [
    "number",
    "Apply for a selection number",
    "Every group member needs to complete their own application.",
  ],
  [
    "group",
    "Confirm your roommate group",
    "Agree on campus, room type, budget, and a backup plan.",
  ],
  [
    "option",
    "Apply for your housing option",
    "This is a separate step from requesting a selection number.",
  ],
  [
    "time",
    "Record your selection appointment",
    "Use the appointment and deadlines sent by Rutgers.",
  ],
  [
    "select",
    "Select through the Rutgers portal",
    "Scarlet Pad helps you prepare; Rutgers makes the assignment.",
  ],
];
export const blankRoommate = (id: string): Roommate => ({
  user_id: id,
  display_name: "",
  major: "",
  campus: "College Avenue",
  budget: 1000,
  sleep: "Early bird",
  tidy: "Very tidy",
  social: "A balance",
  bio: "",
  is_visible: true,
});
export const officialHousing =
  "https://ruoncampus.rutgers.edu/housing-information/continuing-student-housing";
export function isRutgersEmail(email: string) {
  return /^[^\s@]+@(rutgers\.edu|scarletmail\.rutgers\.edu)$/i.test(
    email.trim(),
  );
}
export interface Filters {
  search: string;
  campus: string;
  budget: number;
  bedrooms: string;
  lease: string;
  features: string[];
  sort: string;
}
export const initialFilters: Filters = {
  search: "",
  campus: "All campuses",
  budget: 2500,
  bedrooms: "Any",
  lease: "Any",
  features: [],
  sort: "Recommended",
};
export function filterHomes(homes: Home[], f: Filters) {
  const term = f.search.trim().toLowerCase();
  const result = homes.filter(
    (h) =>
      (!term ||
        `${h.title} ${h.location} ${h.campus} ${h.description}`
          .toLowerCase()
          .includes(term)) &&
      (f.campus === "All campuses" || h.campus === f.campus) &&
      h.price <= f.budget &&
      (f.bedrooms === "Any" ||
        (f.bedrooms === "4+"
          ? h.bedrooms >= 4
          : h.bedrooms === Number(f.bedrooms))) &&
      (f.lease === "Any" || h.lease_term === f.lease) &&
      f.features.every((x) => h.features.includes(x)),
  );
  return result.sort((a, b) =>
    f.sort === "Price: low to high"
      ? a.price - b.price
      : f.sort === "Price: high to low"
        ? b.price - a.price
        : b.created_at.localeCompare(a.created_at),
  );
}
export const money = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
export function readLocal<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function storeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
