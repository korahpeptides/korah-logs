# Korah Logs

The peptide tracker (personal build "rpt" at rickspeptidetracker.rdguindon.workers.dev, community build "cpt" at peptide-tracker.rdguindon.workers.dev, also reachable at app.korahpeptides.com while that domain exists) and the `protocol-ai` Worker behind its Insights tab.

## How it works

- **`src/`** is the readable code. It is the only thing anyone edits.
  - `src/page.html` is the page shell. `<!-- @css:NAME -->` and `<!-- @js:NAME -->` mark where `src/css/NAME.css` and `src/js/NAME.js` go.
  - `src/js/app.js` is the main app. It was recovered from the scrambled b67 file, so most names are short (glossary below).
  - `src/js/labs.js` is the Labs tab and `src/js/insights.js` is the Insights tab. Both have readable names.
- **`build.mjs`** makes `dist/personal/index.html` and `dist/community/index.html`. It scrambles the code and keeps the `/*! © Korah Peptides */` notices.
- **One source, two builds.** `COMMUNITY` is `false` in the personal build and `true` in the community build. Code behind the other value is dropped. In `page.html`, `<!-- @personal -->…<!-- @end -->` appears only in the personal file and `<!-- @community -->…<!-- @end -->` only in the community file.
  - **The community build has no:** label QR code, lot line or CoA link field (`Pn`, the label drawing, the label form); QR library; Insights tab.
  - **The community build has:** "Medications at the time" instead of "Statin / ezetimibe"; the Cloudflare Web Analytics tag.
- **`version.json`** holds the build number, date and note shown at the bottom of the side menu and in Settings → Version. Bump it with every change. Personal and community always share a number.
- **Deploys are automatic.** Three Workers are connected to this repo in Cloudflare (Workers Builds). A push to `main` rebuilds and deploys all three:

| Worker | Address | Build command | Deploy command |
|---|---|---|---|
| `rickspeptidetracker` | rickspeptidetracker.rdguindon.workers.dev | `npm run build` | `npx wrangler deploy --config wrangler.personal.jsonc` |
| `peptide-tracker` | peptide-tracker.rdguindon.workers.dev (+ app.korahpeptides.com, attached in the dashboard) | `npm run build` | `npx wrangler deploy --config wrangler.community.jsonc` |
| `protocol-ai` | protocol-ai.rdguindon.workers.dev | (none) | `npx wrangler deploy --config wrangler.ai.jsonc` |

- **Kept independent of korahpeptides.com.** The wrangler files set no custom domains, so deploys never depend on that domain. Don't add korahpeptides.com routes back to them.
- **`protocol-ai` secrets** live in Cloudflare under Settings → Runtime → Variables and Secrets: `APP_KEY` (matches the access key typed into Insights) and `ANTHROPIC_API_KEY`. It only forwards the fields the app uses. It accepts `claude-haiku-5-5` (the default) or `claude-sonnet-5-5`, and caps the reply length.

## Before every push

```
npm ci
npm test        # builds both files, runs tools/test.py on both (headless) and tools/test-worker.mjs
```

`tools/test.py` needs Python Playwright with Chromium (`pip install playwright && python3 -m playwright install chromium`). It uses fake data and a fake AI service.

## Insights: who decides what

- **The app decides** the flags (`insProtoFlags`, `insLabFlags`, `insHomeFlags`), their order and ids (`insSortFlags`), the rating (`insProtoRating`, `insLabRating`) and each compound's stage (`insStage`). The same data always gives the same flags and rating.
- **Routine flags carry fixed wording** (`note`): missed and extra doses, logging gaps, compounds not on a protocol. They are never sent to the AI.
- **The AI only writes:** an explanation for each remaining flag (`flag_notes`, matched by id), the headline, summary, overlaps, lab notes, recommendations, and compound write-ups.
- **Compound write-ups are saved and reused.** They live in `d.insGuides`, keyed by compound, dose, route, blend and stage, and are synced. The AI is asked only for ones not saved yet (`compound_guides_needed`). Each report keeps its own copy (`rep.guides`), so old reports don't change. Settings in Insights has a button to clear them.
- Requests go out with `temperature: 0`. If the service refuses that setting, the app retries without it.

## Rules (carried over from the old build log)

1. Any new data list must be added to both `l()` (empty state) and `Fn` (sync list), or the next sync wipes it.
2. `Ua()` redraws the page and scrolls to the top. `Ua(1)` keeps the scroll position and skips the redraw while a box is being typed in. Anything that runs on its own (not from a tap) uses `Ua(1)`.
3. Never put lab results or any personal data in the code. The page is public.
4. Never spread a large array into a function call (`fn(...big)`, `Math.max.apply(null, big)`). It broke sync at b58.
5. A protocol can have two doses a day. Loop over `SL(p)` and pass the slot to `st()` / `lt()`.
6. A phase can have its own schedule. Use `EF(p, date)` or `Ye(p, date)`, never `p.sched` directly.
7. Tapping the dark area round a form must not close it.
8. Sync switches on only at `my.korahpeptides.com` or a `rickspeptidetracker.*` address (`Vn`). The community build has its own shared Firebase (`Rn`, `Wn`).

## Glossary for `src/js/app.js`

| Name | What it is |
|---|---|
| `d` | all the user's data (saved to the device, synced) |
| `r` | screen state (current tab, selections) |
| `s()` | save `d` (and schedule a sync) |
| `Ua()` | redraw the current page |
| `Ht()` | escape text for HTML |
| `Bt()` | turn an HTML string into an element |
| `Vt(title, body, foot)` / `Rt()` | open / close a form |
| `Ft()` | show a toast message |
| `Ot()` | `document.querySelector` |
| `te()` | today as YYYY-MM-DD |
| `ne(date, n)` | date plus n days |
| `ae(a, b)` | days from a to b |
| `ee()` | YYYY-MM-DD to a Date |
| `de()` | "Oct 29, 2026" |
| `fe(n, places)` | format a number |
| `be()` | parse a number (0 if blank) |
| `ve()` | new random id |
| `Ce(id)` / `Le(id)` / `qe(id)` | compound / protocol / batch by id |
| `pt(id)` | compound name |
| `Ge(p, date)` | dose in force on a date (phases) |
| `Ye(p, date)` | is the protocol due that day |
| `_e(p)` | schedule text |
| `Pn(batch)` | label fields for a vial |
| `ln()` | side-menu tabs |
| `Ha` | tab name to page function |
| `l()` | empty data |
| `Fn` | lists that sync |
| `aa()` | sync merge |
| `HL(c)` | half-life |

The full history up to b67 is in the Korah Peptides project doc `claude/tracker-build-log.md`. From b68 on, the history is this repo's commit log.
