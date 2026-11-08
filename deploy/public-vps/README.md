# Public website on the VPS

The public site is exported with Vinext and served as static files by a separate
Caddy instance on `127.0.0.1:8081`. A dedicated Imponix Cloudflare Tunnel connects
the public domain. The VPS address is not added to public DNS or this repository.
Imponix has its own Unix users, directories, deployment key, service limits and
Tunnel credentials. The deployment has no database privileges or access to
other hosted applications and does not restart unrelated services.

## Push-to-main deployment

`.github/workflows/public-vps.yml` runs on pushes to `main` or an explicit manual
run of that branch. GitHub Actions installs the locked dependencies, runs
`npm run build:public`, checks every exported route, and packages only browser
assets, HTML, RSC navigation data and downloads. Build dependencies and server
bundles are not uploaded. Builds run on GitHub, not the shared VPS.

The three GitHub repository secrets are `IMPONIX_VPS_HOST`,
`IMPONIX_VPS_DEPLOY_KEY` and `IMPONIX_VPS_KNOWN_HOSTS`. The dedicated deployment
key is restricted by SSH to the fixed publication receiver. It grants no shell,
sudo, forwarding or database access. Host keys are verified against the existing
trusted server record; production never uses `ssh-keyscan` or disables checks.

The receiver independently verifies a signed GitHub OIDC identity for this exact
repository ID, main branch, workflow file, commit, event and archive digest. It
also checks that the commit is still current main. It validates archive paths,
file types, size limits and every file hash before switching `current` atomically.
Local HTTP checks include HTML, the deployed version and RSC navigation; failures
restore the old link. Five built releases and the preceding active release are
retained. Content-hashed JavaScript from older builds stays available to open tabs.

## Cloudflare services retained

The existing Cloudflare Builds integration continues publishing the original
Worker from the same `main`. Its Vite configuration explicitly retains routes:

- `imponix.com/observatory*`: dashboards, Access/JWT authentication and D1 history.
- `imponix.com/api/analytics*`: the existing first-party Analytics Engine events.
- `imponix.com/_vinext/image*`: compatibility for older optimized image URLs.

Google Analytics remains in the public HTML. The static build uses original
images. `downloads.imponix.com` and other separate subdomains are unchanged.
No database migration or Observatory-history import is part of this deployment.
The Observatory must remain protected by the existing Access application and
backend JWT checks throughout the cutover.

The public hostname points to the Tunnel, while path-specific Worker routes
intercept the retained services. The old full-host Worker Custom Domain must be
detached only after the static origin and retained routes have been verified.
Remove both root and www Custom Domain associations before assigning those DNS
names to the Tunnel. `www` redirects to the canonical HTTPS root, preserving URLs.
Do not change mail DNS, unrelated hostnames or Access policies.

## Static behavior

All 19 current public pages, their metadata and all press kits are exported.
The two Journal articles use canonical Imponix social-image URLs for export;
their normal Worker/local rendering still derives them from request headers.
The homepage YouTube feed is fetched at build time and refreshes on the next
deployment. It no longer polls server-side hourly on the static website.

Local verification: `npm run build:public`, then
`node scripts/preview-public-site.mjs` at `http://127.0.0.1:3000/`. The preview
excludes Observatory and API endpoints. To keep a packaged preview available
during a separate Worker build, set `IMPONIX_PUBLIC_DIRECTORY` to its staged
`work/public-release-*/site` directory. Run the unchanged Worker build and
`npm run observatory:test` to check the retained backend.

## Server preparation and operations

`prepare.sh --prepare <GitHub repository numeric ID>` installs reviewed templates
as root using a separately supplied `deploy.pub`. It prepares only Imponix users,
services and restricted SSH; it does not change DNS, start a Tunnel, install site
content, touch unrelated applications or publish the local checkout. Preserve existing keys on reruns.
Private state and credentials belong in `/etc/imponix`, outside the repository.

The locally managed Tunnel configuration uses credentials delivered by systemd
at `/run/credentials/imponix-tunnel.service/tunnel.json`, loopback metrics on
port 20242, root/www ingress to port 8081 and a final HTTP 404 rule. Only its
specific Tunnel credentials go to the VPS; the account management certificate
stays on the operator's machine.

Check `imponix-static` and `imponix-tunnel` with systemd; inspect their journal for
errors without logging credentials. Reloading or deploying Imponix does not
require restarting unrelated applications, databases or connectors.

For a public-site rollback, an operator can point `/srv/imponix/current` atomically
at a verified retained release and recheck its HTTP version/pages. Do not roll
back D1. A complete hosting rollback restores the prior Worker Custom Domain
associations/DNS after preserving the Tunnel configuration; keep the existing
Worker and its full asset build available until the migration is accepted.
