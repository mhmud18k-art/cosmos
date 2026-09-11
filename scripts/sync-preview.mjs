/**
 * Regenerates the planet-rendering code embedded in preview.html from
 * src/lib/planet-texture.ts.
 *
 *   npm run sync-preview
 *
 * preview.html is a standalone no-build page, so it cannot import the module
 * the app uses. Rather than keeping a hand-written second copy in sync (which
 * is how the two drifted apart before), this transpiles the real source and
 * splices it in between the markers below. Edit planet-texture.ts, run this,
 * and the preview matches the app exactly.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Each region is replaced wholesale between its markers. `sources` are
 * transpiled and concatenated in order.
 */
const REGIONS = [
  {
    start: "/* >>> generated: planet-texture <<< */",
    end: "/* >>> end generated <<< */",
    sources: ["src/lib/planet-texture.ts"],
  },
  {
    start: "/* >>> generated: content <<< */",
    end: "/* >>> end content <<< */",
    // Data and copy, so the preview shows the same planets and the same
    // sentences as the app rather than a stale hand-typed subset.
    sources: ["src/i18n/strings.ts", "src/data/planets.ts", "src/data/timeline.ts"],
  },
];

function transpile(relPath) {
  const source = readFileSync(join(ROOT, relPath), "utf8");
  let js = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
    },
  }).outputText;

  // preview.html loads a classic script, not an ES module, so the declarations
  // have to end up as plain top-level bindings.
  js = js.replace(/^export (const|function|type) /gm, "$1 ");
  js = js.replace(/^export \{[^}]*\};?\s*$/gm, "");

  if (/\bexport\b/.test(js)) {
    console.error(`Unhandled \`export\` left after transpiling ${relPath}:`);
    console.error(js.split("\n").filter((l) => /\bexport\b/.test(l)).join("\n"));
    process.exit(1);
  }
  if (/^\s*import\b/m.test(js)) {
    console.error(
      `${relPath} has a runtime import. Only \`import type\` can be inlined here.`
    );
    process.exit(1);
  }
  return js;
}

const htmlPath = join(ROOT, "preview.html");
let html = readFileSync(htmlPath, "utf8");
let total = 0;

for (const region of REGIONS) {
  const a = html.indexOf(region.start);
  const b = html.indexOf(region.end);
  if (a === -1 || b === -1) {
    console.error(`Could not find the ${region.start} / ${region.end} markers.`);
    process.exit(1);
  }

  const js = region.sources.map(transpile).join("\n");
  total += js.length;

  html =
    html.slice(0, a + region.start.length) +
    `\n/* Generated from ${region.sources.join(", ")} — do not edit here. */\n` +
    js +
    "\n" +
    html.slice(b);
}

writeFileSync(htmlPath, html);
console.log(`preview.html updated (${(total / 1024).toFixed(1)} KB of generated code)`);
