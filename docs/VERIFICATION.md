# Verification — October 22, 2026

## Automated checks

- Clean `npm ci`: successful; dependency audit reports zero known vulnerabilities.
- `npm run build`: strict TypeScript and production Vite bundle pass. Maps are split into lazy chunks.
- `npm test`: email-domain spoof rejection, combined filters and immutable price sorting pass.
- PGlite executes the actual v2 migration in PostgreSQL and tests confirmed Rutgers membership, rejection of outsider/unconfirmed/anonymous access, ownership, private saves/plans, hidden roommate profiles, anti-spoofed connection targets, sender/recipient permissions, accepted-contact access, changed-email revocation, the signup hook and RLS on all v2 public tables.
- `git diff --check`: passes.

## Browser checks

Production build tested with Playwright in isolated headless Chromium. Desktop layout inspected at 1440px, mobile at 390px, and narrow layout at 320px.

Verified: combined campus/text filters and empty/reset states; saved-home persistence after reload; two-home comparisons and estimated totals; planner group/checklist persistence; map pins opening details; repeated map/detail/grid transitions without runtime errors after fixing animation cleanup; guest sign-in gating; rejection of non-Rutgers addresses; honest unavailable-backend handling for allowed addresses; mobile navigation and roommate connection gating. No horizontal overflow on tested home, roommate and planner layouts after fixing the planner grid minimum width.

Axe-core 4.10.3 WCAG 2 A/AA and 2.1 AA scans reported zero violations on the explorer, roommates, shortlist, planner, resources, inbox and sign-in dialog. Contrast and small-screen layout findings were corrected. Automated accessibility checks do not replace a full assistive-technology audit.

## Boundaries

No hosted Supabase project was accessible through the connector, so hosted PostgREST, actual SMTP delivery, live multi-account sessions and approved Rutgers SSO remain unverified. PGlite tests validate the SQL authorization logic; they do not simulate the complete hosted Auth service. The private preview serves fictional sample data and does not contain student records or live member data.
