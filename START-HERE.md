# Six Paths Smart-House website

This bundle contains the website recreated from SixPathsSmartHouse-release.apk.

## Included files

- source/: complete React, TypeScript and Vinext project, original brand assets and fonts, sample property photos, database schema and migration, and verification checks.
- deployment/sixpaths-smart-house.tar.gz: the built deployment package used for the published website.

## Run or edit the project

1. Extract this ZIP and open the source folder.
2. Install Node.js 22.13 or later.
3. Run npm ci to install the dependencies.
4. Run npm run dev for development, or npm run build for a production build.
5. Configure and apply the included D1 database migration when deploying on a compatible Cloudflare Workers host.

The website uses a server and a database. Its saved workspace requires the DB binding and the migration in source/drizzle/. The .openai/hosting.json file preserves the existing Sites identity.

The source/README.md contains implementation details and the test command.

## Demo scope

Includes searchable homes, property details, calculators, interest requests and owner, tenant, provider and admin demonstration views. Workspace records are stored in D1.

Listings and account personas are sample data. Payments are simulated. Live payment processing, bank payouts, external messaging and identity verification are not connected.

No dependencies, private credentials or live database records are included in this download.
