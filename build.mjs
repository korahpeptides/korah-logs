// Builds the two deploy files from the readable source in src/.
//
//   node build.mjs            -> dist/personal/index.html and dist/community/index.html
//
// What it does:
//   - puts the styles and scripts from src/css and src/js into src/page.html
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

  if (/@(css|js|personal|community|end)\b/.test(page.replace(/<!--[^@][\s\S]*?-->/g, "")))
    throw new Error("a build marker was left in the page");

  mkdirSync(root + `dist/${variant}`, { recursive: true });
  writeFileSync(root + `dist/${variant}/index.html`, page);
  console.log(`dist/${variant}/index.html  ${stamp}  ${(page.length / 1024).toFixed(0)} KB`);
}

const only = process.argv[2];
for (const v of ["personal", "community"]) if (!only || only === v) build(v);
