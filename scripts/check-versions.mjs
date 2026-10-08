import { readFile, writeFile } from "node:fs/promises";
const pkg = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
const rows = await Promise.all(
  Object.entries(dependencies).map(async ([name, installed]) => {
    const response = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(name)}/latest`,
    );
    if (!response.ok)
      throw new Error(`Registry check failed: ${name} (${response.status})`);
    const data = await response.json();
    return {
      package: name,
      installed,
      latest: data.version,
      current: installed === data.version,
    };
  }),
);
console.table(rows);
await writeFile(
  new URL("../DEPENDENCY-VERSIONS.json", import.meta.url),
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      policy:
        "npm latest stable dist-tag; direct dependencies pinned exactly; transitive dependencies locked in package-lock.json",
      dependencies: rows,
    },
    null,
    2,
  ) + "\n",
);
if (rows.some((row) => !row.current)) process.exitCode = 1;
