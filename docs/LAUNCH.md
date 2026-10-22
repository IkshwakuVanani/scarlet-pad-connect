# Launch notes

## Ready to review

Fresh application, local sample experience, strict TypeScript build, combined search/filtering, comparisons, local persistence, member data integration and database-level authorization. All source is preserved on a review branch, with original intent recorded in PROJECT_MEMORY.md.

## External configuration needed

- Owned Supabase project, v2 SQL, production SMTP and allowed callback URLs.
- Activate the Before User Created hook and require email confirmation.
- For actual enrolled-student verification, approved Rutgers SSO and trusted affiliation enforcement. Email-domain verification alone does not establish enrollment.
- Review the migration against an existing deployment before applying. Legacy tables are retained but no longer granted to API clients. Legacy image bucket becomes private and known old bucket policies are retired.
- Retire previously deployed payment functions; new source stubs return 410.
- Complete hosted end-to-end testing with two consenting members. Local PostgreSQL tests validate policy behavior but do not validate hosted PostgREST, SMTP or institutional identity.

## Before recruiting a public community

Add moderation/reporting/blocking and an operator support channel, account deletion requests, private image upload validation, listing expiry, abuse-rate limits and a reviewed privacy policy. The current deployment can be used privately for review; it is not a substitute for university housing allocation or a verified property marketplace.

## Deferred deliberately

Payments, financial reconciliation, full messaging threads, guaranteed housing odds, copied student records, fake verified listings, automatic alerts, official university data feeds and unattended live availability.
