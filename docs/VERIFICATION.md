# Verification — October 22, 2026

## Build and local checks

`npm ci`, strict TypeScript/production build, business-rule tests and actual PostgreSQL/PGlite policy tests pass. The migration fixtures cover both the original v2 schema and production membership/private Storage additions. The dependency audit reports zero known vulnerabilities.

## Actual Supabase integration

The project `wgsqvddfdrebmajgjklp` was inspected before changes: it was healthy and empty. All three tracked migrations are applied and match remote history. All five member tables have RLS. A private photo bucket enforces MIME/size and ownership rules.

`scripts/live-smoke.mjs` was executed against hosted Auth, PostgREST and Storage using two temporary synthetic accounts. It verified:

- Actual authentication sessions and rejection of anonymous Data API reads.
- Listing creation, member reading and owner updates.
- Private photo upload, signed URLs and an actual successful image download.
- Ownership and privacy of plans and saved homes.
- Hidden roommate profiles, opt-in visibility and connection creation.
- Server-derived connection targets, sender/recipient authorization and consent-based email access.

No verification emails were sent to synthetic addresses. Admin keys remained in process memory. Temporary records, accounts, photos and local test sessions are removed after testing.

## Browser verification

Playwright uses isolated Chromium against the production build. Member sessions load actual hosted data rather than a mock API. Browser checks cover private contact access, listing publishing with a real file upload and neighborhood pin, private-image rendering, listing removal/photo cleanup, persistence, maps, forms and mobile navigation. A first image assertion ran before the download completed; waiting for image completion confirmed the actual 1100px image loaded correctly.

The previous app's combined filtering/comparison/planner checks continue to pass. Responsive checks cover 1440px desktop, 390px mobile and 320px narrow layouts. README images are new, cropped browser captures. Example worksheet values do not represent real students or official outcomes.

Axe-core 4.10.3 is used for automated WCAG A/AA checks; automation does not replace a full assistive-technology audit.

## Service advisories

No RLS or private Storage security findings were reported. Supabase reports that project-level leaked-password protection is disabled; the application uses passwordless email sign-in. If password-based login is introduced, review [Supabase password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) first. The missing saved-listing foreign-key index was added. Newly created unused indexes are retained for their intended queries.

## Remaining boundary

SMTP delivery to real Rutgers inboxes has not been verified and requires a production sender configured in the dashboard. The app never bypasses email confirmation. Official Rutgers SSO/current-student affiliation is not configured or claimed.
