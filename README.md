# Scarlet Pad

An independent housing and roommate companion for Rutgers–New Brunswick, rebuilt from the original Lovable project. Find off-campus homes, compare costs, meet prospective roommates, and prepare for on-campus selection in a coherent, responsive workspace.

[Open the private review](https://scarlet-pad-review-ikshwaku.fabled-crumb-5773.chatgpt.site) · [Desktop screenshot](docs/screenshots/desktop.png) · [Mobile screenshot](docs/screenshots/mobile.png)

## Run locally

Node 22.12+ and npm are required (Node 22.18+ recommended for the test runner).

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. With no environment variables, the app runs an explicitly labeled sample board. Sample homes, people, prices, photos and locations are fictional; no sample can be booked, published or contacted. Sample saves and planner data persist only in browser storage. Saved filter presets are device-local in both modes; they do not send email alerts.

```sh
npm test       # business rules and real PostgreSQL authorization tests in PGlite
npm run build # strict TypeScript + production Vite bundle
npm run preview
```

## Included

- Search by text, campus, rent budget, bedrooms, lease and amenities; sorting and OpenStreetMap neighborhood exploration.
- Private shortlists and up to three homes compared side by side, including estimated utilities.
- Authenticated listing creation and owner deletion; precise address is not required. An optional neighborhood pin places a home on the map without requiring an exact address. New listings use a neutral placeholder until private photo uploads are implemented.
- Opt-in roommate profiles with lifestyle preferences, campus and budget filters, and a pause-visibility setting.
- Consent-based connection requests and inbox. Rutgers email contact details are returned only for accepted requests to their participants.
- Personal housing checklist, group worksheet, selection appointment, persistence and text export.
- Practical housing resources and clear distinctions between this independent tool and Rutgers' official processes.

## Live community setup

No accessible Supabase project was available through the connected account during development. Hosted authentication, SMTP delivery and multi-account flows have **not** been tested against a live Supabase service. Database policies have been executed and tested in local PostgreSQL (PGlite).

1. Use an owned Supabase project. Review and run the single SQL file under `supabase/migrations`. It supports a fresh project and retains legacy records on upgrades while revoking legacy Data API grants. Historical migrations in `docs/legacy-migrations` are archival: they contain invalid/duplicate policies and must not be replayed on a fresh database.
2. Enable email confirmation and configure a production SMTP provider. In Auth Hooks, enable the **Before User Created** hook `private.pad_before_user_created`. Its configuration is included in `supabase/config.toml` for local Supabase. Hosted hook configuration must also be set in the dashboard. Keep anonymous sign-ins disabled. This hook rejects non-Rutgers new accounts; row policies independently reject nonmember access even if the hook is omitted.
3. Set Auth Site URL to the deployment origin and allowlist its `/auth/callback` URL. Development callback: `http://localhost:5173/auth/callback`. The PKCE magic link should be opened in the same browser that requested it.
4. Copy `.env.example` to `.env.local`, then provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Build again. These are browser configuration values, not secrets. Never use a secret or service-role key.
5. Test a complete login/logout sequence and listing, profile, connection acceptance and contact visibility using two consenting Rutgers accounts before opening community access.
6. If upgrading an existing hosted project, back up data first. Apply the v2 SQL once through the SQL editor or a reviewed migration process. Preserve/repair remote migration history separately; do not blindly reset the database. Retire old deployed `create-payment` and `create-subscription` functions; source stubs return 410, but modifying source does not disable an already deployed function. The v2 UI never calls them.

### Rutgers authentication means exactly what is enforced

Email membership requires a confirmed address at `rutgers.edu` or `scarletmail.rutgers.edu`. Policies look up the canonical Auth user, so a changed email or banned account loses access. Typed NetIDs, generic .edu addresses and editable user metadata cannot grant membership.

Email ownership **does not verify current student enrollment**. Strict current-student access needs an approved institutional integration with trusted affiliation claims. Optional SAML sign-in is wired through `VITE_RUTGERS_SSO_PROVIDER_ID`; configure a real institution-approved provider and map/validate trusted student claims before calling the service student-verified. Rutgers CAS is not impersonated or enabled by a cosmetic sign-in button.

## Deployment

The app produces static assets in `dist/`. Configure SPA fallback to `index.html` for `/saved`, `/planner`, `/roommates`, `/inbox`, `/resources` and `/auth/callback` (a `_redirects` file is supplied for hosts supporting it). Serve assets over HTTPS. Vite `VITE_*` variables must be present at **build time**, not added only to the static server afterwards.

External requests in sample mode are limited to Google Fonts and OpenStreetMap tiles; housing photography is served locally. For stricter privacy/offline use, self-host the fonts and disable the external basemap. No analytics or advertising SDK is included.

A GitHub Actions workflow runs tests and the production build. This replacement is developed on `codex/scarlet-pad-rebuild`; the original remains recoverable in main and Git history.

## Product memory and roadmap

See [project memory](docs/PROJECT_MEMORY.md), [launch notes](docs/LAUNCH.md) and [asset sources](docs/ASSETS.md). The app does not predict guaranteed Rutgers housing outcomes, verify properties, collect payments, or manufacture availability. Its planner deliberately avoids presenting past 2026 dates as upcoming 2027 deadlines.
