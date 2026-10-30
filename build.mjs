// Builds the two deploy files from the readable source in src/.
//
//   node build.mjs            -> dist/personal/index.html and dist/community/index.html
//
// What it does:
//   - puts the styles and scripts from src/css and src/js into src/page.html
//   - bundles third-party libraries marked <!-- @lib:NAME --> (the label QR library), so the page works offline
//   - writes sw.js next to each page (the offline copy, from src/sw.js)
//   - scrambles (minifies) them, keeping the /*! © Korah Peptides */ notices
//   - sets COMMUNITY to false (personal) or true (community); code behind the other value is dropped
//   - keeps <!-- @personal -->…<!-- @end --> only in the personal file,
//     and <!-- @community -->…<!-- @end --> only in the community file
//   - stamps the build number, date and note from version.json
//
// Cloudflare runs this on every push (see README.md), so nobody uploads files by hand.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { transformSync } from "esbuild";

const root = new URL(".", import.meta.url).pathname;
const read = (p) => readFileSync(root + p, "utf8");
const ver = JSON.parse(read("version.json"));

// The page's scripts share one set of top-level names. A name declared twice (in one file or across files)
// silently replaces the first; b78 did this to DS() and broke the protocol-form draft. Parsing all the
// scripts together as one module turns that into a build error.
{
  const names = [...read("src/page.html").matchAll(/<!-- @js:([a-z]+) -->/g)].map((m) => m[1]);
  const all = names.map((n) => read(`src/js/${n}.js`)).join("\n;\n");
  // esbuild allows two functions with one name, so check those directly (top-level ones start a line)
  const seen = new Map(),
    twice = [];
  for (const n of names)
    for (const m of read(`src/js/${n}.js`).matchAll(/^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/gm))
      seen.has(m[1]) ? twice.push(`${m[1]} (${seen.get(m[1])}.js and ${n}.js)`) : seen.set(m[1], n);
  if (twice.length) throw new Error("Top-level function declared twice: " + twice.join(", "));
  try {
    transformSync(all, {
      loader: "js",
      format: "esm",
      define: { COMMUNITY: "false", __BUILD_STAMP__: '""', __BUILD_NOTE__: '""' },
    });
  } catch (e) {
    const dup = (e.errors || []).filter((x) => /already been declared/.test(x.text));
    if (dup.length) throw new Error("Top-level name declared twice:\n" + dup.map((x) => "  " + x.text).join("\n"));
  }
}

function build(variant) {
  const community = variant === "community";
  const stamp = `${ver.date} · b${ver.build} ${variant}`;
  let page = read("src/page.html");

  page = page.replace(/<!-- @(personal|community) -->([\s\S]*?)<!-- @end -->/g, (_, who, body) =>
    who === variant ? body : "",
  );

  page = page.replace(/<!-- @css:([a-z]+) -->/g, (_, name) => {
    const css = transformSync(read(`src/css/${name}.css`), { loader: "css", minify: true, legalComments: "inline" }).code;
    return `<style>${css.trim()}</style>`;
  });

  page = page.replace(/<!-- @js:([a-z]+) -->/g, (_, name) => {
    const js = transformSync(read(`src/js/${name}.js`), {
      loader: "js",
      minify: true,
      legalComments: "inline",
      target: "es2020",
      // Plain browser scripts that share global names between them: never rename top-level names.
      format: undefined,
      define: {
        COMMUNITY: String(community),
        __BUILD_STAMP__: JSON.stringify(stamp),
        __BUILD_NOTE__: JSON.stringify(ver.note),
      },
    }).code;
    // "</script" inside a string would end the tag early.
    if (/<\/script/i.test(js)) throw new Error(`src/js/${name}.js contains "</script"`);
    return `<script>${js.trim()}</script>`;
  });

  // Third-party libraries, bundled into the page so it works offline (b77). Licence comments are kept.
  page = page.replace(/<!-- @lib:([a-z-]+) -->/g, (_, name) => {
    const lib = {
      qrcode: ["node_modules/qrcode-generator/qrcode.js", "qrcode-generator 1.4.4 · Copyright (c) 2009 Kazuhiko Arase · MIT licence"],
    }[name];
    if (!lib) throw new Error(`unknown library ${name}`);
    const [src, notice] = lib;
    const js = `/*! ${notice} */` + transformSync(read(src), { loader: "js", minify: true, legalComments: "inline", target: "es2020" }).code;
    if (/<\/script/i.test(js)) throw new Error(`${src} contains "</script"`);
    return `<script>${js.trim()}</script>`;
  });

  if (/@(css|js|lib|personal|community|end)\b/.test(page.replace(/<!--[^@][\s\S]*?-->/g, "")))
    throw new Error("a build marker was left in the page");

  mkdirSync(root + `dist/${variant}`, { recursive: true });
  writeFileSync(root + `dist/${variant}/index.html`, page);
  // Offline copy (b77): the page is fetched fresh when online and served from the cache when not.
  const sw = transformSync(read("src/sw.js"), {
    loader: "js",
    minify: true,
    target: "es2020",
    define: { __CACHE__: JSON.stringify(`kl-b${ver.build}-${variant}`) },
  }).code;
  if (/__CACHE__/.test(sw)) throw new Error("sw.js cache name not filled in");
  writeFileSync(root + `dist/${variant}/sw.js`, sw);
  console.log(`dist/${variant}/index.html  ${stamp}  ${(page.length / 1024).toFixed(0)} KB`);
}

const only = process.argv[2];
for (const v of ["personal", "community"]) if (!only || only === v) build(v);
