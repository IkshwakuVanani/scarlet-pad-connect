import { mkdir, readFile, writeFile } from "node:fs/promises";
// Directory indexes keep deep links usable on plain static hosts as well as SPA hosts.
const html = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
for (const route of [
  "roommates",
  "saved",
  "planner",
  "resources",
  "inbox",
  "auth/callback",
]) {
  const directory = new URL(`../dist/${route}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), html);
}
