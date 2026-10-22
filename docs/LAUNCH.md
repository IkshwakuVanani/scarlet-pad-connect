# Live deployment

Application: https://scarlet-pad-ikshwaku.fabled-crumb-5773.chatgpt.site
Supabase project: `wgsqvddfdrebmajgjklp` (`scarlet-pad-connect`, us-east-1).

The database migrations are applied, RLS is enabled on all member tables, the private photo bucket is configured, and Auth confirmation/signup restrictions/callback URLs are configured. The checked-in `.env.production` contains only browser-safe publishable configuration. The deployed artifact is built from this repository's application source, not the old standalone sample review.

## Remaining email-delivery setup

A production SMTP sender is required for students outside the Supabase project team to receive sign-in emails. Supabase's built-in email sender restricts recipients to project-team addresses. Configure a sender in [Supabase SMTP settings](https://supabase.com/dashboard/project/wgsqvddfdrebmajgjklp/auth/smtp-settings), then test delivery to a real Rutgers address in the same browser that requested the link. Do not disable confirmation to work around email delivery.

The user has been asked which provider to configure or to enter SMTP credentials securely in the dashboard. No SMTP password is stored in the repository or requested in chat. Database, Auth sessions and application flows have been verified using temporary synthetic accounts; that does not verify inbox delivery.

## Deploy elsewhere

`npm ci && npm run build` creates `dist/`. Vercel and Netlify configuration is included. The production configuration is build-time configuration; change the public Supabase project values only when deploying against a different owned project.

For a different hosting origin, update `auth.site_url` and `auth.additional_redirect_urls` in `supabase/config.toml`, review the diff, and push it through the authenticated CLI:

```sh
npx supabase config diff --project-ref wgsqvddfdrebmajgjklp
npx supabase config push --project-ref wgsqvddfdrebmajgjklp
```

Historical migrations under `docs/legacy-migrations` are archived, not part of a fresh database setup. Current migration filenames match hosted migration history. Review existing data before reusing the migration set for another project.

## Identity boundaries

Confirmed Rutgers email proves ownership of an allowed address. It does not prove current enrollment, official university endorsement, a landlord's legitimacy or property availability. Official NetID/current-student verification requires an approved institutional integration and trusted affiliation checks. Optional SAML integration is wired but is not represented as active.

## Later product work

Reporting/blocking and moderation workflows, self-service account deletion, listing expiry, email alerts and full message threads remain distinct future features. The current app supports housing discovery, posting/private photos, saves/comparisons, roommate profiles, consent-based introductions and personal planning. It does not process payments or allocate official university rooms.
