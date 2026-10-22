import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isRutgersEmail,
  filterHomes,
  initialFilters,
} from "../src/lib/model.ts";
import type { Home } from "../src/lib/model.ts";
const homes: Home[] = [
  {
    id: "1",
    user_id: "a",
    title: "A shared apartment",
    campus: "College Avenue",
    location: "Easton",
    price: 900,
    utilities: 50,
    bedrooms: 2,
    bathrooms: 1,
    lease_term: "Academic year",
    available_from: "2027-01-01",
    description: "Quiet study space",
    features: ["Laundry", "Furnished"],
    photo_url: null,
    latitude: null,
    longitude: null,
    created_at: "2026-10-01",
  },
  {
    id: "2",
    user_id: "b",
    title: "Busch shared room",
    campus: "Busch",
    location: "Piscataway",
    price: 1100,
    utilities: 70,
    bedrooms: 4,
    bathrooms: 2,
    lease_term: "12 months",
    available_from: "2027-01-01",
    description: "Parking available",
    features: ["Laundry", "Parking"],
    photo_url: null,
    latitude: null,
    longitude: null,
    created_at: "2026-10-02",
  },
];
test("Rutgers email allowlist rejects suffix spoofing, other schools, malformed and subdomain emails", () => {
  for (const v of [
    "me@rutgers.edu",
    "Me@ScarletMail.Rutgers.edu",
    " me@rutgers.edu ",
  ])
    assert.equal(isRutgersEmail(v), true, v);
  for (const v of [
    "me@other.edu",
    "me@rutgers.edu.attacker.test",
    "me@fake-rutgers.edu",
    "me@department.rutgers.edu",
    "x@y@rutgers.edu",
    "@rutgers.edu",
    "x y@rutgers.edu",
    "me@rutgers.edu\n.com",
  ])
    assert.equal(isRutgersEmail(v), false, v);
});
test("search, campus, price, bedroom, lease and amenity filters combine rather than overwrite each other", () => {
  assert.deepEqual(
    filterHomes(homes, {
      ...initialFilters,
      search: "  EASTON ",
      campus: "College Avenue",
      budget: 950,
      bedrooms: "2",
      lease: "Academic year",
      features: ["Laundry", "Furnished"],
    }).map((h) => h.id),
    ["1"],
  );
  assert.equal(
    filterHomes(homes, { ...initialFilters, search: "Easton", campus: "Busch" })
      .length,
    0,
  );
  assert.equal(
    filterHomes(homes, {
      ...initialFilters,
      features: ["Parking", "Furnished"],
    }).length,
    0,
  );
  assert.deepEqual(
    filterHomes(homes, { ...initialFilters, bedrooms: "4+" }).map((h) => h.id),
    ["2"],
  );
});
test("price sorting is stable without mutating inventory", () => {
  assert.deepEqual(
    filterHomes(homes, { ...initialFilters, sort: "Price: low to high" }).map(
      (h) => h.id,
    ),
    ["1", "2"],
  );
  assert.deepEqual(
    filterHomes(homes, { ...initialFilters, sort: "Price: high to low" }).map(
      (h) => h.id,
    ),
    ["2", "1"],
  );
  assert.deepEqual(
    homes.map((h) => h.id),
    ["1", "2"],
  );
});
