import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.env.IMPONIX_PUBLIC_DIRECTORY || "dist/client");
const types = { ".html": "text/html; charset=utf-8", ".rsc": "text/x-component", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".zip": "application/zip" };
const server = createServer((request, response) => {
  let path;
  try { path = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400).end(); return; }
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
  if (/^\/(?:observatory|api)(?:\/|$)|(?:^|\/)\./.test(path)) { response.writeHead(404).end(); return; }
  const base = resolve(root, "." + path);
  if (base !== root && !base.startsWith(root + sep)) { response.writeHead(403).end(); return; }
  const candidates = request.headers.rsc === "1"
    ? [base + ".rsc", resolve(base, "index.rsc"), base]
    : [base + ".html", base, resolve(base, "index.html")];
  const target = candidates.find(file => existsSync(file) && statSync(file).isFile());
  const file = target || resolve(root, "404.html");
  response.writeHead(target ? 200 : 404, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-store", "Vary": "RSC" });
  if (request.method === "HEAD") response.end(); else createReadStream(file).pipe(response);
});
server.listen(Number(process.env.PORT || 3000), "127.0.0.1", () => console.log(`Public static preview: http://127.0.0.1:${server.address().port}/`));
