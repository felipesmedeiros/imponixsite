import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', env: process.env });
  if (result.status !== 0) process.exit(result.status || 1);
}
run(['scripts/sync-observatories.mjs', process.argv[2] || 'all']);
run(['scripts/build-observatories.mjs']);
run(['--test', 'tests/observatory.test.mjs']);
run(['node_modules/vinext/dist/cli.js', 'build']);
console.log('Observatory code synchronized, tested and built. Review and push the source changes through the existing Cloudflare Git build. Cloud history was not imported or reset.');
