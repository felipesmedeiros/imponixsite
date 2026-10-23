# Private Observatory

The website Worker handles `/observatory` and all its child routes before the
public website router. Dashboard assets are embedded in the Worker, outside the
public asset directory. History is read from `OBSERVATORY_DB`; builds and source
synchronization never import or replace database contents.

## Connection and security

- `cloudflare.json` contains the account and existing D1 database identifiers.
  Vite emits the `OBSERVATORY_DB` binding in `dist/server/wrangler.json`.
- `access.json` contains the existing Access team's domain, application audience,
  and the sole allowed email, `imponixgamestudio@gmail.com`. These identifiers are
  public configuration, not API credentials.
- Every private page, script, API and export verifies the Access JWT signature
  against the team's HTTPS JWKS, plus issuer, audience, validity times and email.
  An email header alone cannot grant entry. Missing/invalid tokens fail closed.
- The existing Access application must cover `imponix.com/observatory` and its
  descendants. The Worker adds its own verification for alternate entry points.
- Responses prohibit caching and indexing. Writes require a matching Origin.
- `OBSERVATORY_LOCAL_DEV=1` is accepted only on loopback hosts. The preview helper
  sets it in memory; it is deliberately absent from deployment configuration.

This follows [Cloudflare's JWT validation guidance](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).

## Local verification without publication

Build and run the security/storage tests:

```powershell
node node_modules/vinext/dist/cli.js build
node --test tests/observatory.test.mjs
```

Run the built website in Cloudflare's local workerd runtime and D1 emulator,
using the exact backup set already verified after the production D1 import:

```powershell
npm run observatory:preview -- --backup .observatory-data/backups/2026-10-23T14-23-12.299Z-6275b5c2 --check
```

Omit `--check` to keep the preview at `http://127.0.0.1:4191/observatory/` open
until Ctrl+C. Port 4190 is a restricted browser/Fetch port and must not be used.
The helper uses Miniflare supplied with Wrangler and enumerates the production
build's modules explicitly, including its dynamic imports.

The helper requires a validated manifest and matching `d1-verification.json`.
It verifies hashes, imports only into disposable local D1, checks the 28 GSC,
40 NOEMA and 12 Photoncytosis Demo snapshots, compares complete API/JSON/CSV
exports with source data, and rechecks all five original archives byte for byte.
The full edition has no source history; reading it shows an empty state without
inserting a row. Its first explicitly requested download/report can start one.
Missing histories for the other editions remain errors.

Signed authentication tests use ephemeral local keys with the real application
configuration. They check accepted owner tokens, rejected outsiders, wrong
audiences, expired tokens and unauthenticated requests. This does not constitute
a real Cloudflare email/PIN sign-in, which must be checked after publication.
External downloads are blocked in this preview; it does not contact Steam or
modify the production database. Local D1 is discarded when the preview stops.
Results go to ignored `.observatory-data/local-test-report.json`.

[Cloudflare documents the separation between local and production D1](https://developers.cloudflare.com/d1/best-practices/local-development/).
No remote binding or `--remote` option is used here.

## Publication boundary

These settings are prepared locally. Building and previewing do not attach a
binding to the deployed Worker. A separately authorized publication is needed
before the live website can serve these observatories. Do not enable the local
development flag in Cloudflare. Do not repeat the history import during builds
or deployment; the existing production D1 histories and archives must remain.

Source synchronization reads the canonical game tools and copies only their
application code/assets, excluding `.data`. Cloud copy/API-path adaptations
belong in `scripts/sync-observatories.mjs` so later updates retain them.
