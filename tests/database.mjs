import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create role supabase_auth_admin; create schema auth;
 create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,is_anonymous boolean default false,banned_until timestamptz);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`);
const migration = readdirSync("supabase/migrations").find((f) =>
  f.endsWith("_scarlet_pad_v2.sql"),
);
await db.exec(readFileSync(`supabase/migrations/${migration}`, "utf8"));
const ids = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
  "00000000-0000-0000-0000-000000000004",
  "00000000-0000-0000-0000-000000000005",
];
for (const [i, email] of [
  "a@rutgers.edu",
  "b@scarletmail.rutgers.edu",
  "outsider@another.edu",
  "unconfirmed@rutgers.edu",
  "c@rutgers.edu",
].entries())
  await db.query(
    "insert into auth.users(id,email,email_confirmed_at) values($1,$2,$3)",
    [ids[i], email, i === 3 ? null : "2026-01-01"],
  );
await db.exec(`create schema storage;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text);
alter table storage.objects enable row level security;
create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name,'/'))[1:array_length(string_to_array(name,'/'),1)-1] $$;
grant usage on schema storage to authenticated;
grant select,insert,delete on storage.objects to authenticated;`);
const productionMigration = readdirSync("supabase/migrations").find((f) =>
  f.endsWith("_production_membership_and_storage.sql"),
);
await db.exec(
  readFileSync(`supabase/migrations/${productionMigration}`, "utf8"),
);
await assert.rejects(
  () =>
    db.query(
      "insert into auth.users(id,email,email_confirmed_at) values(gen_random_uuid(),'outside@other.edu',now())",
    ),
  /Rutgers email/,
);
async function as(user, sql) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
    user || "",
  ]);
  await db.exec(`set role ${user ? "authenticated" : "anon"}`);
  return db.exec(sql);
}
async function count(user, table) {
  const result = await as(
    user,
    `select count(*)::int as n from public.${table}`,
  );
  return result[0].rows[0].n;
}
const listing = "11111111-1111-1111-1111-111111111111";
await as(
  ids[0],
  `insert into public.pad_listings(id,user_id,title,campus,location,price,utilities,bedrooms,bathrooms,lease_term,available_from,description) values('${listing}','${ids[0]}','A lovely room','Busch','Piscataway',900,50,2,1,'Academic year','2027-01-01','A real description long enough to describe a home.');`,
);
assert.equal(await count(ids[1], "pad_listings"), 1);
assert.equal(await count(ids[2], "pad_listings"), 0);
assert.equal(await count(ids[3], "pad_listings"), 0);
await assert.rejects(() => count(null, "pad_listings"), /permission denied/);
await assert.rejects(
  () => as(ids[1], `insert into pad_saves values('${ids[0]}','${listing}')`),
  /row-level security/,
);
await as(
  ids[0],
  `insert into pad_saves values('${ids[0]}','${listing}'); insert into pad_plans values('${ids[0]}','{"private":"plan"}');`,
);
assert.equal(await count(ids[1], "pad_saves"), 0);
assert.equal(await count(ids[1], "pad_plans"), 0);
await as(ids[1], `delete from pad_listings where id='${listing}'`);
assert.equal(await count(ids[0], "pad_listings"), 1);
await as(
  ids[1],
  `insert into pad_roommates values('${ids[1]}','Private Member','Biology','Busch',1000,'Early bird','Very tidy','Quiet home','A private profile long enough for the database.',false);`,
);
assert.equal(await count(ids[0], "pad_roommates"), 0);
assert.equal(await count(ids[1], "pad_roommates"), 1);
await assert.rejects(
  () =>
    as(
      ids[0],
      `insert into pad_connections(from_user,to_user,target_label,note) values('${ids[0]}','${ids[1]}','spoofed','Hello, can we connect?')`,
    ),
  /unavailable/,
);
await as(
  ids[1],
  `update pad_roommates set is_visible=true where user_id='${ids[1]}'`,
);
await assert.rejects(
  () =>
    as(
      ids[1],
      `update pad_roommates set user_id='${ids[0]}' where user_id='${ids[1]}'`,
    ),
  /row-level security/,
);
await as(
  ids[1],
  `insert into pad_connections(from_user,to_user,target_listing,target_label,note,status) values('${ids[1]}','${ids[0]}','${listing}','Forged label','Hello, interested in your home.','accepted')`,
);
let r = await as(ids[1], "select id,target_label,status from pad_connections");
const cid = r[0].rows[0].id;
assert.equal(r[0].rows[0].target_label, "A lovely room");
assert.equal(r[0].rows[0].status, "pending");
assert.equal(
  (await as(ids[1], `select pad_connection_email('${cid}') as email`))[0]
    .rows[0].email,
  null,
);
assert.equal(await count(ids[4], "pad_connections"), 0);
await as(
  ids[1],
  `update pad_connections set status='accepted' where id='${cid}'`,
);
assert.equal(
  (await as(ids[0], `select status from pad_connections where id='${cid}'`))[0]
    .rows[0].status,
  "pending",
);
await assert.rejects(
  () =>
    as(
      ids[0],
      `update pad_connections set note='Message overwritten' where id='${cid}'`,
    ),
  /permission denied/,
);
await as(
  ids[0],
  `update pad_connections set status='accepted' where id='${cid}'`,
);
assert.equal(
  (await as(ids[1], `select pad_connection_email('${cid}') as email`))[0]
    .rows[0].email,
  "a@rutgers.edu",
);
assert.equal(
  (await as(ids[0], `select pad_connection_email('${cid}') as email`))[0]
    .rows[0].email,
  "b@scarletmail.rutgers.edu",
);
assert.equal(
  (await as(ids[4], `select pad_connection_email('${cid}') as email`))[0]
    .rows[0].email,
  null,
);
await db.exec("reset role");
await db.query("update auth.users set banned_until=$1 where id=$2", [
  "2099-01-01",
  ids[0],
]);
assert.equal(
  (await as(ids[1], `select pad_connection_email('${cid}') as email`))[0]
    .rows[0].email,
  null,
);
assert.equal(await count(ids[0], "pad_listings"), 0);
await db.exec("reset role");
const advisors = await db.query(
  "select tablename from pg_tables where schemaname='public' and tablename like 'pad_%' and not rowsecurity",
);
assert.equal(advisors.rows.length, 0);
const funcs = await db.query(
  "select proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and prosecdef",
);
assert.equal(funcs.rows.length, 0);
await db.exec("set role supabase_auth_admin");
let hook = await db.query(
  `select private.pad_before_user_created($1::jsonb) as result`,
  [JSON.stringify({ user: { email: "bad@another.edu" } })],
);
assert.equal(hook.rows[0].result.error.http_code, 403);
hook = await db.query(
  `select private.pad_before_user_created($1::jsonb) as result`,
  [JSON.stringify({ user: { email: "new@scarletmail.rutgers.edu" } })],
);
assert.deepEqual(hook.rows[0].result, {});
await db.exec("reset role");
await db.close();
console.log(
  "PASS: database migration, membership, ownership, private plans/saves, hidden profiles, consent, contact RPC, sender/recipient permissions account revocation, signup restriction and private Storage.",
);
