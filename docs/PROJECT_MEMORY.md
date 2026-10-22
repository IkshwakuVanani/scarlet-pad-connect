# Scarlet Pad — project memory

## User intent

Rebuild the September 2025 Lovable project from the ground up, retaining its core purpose: excellent housing discovery and connections for Rutgers students, Rutgers-restricted membership, and a clean, considered interface. The user authorizes feature and design decisions. This file is durable repository memory, not a claim of cross-chat assistant memory.

## Original repository audit

Source: IkshwakuVanani/scarlet-pad-connect, main at 1602849375893f35b2531be4aef161533bb43d2d. Created September 15, 2025 Eastern; last pushed September 16, 2025 Eastern. Original implementation remains in Git history.

- React 18 / Vite / TypeScript / shadcn / Tailwind; Supabase auth, Postgres and image storage; Google Maps experiments; Stripe edge functions. Lovable README and development tagging.
- Identity: email/password, user-supplied NetID, client validation of **any** .edu domain. No institutional SSO or student enrollment verification. Claims of Rutgers/student verification were broader than implementation.
- Discovery: off-campus rental listings with monthly rent, campus, address, beds/baths, lease term, availability, amenities, bus routes, image uploads, search and two overlapping filter systems. Listing create/details/delete and owner profile pages.
- Roommates: people sharing listing interests; no lifestyle compatibility model. Profile visibility and interest visibility policies evolved incompatibly. Profiles included email/NetID without a dedicated public profile projection.
- Maps: API-key prompt in user interface, hardcoded/approximate locations, unfinished detail navigation.
- Payments: rent, deposits, application fees, promoted listings and subscriptions; hardcoded Stripe price IDs and client-provided amounts. No webhook implementation confirming final payment; success page trusted its redirect. Recurring schedules and transaction tables existed, but a complete rent collection / Stripe Connect flow did not.
- Marketing: student-built, safe student community, transparency and roommate connections. About/help/privacy/terms claimed capabilities inconsistently; terms said the platform did not handle rental payments despite the payment UI.
- Missing: reliable Rutgers-only server enforcement, genuine student/NetID verification, chat, full applications, accurate live campus allocation data, documented year-specific housing rules, saved comparisons, genuine listing review, moderation, production operational setup and meaningful tests.
- Database history contains invalid PostgreSQL `CREATE POLICY IF NOT EXISTS` statements and repeated policy definitions. Do not replay the old migration directory to initialize a fresh database.

## Rebuild decisions

Scarlet Pad is an independent Rutgers–New Brunswick housing companion with two complementary jobs: discover off-campus housing/roommates and prepare for on-campus selection. It never claims to allocate university rooms or predict guaranteed selection outcomes.

Fresh UI: warm paper background, scarlet identity, editorial type hierarchy, house photography, persistent sidebar, campus chips, responsive cards and a focused right-hand guide. Replaced the old active application and removed Lovable tools/dependencies. Original intent is retained here and in Git, rather than carrying misleading legacy behavior into the new app.

Features: combined search/filter/sort, grid/geographic map, saved homes, side-by-side comparisons, saved searches, listing details and creation, opt-in roommate lifestyle cards and profile editing, consent-based connection requests/inbox, planner and a practical resource library. Demo is explicitly labeled with fictional inventory and browser-local saves; it cannot access live member data or publish/contact anyone. Production member data comes exclusively from Supabase after sign-in.

Authentication: confirmed Rutgers email access via passwordless magic links; exact allowed domains `rutgers.edu` and `scarletmail.rutgers.edu`. Optional institution-approved SAML SSO through a configured Supabase provider. Email ownership does **not** establish current student enrollment; neither a typed NetID nor a generic .edu address grants access. Official student-affiliation verification requires Rutgers cooperation and claim mapping before making that claim. Member-only database policies independently check confirmed email from auth.users. No secret/service-role key belongs in Vite.

Payments: removed from active product. Retire previously deployed legacy payment functions during launch. Future payments need recipient onboarding, approved commercial terms, amount validation, signed webhooks, idempotency, refunds and reconciliation before reintroduction.

## Verified external context (October 21, 2026)

- Rutgers continuing housing: https://ruoncampus.rutgers.edu/housing-information/continuing-student-housing
  The published 2026–27 process uses group size, seniority points, then the lowest group selection number. Singles use earned credits. Initial applications, housing-type applications and actual selection are distinct. Published 2026 deadlines are past; do not present them as upcoming 2027 deadlines. The planner records personal tasks and scenarios, not an official ranking or probability.
- Rutgers IAM: https://it.rutgers.edu/identity-and-access-management/ and https://it.rutgers.edu/identity-and-access-management/central-authentication-service/
  CAS and Shibboleth are institutional integration paths. A third-party developer cannot simply turn on approved Rutgers NetID access without registration.
- Supabase docs: https://supabase.com/docs/reference/javascript/auth-signinwithotp and https://supabase.com/docs/guides/database/postgres/row-level-security
  Restrict auth and data on the server; do not trust editable user metadata for authorization. Check current docs/changelog when extending integration.

## Next-stage roadmap

1. Connect an owned Supabase environment, apply and verify v2 schema, configure SMTP and callback allowlist, and smoke-test with two consenting Rutgers accounts.
2. Register approved institutional SSO and require a trusted current-student affiliation claim for strict enrolled-student membership.
3. Recruit legitimate listing posters and moderation staff; add report/block and review workflows before public recruitment. No fabricated verified listings, members, counts, reviews or availability.
4. Add private image uploads with validation, message threads, configurable annual Rutgers calendars and official building data under suitable usage permissions.
5. Add verified availability and safety tools with an explicit review process. Keep financial flows out until properly implemented.
