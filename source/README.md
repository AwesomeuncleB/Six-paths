# Six Paths Smart-House

A responsive web adaptation of the supplied Flutter Android application. It preserves the original Six Paths logo, Fraunces and Inter fonts, Kaduna sample property content, and owner, tenant, provider and admin workflows.

## Experience

- Browse homes by locality, monthly budget, bedrooms, rent-to-own eligibility, construction stage and amenities.
- Inspect property details and save interest requests. Smart Search translates supported words into listing filters; it does not call an AI service.
- Use editable rent-to-own, amortizing loan, affordability and utility-savings calculators.
- Manage properties and follow repairs from reporting through provider assignment, scheduling, completion and owner confirmation.
- Record simulated utility and repair payments; inspect demo providers, account records and platform settings.
- D1 stores workspace data. Version checks prevent stale saves and repeated completion/payment actions are rejected.

## Demo boundaries

The APK contains mock data and demo personas. This adaptation is a private demo, not a live property marketplace. Role selection changes the demonstration view, not authorization. Sites controls access to the private website.

No real payment gateway, bank payout, external messaging, provider identity verification, native account login, camera, or mobile push service is connected. Interest requests and notifications remain inside the workspace. The supplied APK is compiled native code; this is a web recreation rather than its original Flutter source.

Photos are the sample image URLs referenced by the APK and remain illustrative, with existing watermarks preserved. Listing descriptions and addresses are from the APK; some numeric sample values are reconstructed for the web demonstration.

## Development

Keep the existing package manager and lockfile. Run `npm run build` for the production Worker. `npm run db:generate` generates schema migrations. After a build, `node tests/workspace-smoke.mjs` checks page rendering, assets, D1 persistence, repair transitions, duplicate-payment protection, request validation, stale writes and calculator formulas using a temporary local database.

Worker runtime types are generated in `worker-configuration.d.ts`. The hosting manifest retains the Site identity and logical DB binding.
