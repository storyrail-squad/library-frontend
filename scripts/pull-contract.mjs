#!/usr/bin/env node
// Copies the backend's API contract into contract/openapi.yaml.
// The backend repo owns the contract; this repo keeps a pinned copy that CI compares on every build.
// Usage: npm run contract:pull   (CONTRACT_URL=<raw URL> to use another source)
import { writeFile } from 'node:fs/promises';

const url =
  process.env.CONTRACT_URL ??
  'https://raw.githubusercontent.com/storyrail-squad/library-backend/main/docs/api/openapi.yaml';

const res = await fetch(url);
if (!res.ok) {
  console.error(`Could not fetch the contract (${String(res.status)}) from ${url}`);
  process.exit(1);
}
await writeFile(new URL('../contract/openapi.yaml', import.meta.url), await res.text());
console.log(`contract/openapi.yaml updated from ${url}`);
