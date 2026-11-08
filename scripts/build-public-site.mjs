import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const build = spawnSync(process.execPath, ["node_modules/vinext/dist/cli.js", "build"], {
  cwd: root,
  env: { ...process.env, IMPONIX_BUILD_TARGET: "static" },
  stdio: "inherit",
  windowsHide: true,
});
if (build.status !== 0) process.exit(build.status ?? 1);
const check = spawnSync(process.execPath, ["scripts/verify-public-site.mjs"], {
  cwd: root, stdio: "inherit", windowsHide: true,
});
process.exit(check.status ?? 1);
