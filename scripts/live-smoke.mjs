import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { writeFileSync, unlinkSync, existsSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
const projectRef = "wgsqvddfdrebmajgjklp";
// Admin keys stay in process memory. Never write or log them.
const raw = execFileSync(
  "npx",
  [
    "--yes",
    "supabase@2.121.0",
    "projects",
    "api-keys",
    "--project-ref",
    projectRef,
    "--output",
    "json",
  ],
  { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
);
const parsed = JSON.parse(raw);
const keys = Array.isArray(parsed) ? parsed : parsed.keys;
const service = keys.find((k) => k.name === "service_role")?.api_key;
const publishable = keys.find((k) => k.name === "anon")?.api_key;
if (!service || !publishable)
  throw Error("Authenticated CLI access to project keys is required.");
const url = `https://${projectRef}.supabase.co`;
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, service, options);
const a = createClient(url, publishable, options),
  b = createClient(url, publishable, options),
  guest = createClient(url, publishable, options);
const users = [];
const photos = [];
const marker = randomUUID().slice(0, 8);
let passed = false;
function ok(r) {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}
try {
  for (const label of ["owner", "seeker"]) {
    const email = `scarlet-qa-${label}-${marker}@rutgers.edu`,
      password = randomUUID() + randomUUID();
    const { user } = ok(
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { test_run: marker },
      }),
    );
    users.push(user);
    ok(
      await (label === "owner" ? a : b).auth.signInWithPassword({
        email,
        password,
      }),
    );
  }
  const [owner, seeker] = users;
  const anonymous = await guest.from("pad_listings").select("*");
  assert.ok(anonymous.error, "Guests must not read member homes");
  const photoPath = `${owner.id}/${randomUUID()}.png`;
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aCwoAAAAASUVORK5CYII=",
    "base64",
  );
  ok(
    await a.storage
      .from("pad-listing-photos")
      .upload(photoPath, png, { contentType: "image/png" }),
  );
  photos.push(photoPath);
  const home = ok(
    await a
      .from("pad_listings")
      .insert({
        user_id: owner.id,
        title: "QA fixture — will be removed",
        campus: "College Avenue",
        location: "Test neighborhood",
        price: 950,
        utilities: 75,
        bedrooms: 2,
        bathrooms: 1,
        lease_term: "Academic year",
        available_from: "2027-01-01",
        description:
          "Temporary synthetic fixture used only to verify the live integration.",
        features: ["Laundry"],
        photo_path: photoPath,
        latitude: 40.5028,
        longitude: -74.4516,
      })
      .select()
      .single(),
  );
  assert.equal(
    ok(await b.from("pad_listings").select("id").eq("id", home.id)).length,
    1,
  );
  ok(
    await a
      .from("pad_listings")
      .update({ title: "QA updated — will be removed" })
      .eq("id", home.id),
  );
  assert.equal(
    ok(await b.from("pad_listings").select("title").eq("id", home.id).single())
      .title,
    "QA updated — will be removed",
  );
  const signed = ok(
    await b.storage.from("pad-listing-photos").createSignedUrl(photoPath, 60),
  );
  assert.equal((await fetch(signed.signedUrl)).status, 200);
  ok(
    await a
      .from("pad_plans")
      .upsert({
        user_id: owner.id,
        data: {
          names: ["QA owner", "", "", ""],
          points: [4, 0, 0, 0],
          selection: "",
          tasks: { eligibility: true },
        },
      }),
  );
  assert.equal(
    ok(await b.from("pad_plans").select("*").eq("user_id", owner.id)).length,
    0,
  );
  ok(
    await b
      .from("pad_saves")
      .insert({ user_id: seeker.id, listing_id: home.id }),
  );
  assert.equal(
    ok(await a.from("pad_saves").select("*").eq("user_id", seeker.id)).length,
    0,
  );
  ok(
    await a
      .from("pad_roommates")
      .upsert({
        user_id: owner.id,
        display_name: "QA owner",
        major: "QA test fixture",
        campus: "College Avenue",
        budget: 1000,
        sleep: "Early bird",
        tidy: "Very tidy",
        social: "Quiet home",
        bio: "Temporary synthetic profile for integration verification.",
        is_visible: false,
      }),
  );
  assert.equal(
    ok(await b.from("pad_roommates").select("*").eq("user_id", owner.id))
      .length,
    0,
  );
  ok(
    await a
      .from("pad_roommates")
      .update({ is_visible: true })
      .eq("user_id", owner.id),
  );
  assert.equal(
    ok(await b.from("pad_roommates").select("*").eq("user_id", owner.id))
      .length,
    1,
  );
  const request = ok(
    await b
      .from("pad_connections")
      .insert({
        from_user: seeker.id,
        to_user: owner.id,
        target_listing: home.id,
        target_label: "Spoofed target",
        note: "A temporary synthetic connection for integration testing.",
      })
      .select()
      .single(),
  );
  assert.equal(request.target_label, "QA updated — will be removed");
  assert.equal(
    ok(await b.rpc("pad_connection_email", { connection_id: request.id })),
    null,
  );
  ok(
    await b
      .from("pad_connections")
      .update({ status: "accepted" })
      .eq("id", request.id),
  );
  assert.equal(
    ok(
      await a
        .from("pad_connections")
        .select("status")
        .eq("id", request.id)
        .single(),
    ).status,
    "pending",
  );
  ok(
    await a
      .from("pad_connections")
      .update({ status: "accepted" })
      .eq("id", request.id),
  );
  assert.equal(
    ok(await b.rpc("pad_connection_email", { connection_id: request.id })),
    owner.email,
  );
  assert.equal(
    ok(await a.rpc("pad_connection_email", { connection_id: request.id })),
    seeker.email,
  );
  const session = ok(await a.auth.getSession()).session;
  if (process.argv.includes("--browser")) {
    writeFileSync(
      "output/live-test-session.json",
      JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      }),
      { mode: 0o600 },
    );
    console.log(
      "Live tests passed. Synthetic owner session ready for browser QA. Press Enter to clean up.",
    );
    const io = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    await io.question("");
    io.close();
  }
  passed = true;
  console.log(
    "PASS: live Auth, PostgREST, listing update, private Storage, plans, saves, hidden profiles, consent and contact sharing.",
  );
} finally {
  if (existsSync("output/live-test-session.json"))
    unlinkSync("output/live-test-session.json");
  if (photos.length)
    ok(await admin.storage.from("pad-listing-photos").remove(photos));
  for (const u of users) ok(await admin.auth.admin.deleteUser(u.id));
  console.log(
    `Cleanup complete: ${users.length} synthetic accounts removed. Test result: ${passed ? "passed" : "failed"}.`,
  );
}
