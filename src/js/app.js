/*! © 2026 Korah Peptides. All rights reserved. This app, its code and its compiled reference tables are protected by copyright. Copying, republishing or reselling them without written permission is not allowed. */
const e = "protocol:v2",
  t = (function () {
    if ("undefined" != typeof window && window.storage && "function" == typeof window.storage.get)
      return {
        kind: "app",
        get: async () => {
          try {
            const t = await window.storage.get(e);
            return t && t.value ? t.value : null;
          } catch (e) {
            return null;
          }
        },
        set: async (t) => {
          await window.storage.set(e, t);
        },
      };
    try {
      const t = "__t";
      return (
        localStorage.setItem(t, "1"),
        localStorage.removeItem(t),
        {
          kind: "browser",
          get: async () => localStorage.getItem(e),
          set: async (t) => localStorage.setItem(e, t),
        }
      );
    } catch (e) {}
    let t = null;
    return {
      kind: "memory",
      get: async () => t,
      set: async (e) => {
        t = e;
      },
    };
  })();
let n = null,
  a = !1;
function s() {
  (clearTimeout(n),
    (n = setTimeout(async () => {
      try {
        (ta(), await t.set(JSON.stringify(d)), wa());
      } catch (e) {
        a || ((a = !0), Ft("Could not save. Export a backup from Settings."));
      }
    }, 200)));
}
// Build stamp and note come from version.json at build time (see build.mjs).
const o = __BUILD_STAMP__,
  i = __BUILD_NOTE__;
function l() {
  return {
    compounds: [],
    protocols: [],
    batches: [],
    solutions: [],
    supplies: [],
    logs: [],
    weights: [],
    metrics: [],
    labTests: [],
    labDraws: [],
    insights: [],
    insGuides: [],
    _del: {},
    settings: {
      barrel: 100,
      targetDays: 90,
      theme: "system",
      clock: "12",
      trackWeight: !1,
      name: "",
      _m: 0,
      sync: { enabled: !1, config: "", email: "", auto: !0 },
      labelDefaults: {
        ribbon: "",
        under: "Injection",
        between: "For subcutaneous use",
        small: "Store at -20 °C. Protect from light. Not for resale.",
        made: "",
      },
    },
  };
}
let d = l(),
  r = {
    tab: "today",
    sel: null,
    calMonth: null,
    calDay: null,
    histView: "calendar",
    logDraft: null,
    labelId: null,
    siteView: "front",
    schedAlt: !1,
  };
const c = ["#27567F", "#2C6349", "#A8690F", "#6B4A86", "#93362A", "#1F6E75", "#7A5C22", "#4A5F7A"],
  u = [
    ["5-Amino-1MQ", 5.5, "SubQ"],
    ["ACE-031", 288, "SubQ"],
    ["Adalank", null, "Nasal"],
    ["Adamax", null, "SubQ"],
    ["Adipotide (Prohibitin-TP01)", null, "SubQ"],
    ["AHK-Cu (Copper Tripeptide-3)", null, "Topical"],
    ["AICAR", null, "SubQ"],
    ["AOD-9604", 3, "SubQ"],
    ["ARA-290", 0.03, "SubQ"],
    ["Argireline", null, "Topical"],
    ["Bioglutide", null, "Oral"],
    ["BPC-157", 4, "SubQ"],
    ["BPC-157/TB-500 Blend", null, "SubQ"],
    ["Bromantane (Ladasten)", 11.2, "Oral"],
    ["Cagrilintide", 180, "SubQ"],
    ["Cardiogen", null, "SubQ"],
    ["Cartalax", null, "SubQ"],
    ["Cerebrolysin", null, "IM"],
    ["CJC-1295 (DAC)", 168, "SubQ"],
    ["CJC-1295 no-DAC", 0.5, "SubQ"],
    ["Cortagen", null, "SubQ"],
    ["Cortexin", null, "IM"],
    ["Cyclic Glycine-Proline", null, "Oral"],
    ["Dihexa", 300, "Oral"],
    ["DSIP", null, "SubQ"],
    ["Eloralintide", null, "SubQ"],
    ["Epitalon", 3, "SubQ"],
    ["FGL(L)", null, "SubQ"],
    ["Follistatin 344", null, "IM"],
    ["FOXO4-DRI", null, "SubQ"],
    ["Frag 176-191", null, "SubQ"],
    ["GHK-Cu", 2, "SubQ"],
    ["GHRP-2", null, "SubQ"],
    ["GHRP-6", 2.5, "SubQ"],
    ["GHRP-6 + CJC-1295 No DAC", null, "SubQ"],
    ["GLOW (GHK-Cu + BPC-157 + TB-500)", null, "SubQ"],
    ["Glutathione", 0.2, "IM"],
    ["Gonadorelin", 0.4, "SubQ"],
    ["HCG", 30, "SubQ", "iu"],
    ["Hexarelin", 1, "SubQ"],
    ["HGH / Somatropin", 3.4, "SubQ", "iu"],
    ["HMG", null, "SubQ", "iu"],
    ["Humanin", 0.5, "SubQ"],
    ["IGF-1 DES", null, "SubQ"],
    ["IGF-1 LR3", 25, "SubQ"],
    ["Ipamorelin", 2, "SubQ"],
    ["Ipamorelin + CJC-1295", null, "SubQ"],
    ["Kisspeptin-10", 0.1, "SubQ"],
    ["KLOW (KPV + GHK-Cu + BPC-157 + TB-500)", null, "SubQ"],
    ["KPV", 1.5, "SubQ"],
    ["L-Carnitine", null, "SubQ"],
    ["Lipo-C", null, "IM"],
    ["Liraglutide", 13, "SubQ"],
    ["Livagen", null, "SubQ"],
    ["LL-37", 1, "SubQ"],
    ["Matrixyl", null, "Topical"],
    ["Mazdutide", 120, "SubQ"],
    ["Melanotan I", 0.5, "SubQ"],
    ["Melanotan II", 1, "SubQ"],
    ["Methylene Blue", 5.25, "Oral"],
    ["MGF", null, "SubQ"],
    ["MK-677 (Ibutamoren)", null, "Oral"],
    ["MOTS-c", 2, "SubQ"],
    ["NA Semax Amidate", null, "Nasal"],
    ["NAD+", null, "SubQ"],
    ["Omberacetam (Noopept)", null, "Oral"],
    ["Orforglipron (Foundayo)", 39, "Oral"],
    ["Ovagen", null, "SubQ"],
    ["Oxytocin", 0.1, "Nasal"],
    ["P21", null, "SubQ"],
    ["PE-22-28", null, "Nasal"],
    ["PEG-MGF", null, "SubQ"],
    ["Pinealon", null, "SubQ"],
    ["PNC-27", null, "SubQ"],
    ["Prostamax", null, "SubQ"],
    ["PT-141", 2.7, "SubQ"],
    ["Retatrutide", 144, "SubQ"],
    ["Selank", null, "Nasal"],
    ["Semaglutide", 165, "SubQ"],
    ["Semax", null, "Nasal"],
    ["Sermorelin", 0.2, "SubQ"],
    ["SLU-PP-332", null, "SubQ"],
    ["Snap-8", null, "Topical"],
    ["SS-31", 5, "SubQ"],
    ["Survodutide", 144, "SubQ"],
    ["TB-500", null, "SubQ"],
    ["TB4-Frag (β4 1-4)", null, "SubQ"],
    ["TB4-Frag (β4 17-23)", null, "SubQ"],
    ["Tesam. + Ipam. Blend", null, "SubQ"],
    ["Tesamorelin", 0.6, "SubQ"],
    ["Tesofensine", 220, "Oral"],
    ["Testagen", null, "SubQ"],
    ["Testosterone", 192, "SubQ"],
    ["Thyamlin / Thymogen", null, "SubQ"],
    ["Thymalin", null, "IM"],
    ["Thymosin alpha-1", 2, "SubQ"],
    ["Thymosin Beta-4", null, "SubQ"],
    ["Thymulin", null, "SubQ"],
    ["Tirzepatide", 120, "SubQ"],
    ["Vesugen", null, "SubQ"],
    ["VIP", 0.03, "Nasal"],
  ],
  p = [
    ["BPC-157/TB-500 Blend", "250 mcg", "250 mcg", "1.5 mg", "250-500 mcg each"],
    ["DSIP", "100 mcg", "250 mcg", "700 mcg", "100-300 mcg"],
    ["GHRP-6 + CJC-1295 No DAC", "100 mcg", "150 mcg", "200 mcg", "100-200 mcg each"],
    ["GLOW (GHK-Cu + BPC-157 + TB-500)", "5 units", "7.5 units", "10 units", "5-10 units"],
    ["Gonadorelin", "100 mcg", "150 mcg", "200 mcg", "100-200 mcg"],
    ["IGF-1 DES", "50 mcg", "75 mcg", "100 mcg", "50-100 mcg"],
    ["KLOW (KPV + GHK-Cu + BPC-157 + TB-500)", "5 units", "7.5 units", "10 units", "5-10 units"],
    ["KPV", "100 mcg", "500 mcg", "1 mg", "200-400 mcg"],
    ["MGF", "200 mcg", "300 mcg", "400 mcg", "200-400 mcg"],
    ["MOTS-c", "200 mcg", "5 mg", "10 mg", "5-10 mg"],
    ["Retatrutide", "500 mcg", "500 mcg–2 mg", "12 mg", "2 → 12 mg"],
    ["SS-31", "500 mcg", "5 mg–10 mg", "10 mg", "1-2 mg"],
    ["Tesamorelin", "1 mg", "1 mg–2 mg", "2 mg", "2 mg"],
    ["5-Amino-1MQ", "167 mcg", "50 mg–150 mg", "150 mg", "50-100 mg"],
    ["Adamax", "100 mcg", "100 mcg–500 mcg", "1 mg", ""],
    ["ACE-031", "500 mcg", "500 mcg", "500 mcg", ""],
    ["AICAR", "1 mg", "2.5 mg", "50 mg", "2.5-50 mg"],
    ["AOD-9604", "250 mcg", "300 mcg", "1 mg", "300-500 mcg"],
    ["ARA-290", "1 mg", "4 mg", "8 mg", "2-4 mg"],
    ["Argireline", "", "Topical (cosmetic)", "", ""],
    ["BPC-157", "200 mcg", "500 mcg", "1 mg", "250-500 mcg"],
    ["Cagrilintide", "100 mcg", "250 mcg–2.4 mg", "4.5 mg", "0.25 → 2.4 mg"],
    ["Cerebrolysin", "8 mg", "5-10 mL", "215 mg", "1-5 mL"],
    ["CJC-1295 No DAC", "100 mcg", "150 mcg–200 mcg", "500 mcg", "100-300 mcg"],
    ["CJC-1295 WITH DAC", "100 mcg", "2 mg", "2 mg", "1-2 mg"],
    ["Cortexin", "1 mg", "1 mg–10 mg", "10 mg", ""],
    ["Dihexa", "5 mg", "20 mg/ml top.", "20 mg", "5-20 mg"],
    ["Epitalon", "100 mcg", "3 mg–5 mg", "10 mg", "500 mcg-1 mg"],
    ["FGL(L)", "1 mg", "1 mg–2 mg", "2 mg", ""],
    ["Follistatin 344", "50 mcg", "50 mcg", "100 mcg", ""],
    ["FOXO4-DRI", "250 mcg", "1 mg", "10 mg", "2-10 mg"],
    ["Frag 176-191", "", "500 mcg AM", "", ""],
    ["GHK-Cu", "200 mcg", "1.7 mg–2 mg", "2 mg", "1-2 mg"],
    ["GHRP-2", "100 mcg", "100 mcg", "333 mcg", "100-300 mcg"],
    ["GHRP-6", "100 mcg", "100 mcg", "500 mcg", "100-300 mcg"],
    ["HCG", "250 IU", "250 IU–500 IU", "5000 IU", "250-500 IU (with TRT)\n500-1000 IU (mono)"],
    ["Hexarelin", "100 mcg", "0.5-1 mcg/kg", "200 mcg", "100-200 mcg"],
    ["HMG", "75 IU", "75 IU", "150 IU", "75-150 IU"],
    ["Humanin", "25 mcg", "1 mg", "1 mg", "25-50 mcg (low)\n500 mcg-1 mg (standard)"],
    ["IGF-1 LR3", "20 mcg", "50 mcg", "100 mcg", "40-80 mcg"],
    ["Ipamorelin", "100 mcg", "200 mcg–300 mcg", "300 mcg", "200-300 mcg"],
    ["Ipamorelin + CJC-1295", "100 mcg", "200 mcg–250 mcg", "300 mcg", ""],
    ["Kisspeptin", "100 mcg", "125 mcg", "500 mcg", "100-200 mcg"],
    ["L-Carnitine", "50 mg", "200 mg–600 mg", "1500 mg", ""],
    ["Liraglutide", "600 mcg", "600 mcg–3 mg", "3 mg", ""],
    ["LL-37", "50 mcg", "125 mcg", "500 mcg", "100-200 mcg"],
    ["Matrixyl", "", "Topical 2-8%", "", ""],
    ["Mazdutide", "1 mg", "1 mg", "6 mg", ""],
    ["Melanotan 1", "100 mcg", "250 mcg", "500 mcg", "0.25-0.5 mg"],
    ["Melanotan 2", "166 mcg", "500 mcg–1 mg", "1 mg", "0.25-0.5 mg"],
    ["Methylene Blue", "5 mg", "5 mg–10 mg", "25 mg", ""],
    ["MK-677 (Ibutamoren)", "10 mg", "12.5 mg", "30 mg", "10-25 mg"],
    ["NAD+", "25 mg", "100 mg", "250 mg", "50-200 mg"],
    ["Oxytocin", "4 mcg", "50 mcg", "500 mcg", "4-10 mcg"],
    ["P21", "250 mcg", "250 mcg", "1 mg", ""],
    ["PE-22-28", "50 mcg", "250 mcg", "700 mcg", ""],
    ["PEG-MGF", "50 mcg", "50 mcg–100 mcg", "500 mcg", "200-400 mcg"],
    ["PT-141", "500 mcg", "500 mcg–1.5 mg", "8 mg", "1-2 mg"],
    ["Selank", "100 mcg", "500 mcg–750 mcg", "1 mg", "100-300 mcg"],
    ["Semaglutide", "250 mcg", "250 mcg–500 mcg", "5 mg", "0.25 → 2.4 mg"],
    ["Semax", "100 mcg", "400 mcg–700 mcg", "1 mg", "200-600 mcg"],
    ["Sermorelin", "100 mcg", "250 mcg–300 mcg", "500 mcg", "200-500 mcg"],
    ["SLU-PP-332", "250 mcg", "250 mcg", "2.5 mg", ""],
    ["Snap-8", "330 mcg", "Topical 10mg/30ml", "1 mg", ""],
    ["TB-500", "100 mcg", "4 mg–5 mg", "10 mg", "2-2.5 mg"],
    ["TB4-Frag (β4 1-4)", "200 mcg", "200 mcg–400 mcg", "400 mcg", ""],
    ["TB4-Frag (β4 17-23)", "200 mcg", "200 mcg–400 mcg", "400 mcg", ""],
    ["Tesam. + Ipam. Blend", "100 mcg", "100 mcg", "2 mg", "1-2 mg (tesamorelin)\n100-200 mcg (ipamorelin)"],
    ["Tesofensine", "250 mcg", "250 mcg", "500 mcg", "250-500 mcg"],
    ["Thyamlin / Thymogen", "50 mcg", "2 mg", "2 mg", ""],
    ["Thymalin", "5 mg", "5 mg–10 mg", "100 mg", "5-10 mg"],
    ["Thymosin Alpha-1", "100 mcg", "1.2 mg–1.5 mg", "2 mg", "1.6 mg"],
    ["Thymosin Beta-4", "1.6 mg", "", "1.6 mg", ""],
    ["Thymulin", "500 mcg", "500 mcg–1 mg", "1 mg", ""],
    ["Tirzepatide", "500 mcg", "2.5 mg", "15 mg", "2.5 → 15 mg"],
    ["VIP", "25 mcg", "50 mcg", "200 mcg", ""],
    ["PNC-27", "100 mcg", "0.2-0.4 mL", "500 mcg", ""],
    ["Pinealon", "100 mcg", "20 mg–40 mg", "40 mg", "100-300 mcg"],
    ["Cortagen", "1 mg", "1 mg", "2 mg", ""],
    ["NA Semax Amidate", "600 mcg", "600 mcg", "600 mcg", ""],
    ["Melanotan II", "250 mcg", "250 mcg", "500 mcg", "0.25-0.5 mg"],
    ["Cartalax", "100 mcg", "1 capsule (100mcg)", "5 mg", "2 mg"],
    ["Survodutide", "600 mcg", "600 mcg", "6.4 mg", ""],
    ["Melanotan I", "250 mcg", "250 mcg", "500 mcg", "0.25-0.5 mg"],
    ["Adipotide (Prohibitin‑TP01)", "0.43 mg/kg", "0.43 mg/kg", "0.5 mg/kg", "0.5 mg/kg"],
    ["Orforglipron (Foundayo)", "800 mcg", "800 mcg", "36 mg", ""],
    ["Adalank", "200 mcg", "200 mcg–300 mcg", "300 mcg", ""],
    ["HGH (Somatropin)", "", "0.5-4 IU", "", "0.5-4 IU"],
    ["AHK-Cu (Copper Tripeptide-3)", "", "0.5-1% solution/serum", "", ""],
    ["Cyclic Glycine-Proline", "20 mcg", "20 mcg–40 mcg", "40 mcg", ""],
    ["Omberacetam (Noopept)", "10 mg", "10 mg", "10 mg", ""],
    ["Lipo-C", "500 mcg", "1 mL", "1.5 mg", ""],
    ["Glutathione", "100 mg", "200 mg–400 mg", "600 mg", "100-200 mg (SubQ)\n200-600 mg (IM)"],
    ["Prostamax", "500 mcg", "500 mcg–1 mg", "2 mg", ""],
    ["TRT", "100 mg", "100 mg–200 mg", "200 mg", ""],
    ["Bioglutide", "50 mg", "50 mg", "50 mg", ""],
    ["Testagen", "100 mcg", "100 mcg", "300 mcg", ""],
    ["Vesugen", "0.4 mg/kg", "0.4 mg/kg", "0.4 mg/kg", ""],
    ["Livagen", "500 mcg", "", "2 mg", ""],
    ["Ovagen", "10 mcg", "", "150 mcg", ""],
    ["Cardiogen", "2 mg", "10 mg", "10 mg", ""],
    ["Bromantane (Ladasten)", "50 mg", "50 mg", "50 mg", ""],
    ["Eloralintide", "1 mg", "1 mg", "1 mg", ""],
  ],
  h = { cjc1295dac: "cjc1295withdac", kisspeptin10: "kisspeptin", testosterone: "trt" },
  m = (e) =>
    String(e || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ""),
  g = [
    ["BPC-157/TB-500 Blend", ["Wolverine"], []],
    ["Tirzepatide", ["Mounjaro", "Zepbound"], []],
    [
      "Ipamorelin + CJC-1295",
      ["CJC-1295 w Ipamorelin"],
      ["Ipamorelin w CJC-1295", "CJC-1295 no-DAC w Ipamorelin", "CJC-1295 + Ipamorelin"],
    ],
  ],
  v = new Map(),
  b = new Map();
for (const [e, t, n] of g) {
  const a = m(e);
  b.set(a, t);
  for (const e of [...t, ...n]) v.set(m(e), a);
}
const y = (e) => {
    const t = m(e);
    return v.get(t) || t;
  },
  f = new Map(p.map((e) => [m(e[0]), e])),
  w = (e) => {
    const t = y(e);
    return f.get(t) || f.get(h[t]) || null;
  };
function k(e) {
  const t = w(e);
  if (!t || !(t[2] || t[1] || t[3])) return "—";
  const n = (e) => String(e).replace(/[\s\u2013-]/g, ""),
    a = t[1] && t[3] && t[1] !== t[3] && n(t[2]) !== n(t[1] + t[3]) ? `${t[1]} – ${t[3]}` : "";
  return `<div>${Ht(t[2] || "—")}</div>${a ? `<div class="tiny muted">range ${Ht(a)}</div>` : ""}`;
}
function S(e) {
  const t = w(e);
  return t && t[4]
    ? t[4]
        .split("\n")
        .map((e) => {
          const t = e.match(/^(.*\S)\s+(\([^)]*\))\s*$/);
          return t ? `<div>${Ht(t[1])}<span class="nm2">${Ht(t[2])}</span></div>` : `<div>${Ht(e)}</div>`;
        })
        .join("")
    : "—";
}
const M = [
    ["5-Amino-1MQ", "AM", "Daily", "8–12 wks on / 4–6 off", "AM", "Daily", "8 wks", "001"],
    ["ACE-031", "AM fasted", "q14d", "2 doses / 28d", "AM fasted", "2 doses/28d", "2 doses / 28d", "000"],
    ["Adalank", "", "1x daily (morning)", "2–4 wk cycles"],
    [
      "Adamax",
      "AM",
      "Daily",
      "4-8 wks on / 4 wks off",
      "AM",
      "per protocol",
      "4-8 wks on / 4 wks off",
      "000",
    ],
    ["Adipotide (Prohibitin-TP01)", "", "Once daily", "Experimental / caution"],
    ["AHK-Cu (Copper Tripeptide-3)", "", "Once or twice daily", "Ongoing (topical)"],
    ["AICAR", "AM fasted", "Daily × 14d", "14 days; 2×/yr"],
    [
      "AOD-9604",
      "AM fasted",
      "5 on / 2 off",
      "4-8 wks on / 4 wks off",
      "AM fasted",
      "5 on / 2 off",
      "8–12 wks",
      "001",
    ],
    ["ARA-290", "AM", "Daily", "28-day cycles", "AM", "Daily", "8 wks", "001"],
    ["Argireline", "", "1-2x / day", "", "", "1-2x/d", "", "000"],
    ["Bioglutide", "", "Once daily", "Titrate · ongoing"],
    ["BPC-157", "AM / PM", "Daily or 2x/day", "8–12 wks"],
    ["BPC-157/TB-500 Blend", "AM / PM", "Daily", "8–12 wks"],
    ["Bromantane (Ladasten)", "", "Once daily in the morning", "2–4 wks on / 1–2 off"],
    ["Cagrilintide", "AM", "1× / week", "q4wk titration; target wk 17+", "AM", "1× / week", "8 wks", "001"],
    ["Cardiogen", "", "Every 3-7 days", "1 mo on / 2 off · 2–3×/yr"],
    [
      "Cartalax",
      "AM / PM",
      "Daily",
      "30 days · 1 mo on / 2 off · 2-3x/yr",
      "AM / PM",
      "Daily with meals",
      "30 days · 1 mo on / 2 off · 2-3x/yr",
      "000",
    ],
    ["Cerebrolysin", "AM", "Daily", "10-20 day cycles", "AM", "Daily", "10-20 days", "000"],
    ["CJC-1295 (DAC)", "AM", "1x / week", "8-12 wks", "AM", "1x/wk", "8-12 wks", "000"],
    ["CJC-1295 no-DAC", "PM fasted", "5 on / 2 off", "8–12 wks"],
    ["Cortagen", "", "Daily", "20 days"],
    ["Cortexin", "AM / PM", "Daily", "10 days", "AM/PM", "Daily", "10 days", "000"],
    ["Cyclic Glycine-Proline", "", "1x daily", "Ongoing / 8–12 wk blocks"],
    ["Dihexa", "AM + PM", "2x / day", "≤6 wks", "AM+PM", "2x/d", "≤6 wks", "000"],
    ["DSIP", "1–3h before bed", "5 on / 2 off", "8 wks"],
    ["Eloralintide", "", "Once weekly", "Weekly titration · ongoing"],
    ["Epitalon", "PM", "Daily", "10–20 days, 3x/yr"],
    ["FGL(L)", "", "4-6x / wk", "5 on / 2 off", "", "4-6x/wk", "5 on/2 off", "000"],
    [
      "Follistatin 344",
      "30 min pre-workout IM",
      "Daily (community) / training days (verified)",
      "2-4 wks (community) / 8 wks (verified)",
      "30 min pre-workout IM",
      "Training days",
      "8 wks",
      "011",
    ],
    ["FOXO4-DRI", "AM", "every other day", "1-2 wk cycles", "AM", "5 on / 2 off", "2 wks, 2–3x/yr", "011"],
    ["Frag 176-191", "AM fasted (1h pre-food)", "Daily", "", "AM fasted", "Daily", "", "000"],
    ["GHK-Cu", "AM", "Daily", "6–8 wks"],
    ["GHRP-2", "AM / pre-bed", "1-3x / day", "8-12 wks", "AM/pre-bed", "1-3x/d", "8-12 wks", "000"],
    ["GHRP-6", "AM / pre-bed", "1-3x / day", "8-12 wks", "AM/pre-bed", "1-3x/d", "8-12 wks", "000"],
    ["GHRP-6 + CJC-1295 No DAC", "AM / pre-workout / pre-bed (fasted)", "2-3× / day", "8-12 wks"],
    ["GLOW (GHK-Cu + BPC-157 + TB-500)", "", "Daily", "4-6 wks (healing) / 8-16 wks (anti-aging)"],
    ["Glutathione", "", "1-2x weekly", "Ongoing (1–2×/wk)"],
    ["Gonadorelin", "AM (or AM + PM)", "1-2× / day", "Continuous alongside TRT"],
    ["HCG", "AM", "2–3x / week", "As needed"],
    ["Hexarelin", "AM", "Daily", "5 on / 2 off", "AM", "Daily", "5 on/2 off", "000"],
    ["HGH / Somatropin", "", "Once daily", "Long-cycle / ongoing"],
    ["HMG", "AM", "3x / week", "As needed"],
    ["Humanin", "", "Daily", "30 days"],
    ["IGF-1 DES", "Pre- or post-workout", "1× / day, training days", "4-6 wks on / 4-6 off"],
    [
      "IGF-1 LR3",
      "AM",
      "10 days straight",
      "4wk on / 2 off (sustainable) OR 10-14d / 4wks off (aggressive)",
      "AM",
      "10 days straight",
      "10d on / 4 wks off",
      "001",
    ],
    ["Ipamorelin", "AM/PM fasted", "5 on / 2 off", "8–12 wks"],
    ["Ipamorelin + CJC-1295", "AM/PM fasted", "5 on / 2 off", "8–12 wks"],
    [
      "Kisspeptin-10",
      "AM fasted (community) / bed (HW)",
      "3-5x / week",
      "4wk on / 4 off (community) · 30/30 (HW)",
      "Before bed",
      "Daily",
      "30 on / 30 off",
      "111",
    ],
    ["KLOW (KPV + GHK-Cu + BPC-157 + TB-500)", "", "Daily", "4-6 wks (healing) / 6-8 wks (gut)"],
    ["KPV", "AM", "5 on / 2 off", "8 wks"],
    ["L-Carnitine", "AM", "Daily", "As needed"],
    ["Lipo-C", "", "1x weekly", "Ongoing (weekly, fat-loss phase)"],
    ["Liraglutide", "AM", "1x / day", "titrate", "AM", "1x/d", "titrate", "000"],
    ["Livagen", "", "", "1 mo on / 2 off · 2–3×/yr"],
    [
      "LL-37",
      "AM",
      "Daily",
      "2-3 wk cycles (community) / 50d (HW)",
      "AM",
      "Daily",
      "50 days, 4 wks off",
      "001",
    ],
    ["Matrixyl", "", "", ""],
    ["Mazdutide", "AM", "1x / week", "q4wk titration", "AM", "1x/wk", "titrate", "000"],
    ["Melanotan I", "", "2x daily", "8 wks"],
    ["Melanotan II", "", "Daily", "Load → maintain"],
    ["Methylene Blue", "AM", "Daily / 5-on-2-off", "8-12 wks"],
    ["MGF", "Immediately post-workout", "2-3× / wk (training days)", "4-6 wks"],
    ["MK-677 (Ibutamoren)", "AM + PM", "2x / day", "8-16 wks", "AM+PM", "2x/d", "8-16 wks", "000"],
    [
      "MOTS-c",
      "AM / pre-workout",
      "2x / week (community) · 3x/wk also cited",
      "5mg 2x/wk x4-6wk -> 5mg 1x/wk x4wk -> break",
      "AM / pre-workout",
      "3x / week",
      "4–8 wks",
      "011",
    ],
    ["NA Semax Amidate", "", "1x daily", "2–4 wk cycles"],
    ["NAD+", "AM", "2–3x / week", "Ongoing"],
    ["Omberacetam (Noopept)", "", "1-2 times daily", "4–8 wks, cycled"],
    ["Orforglipron (Foundayo)", "", "Once daily, any time", "q4wk titration · ongoing"],
    ["Ovagen", "", "", "1 mo on / 2 off · 2–3×/yr"],
    ["Oxytocin", "As needed", "As needed", "As needed"],
    ["P21", "AM", "3–4x / week", "8 wks"],
    ["PE-22-28", "AM", "3–4x / week", "8 wks"],
    ["PEG-MGF", "Post-workout", "Training days", "Caution", "post-WO", "Training", "Caution", "000"],
    ["Pinealon", "", "Daily", "30 days"],
    ["PNC-27", "", "3x / day", "6 wks", "", "3x/day", "6 wks", "000"],
    ["Prostamax", "", "Once daily", "1 mo on / 2 off · 2–3×/yr"],
    [
      "PT-141",
      "2–4h pre-activity",
      "1 dose / 24h · max 8 / month",
      "<=3x / week",
      "2–4h pre-activity",
      "As needed",
      "<=3x / week",
      "000",
    ],
    [
      "Retatrutide",
      "AM",
      "1× / wk (HW microdose 3–4×)",
      "q4wk titration · until goal",
      "AM",
      "1–4x / week",
      "Until goal",
      "000",
    ],
    ["Selank", "AM", "Daily (community) / 2-3x/wk (verified)", "8 wks", "AM", "2–3x / week", "8 wks", "010"],
    ["Semaglutide", "AM", "1x / week", "Until goal"],
    ["Semax", "AM", "Daily (community) / 2-3x/wk (verified)", "8 wks", "AM", "2–3x / week", "8 wks", "010"],
    ["Sermorelin", "PM before bed", "Mon–Fri", "8–12 wks"],
    ["SLU-PP-332", "AM", "1-2x / day", "New", "AM", "1-2x/d", "New", "000"],
    ["Snap-8", "", "1-2x / day", "", "", "1-2x/d", "", "000"],
    ["SS-31", "AM", "Daily", "8 wks (28-day blocks)", "AM", "Daily", "8 wks", "000"],
    ["Survodutide", "", "Once weekly with 4-week intervals", "q4wk titration (24-wk ramp) · ongoing"],
    ["TB-500", "AM", "Daily or 2x/week", "6–8 wks"],
    [
      "TB4-Frag (β4 1-4)",
      "AM / Mid",
      "Daily",
      "Targeted repair",
      "AM/Mid",
      "Daily",
      "Targeted repair",
      "000",
    ],
    [
      "TB4-Frag (β4 17-23)",
      "AM / Mid",
      "Daily",
      "Targeted repair",
      "AM/Mid",
      "Daily",
      "Targeted repair",
      "000",
    ],
    ["Tesam. + Ipam. Blend", "AM/PM fasted", "5 on / 2 off", "8–12 wks"],
    ["Tesamorelin", "AM fasted", "5 on / 2 off", "8–12 wks"],
    ["Tesofensine", "Early AM", "Daily", "Caution"],
    ["Testagen", "", "Once daily", "1 mo on / 2 off · 2–3×/yr"],
    ["Testosterone", "", "Weekly or split 2x/week", "Ongoing (continuous)"],
    ["Thyamlin / Thymogen", "PM", "Daily", "20 days, 3x/yr"],
    ["Thymalin", "AM / PM", "Daily", "5-10 day cycles", "AM/PM", "Daily", "5-10 days", "000"],
    ["Thymosin alpha-1", "AM", "2–5x / week", "8–12 wks"],
    ["Thymosin Beta-4", "", "", ""],
    ["Thymulin", "AM fasted", "Daily × 20d", "Up to 20 days"],
    ["Tirzepatide", "AM", "1–3x / week", "Until goal"],
    ["Vesugen", "", "Once daily for 2 months", "1 mo on / 2 off · 2–3×/yr"],
    ["VIP", "AM / PM", "Daily", "2-4 wks (short) / 3-6 mo (long)", "AM / PM", "Daily", "8 wks", "001"],
  ],
  x = new Map(M.map((e) => [m(e[0]), e])),
  A = { kisspeptin: "kisspeptin10", trt: "testosterone", cjc1295withdac: "cjc1295dac" },
  $ = (e) => {
    const t = y(e);
    return x.get(t) || x.get(A[t]) || null;
  };
function I(e) {
  const t = $(e);
  if (!t) return "—";
  const n = !!r.schedAlt && t.length > 4,
    a = n ? 4 : 1,
    s = n ? 1 : 4,
    o = t.length > 4 ? t[7] : "000",
    i = (e, i) => {
      const l = t[a + e];
      if (!l) return "";
      const d = "1" === o[e],
        r = n && l !== t[s + e];
      return `<div class="${i}${d ? " schflag" : ""}${r ? " schchg" : ""}"${d && !n ? ` title="Source Comparison: ${Ht(t[s + e])}"` : ""}>${Ht(l)}${r ? `<span class="was">Quick Reference: ${Ht(t[s + e])}</span>` : ""}</div>`;
    };
  return i(1, "schf") + i(0, "scht") + i(2, "schc") || "—";
}
function C() {
  const e = M.filter((e) => e.length > 4).length,
    t = d.compounds.length,
    n = d.compounds.filter((e) => {
      const t = $(e.name);
      return t && t.length > 4;
    }).length,
    a = t
      ? n
        ? ` ${n} of your ${t} differ.`
        : ` None of your ${t} differ, so Yours looks the same either way.`
      : "";
  return r.schedAlt
    ? `Showing the Source Comparison tab. Highlighted lines differ from Quick Reference, which is shown under each one. ${e} of ${M.length} library compounds differ.${a}`
    : `Showing the Quick Reference tab. Press Alternative to see the Source Comparison tab instead: ${e} of ${M.length} library compounds differ.${a} An amber dot marks a line where the two really disagree.`;
}
const L = (e) => `<td class="sch" data-schn="${Ht(e)}">${I(e)}</td>`;
function q(e) {
  const t = String(e || "").trim(),
    n = b.get(m(t));
  if (n && n.length) return `<b>${Ht(t)}</b><span class="nm2">${Ht(n.join(" · "))}</span>`;
  let a = t.match(/^(.+?)\s+\/\s+(.+)$/);
  return a
    ? `<b>${Ht(a[1])}</b><span class="nm2">${Ht(a[2])}</span>`
    : ((a = t.match(/^(.+?)\s+(\(.+\))$/)),
      a
        ? `<b>${Ht(a[1])}</b><span class="nm2">${Ht(a[2])}</span>`
        : ((a = t.match(/^(.+?)\s+((?:w|with|\+)\s+.+)$/i)),
          a ? `<b>${Ht(a[1])}</b><span class="nm2">${Ht(a[2])}</span>` : `<b>${Ht(t)}</b>`));
}
const D = ["SubQ"],
  E = ["IM"],
  T = ["SubQ", "IM"],
  P = "At least 5 cm (2 in) from the navel.",
  O = "Below the ribs, and at least 5 cm (2 in) from the navel.",
  B = "Front and outer thigh only.",
  H = "Upper third, front and outer thigh only. Keep well clear of the groin.",
  U = "Lower third, front and outer thigh only. Keep well above the kneecap.",
  Q = "Over the shoulder-blade area. You can’t see or pinch it yourself — needs a second person.",
  N = "Only the fleshy area just above the buttock, well off the spine.",
  F = "Upper outer quarter only.",
  V = [
    ["fdl", "Left Side Deltoid", "front", 53, 183, E, ""],
    ["fdr", "Right Side Deltoid", "front", 253, 183, E, ""],
    ["fdfl", "Left Front Deltoid", "front", 81, 176, E, ""],
    ["fdfr", "Right Front Deltoid", "front", 225, 176, E, ""],
    ["ful", "Left Inner Upper Abdomen", "front", 121, 262, D, O],
    ["fur", "Right Inner Upper Abdomen", "front", 185, 262, D, O],
    ["fuol", "Left Outer Upper Abdomen", "front", 95, 262, D, O],
    ["fuor", "Right Outer Upper Abdomen", "front", 211, 262, D, O],
    ["fal", "Left Inner Abdomen", "front", 121, 301, D, P],
    ["far", "Right Inner Abdomen", "front", 185, 301, D, P],
    ["faol", "Left Outer Abdomen", "front", 95, 301, D, P],
    ["faor", "Right Outer Abdomen", "front", 211, 301, D, P],
    ["fll", "Left Inner Lower Abdomen", "front", 121, 352, D, P],
    ["flr", "Right Inner Lower Abdomen", "front", 185, 352, D, P],
    ["flol", "Left Outer Lower Abdomen", "front", 95, 352, D, P],
    ["flor", "Right Outer Lower Abdomen", "front", 211, 352, D, P],
    ["fhil", "Left Inner Love Handle", "front", 115, 327, D, ""],
    ["fhir", "Right Inner Love Handle", "front", 191, 327, D, ""],
    ["fhl", "Left Outer Love Handle", "front", 89, 327, D, ""],
    ["fhr", "Right Outer Love Handle", "front", 217, 327, D, ""],
    ["ftul", "Left Upper Thigh", "front", 103, 422, D, H],
    ["ftur", "Right Upper Thigh", "front", 203, 422, D, H],
    ["ftl", "Left Mid Thigh", "front", 100, 470, D, B],
    ["ftr", "Right Mid Thigh", "front", 206, 470, D, B],
    ["ftdl", "Left Lower Thigh", "front", 108, 518, D, U],
    ["ftdr", "Right Lower Thigh", "front", 198, 518, D, U],
    ["bdrl", "Left Back Deltoid", "back", 66, 181, E, ""],
    ["bdrr", "Right Back Deltoid", "back", 240, 181, E, ""],
    ["bul", "Left Upper Back", "back", 118, 222, D, Q],
    ["bur", "Right Upper Back", "back", 188, 222, D, Q],
    ["btl", "Left Tricep", "back", 48, 280, D, ""],
    ["btr", "Right Tricep", "back", 258, 280, D, ""],
    ["bll", "Left Lower Back", "back", 114, 305, D, N],
    ["blr", "Right Lower Back", "back", 192, 305, D, N],
    ["bvl", "Left Ventrogluteal", "back", 91, 342, E, ""],
    ["bvr", "Right Ventrogluteal", "back", 215, 342, E, ""],
    ["bgl", "Left Glute", "back", 106, 368, T, F],
    ["bgr", "Right Glute", "back", 200, 368, T, F],
  ],
  R = { bdl: "bdrl", bdr: "bdrr", bfl: "fhl", bfr: "fhr" },
  W = {
    fbl: "Left Bicep",
    fbr: "Right Bicep",
    ffl: "Left Forearm",
    ffr: "Right Forearm",
    bhl: "Left Hamstring",
    bhr: "Right Hamstring",
  };
function j() {
  let e = 0;
  for (const t of d.logs || []) t.site && R[t.site] && ((t.site = R[t.site]), e++);
  return e;
}
const G = (e) => V.find((t) => t[0] === e),
  K = (e) => {
    const t = G(e);
    return t ? t[1] : W[e] || "";
  },
  J = (e) => {
    const t = G(e);
    return t ? t[6] : "";
  },
  z = (e) => {
    const t = G(e);
    return t ? t[5] : [];
  },
  Y = ["SubQ", "IM"];
function Z(e) {
  if (!e.site) return "";
  const t = K(e.site);
  return e.route && z(e.site).length > 1 ? `${t} (${e.route})` : t;
}
const X = (e) => String(e).padStart(2, "0"),
  _ = (e) => `${e.getFullYear()}-${X(e.getMonth() + 1)}-${X(e.getDate())}`,
  ee = (e) => {
    const [t, n, a] = String(e).split("-").map(Number);
    return new Date(t, n - 1, a);
  },
  te = () => _(new Date());
function ne(e, t) {
  const n = ee(e);
  return (n.setDate(n.getDate() + t), _(n));
}
function ae(e, t) {
  return Math.round((ee(t) - ee(e)) / 864e5);
}
function se(e) {
  return ee(e).toLocaleDateString(void 0, { month: "short", day: "numeric" });
}
function oe(e) {
  return ee(e).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
}
function ie(e) {
  return ee(e).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
}
const le = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
function de(e) {
  const t = ee(e);
  return `${le[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;
}
function re(e) {
  return "24" === d.settings.clock
    ? `${X(e.getHours())}:${X(e.getMinutes())}`
    : e.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" });
}
function ce(e) {
  const t = ae(te(), e);
  return 0 === t
    ? "Today"
    : 1 === t
      ? "Tomorrow"
      : -1 === t
        ? "Yesterday"
        : ee(e).toLocaleDateString(void 0, { weekday: "short", month: "short", day: "numeric" });
}
function ue(e) {
  if (!e) return null;
  const [t, n] = String(e).split(":").map(Number);
  if (!isFinite(t)) return null;
  if ("24" === d.settings.clock) return { t: `${X(t)}:${X(n || 0)}`, ap: "" };
  const a = t < 12 ? "AM" : "PM";
  return { t: `${t % 12 == 0 ? 12 : t % 12}:${X(n || 0)}`, ap: a };
}
const pe = (e) => e.time || "99:99";
function he(e) {
  return `${_(e)}T${X(e.getHours())}:${X(e.getMinutes())}`;
}
const me = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ge = [1, 2, 3, 4, 5, 6, 0],
  ve = () => Math.random().toString(36).slice(2, 10),
  be = (e) => {
    const t = parseFloat(e);
    return isFinite(t) ? t : 0;
  };
function ye(e, t) {
  const n = Math.pow(10, t);
  return Math.round(e * n) / n;
}
function fe(e, t = 2) {
  return isFinite(e) ? ye(e, t).toLocaleString(void 0, { maximumFractionDigits: t }) : "—";
}
function we(e) {
  return 0 === e
    ? "0 mg"
    : Math.abs(e) < 0.001
      ? fe(1e6 * e, 0) + " ng"
      : Math.abs(e) < 1
        ? fe(1e3 * e, 1e3 * e < 10 ? 1 : 0) + " mcg"
        : fe(e, e < 10 ? 2 : 1) + " mg";
}
function ke(e) {
  if (null === e || !isFinite(e)) return "—";
  if (e < 60) return `${Math.floor(e)} days`;
  const t = e / 30.44;
  return t < 24 ? `~${Math.round(t)} months` : `~${(t / 12).toFixed(1)} years`;
}
const Se = (e, t) => ("mcg" === t ? be(e) / 1e3 : be(e)),
  Me = (e) => !(!e || "iu" !== e.base),
  xe = (e) => (Me(e) ? "IU" : "mg"),
  Ae = (e) => (Me(e) ? "IU/mL" : "mg/mL");
function $e(e, t) {
  return Me(t) ? (e ? fe(e, Math.abs(e) < 10 ? 2 : 1) + " IU" : "0 IU") : we(e);
}
const Ie = (e, t) => ("mcg" === t ? 1e3 * e : e),
  Ce = (e) => d.compounds.find((t) => t.id === e),
  Le = (e) => d.protocols.find((t) => t.id === e),
  qe = (e) => d.batches.find((t) => t.id === e),
  De = (e) => d.batches.filter((t) => t.compoundId === e && "finished" !== t.status),
  Ee = (e) => De(e).find((e) => be(e.openMg) > 0) || De(e).find((e) => e.sealed > 0);
function Te(e) {
  const t = y(e);
  return t ? d.compounds.find((e) => y(e.name) === t) : void 0;
}
function Pe(e) {
  const t = Te(e);
  if (t) return t;
  const n = u.find((t) => t[0].toLowerCase() === String(e).trim().toLowerCase()),
    a = {
      id: ve(),
      name: String(e).trim(),
      halfLife: n ? n[1] : "",
      route: n ? n[2] : "SubQ",
      base: (n && n[3]) || "mg",
      color: c[d.compounds.length % c.length],
      notes: "",
    };
  return (d.compounds.push(a), a);
}
const Oe = 100;
function Be(e) {
  return e && be(e.bacMl) ? be(e.vialMg) / be(e.bacMl) : 0;
}
function He(e) {
  if (!e) return "";
  const t = Ce(e.compoundId),
    n = be(e.bacMl);
  return `${fe(be(e.vialMg), 2)} ${xe(t)}${n ? ` in ${fe(n, 2)} mL` : " · not mixed yet"}`;
}
function Ue(e, t) {
  const n = Ce(e.compoundId),
    a = Ee(e.compoundId),
    s = e.pen ? 0 : Be(a),
    o = Ge(e, t || te()),
    i = Se(o.dose, o.unit),
    l = s > 0 ? i / s : 0;
  return {
    conc: s,
    doseMg: i,
    volMl: l,
    units: l * Oe,
    compound: n,
    batch: a,
    dose: o.dose,
    unit: o.unit,
    phase: o,
  };
}
function Qe(e, t, n) {
  const a = be(t) > 0 ? be(e) / be(t) : 0,
    s = a > 0 ? n / a : 0;
  return { conc: a, volMl: s, units: s * Oe, perVial: n > 0 ? be(e) / n : 0 };
}
function Ne(e, t, n) {
  const a = be(n) / Oe;
  if (!a || !t) return { waterMl: 0, conc: 0, perVial: 0 };
  const s = t / a;
  return { waterMl: be(e) / s, conc: s, perVial: be(e) / t };
}
function Fe(e) {
  for (const t of [1, 2, 3, 5, 10, 20, 30]) if (e <= t) return t;
  return Math.ceil(e);
}
const Ve = (e, t) => Math.max(0, Math.round(be(e) * ("days" === t ? 1 : 7)));
function Re(e, t) {
  const n = ae(e.startDate || t, t);
  if (!e.cycling) return { on: !0, elapsedOn: n, block: 0, pos: n, onD: 0, offD: 0 };
  const a = Ve(e.cycleOnN, e.cycleOnUnit) || 1,
    s = Ve(e.cycleOffN, e.cycleOffUnit),
    o = a + s;
  if (o <= 0) return { on: !0, elapsedOn: n, block: 0, pos: n, onD: a, offD: s };
  const i = ((n % o) + o) % o,
    l = Math.floor(n / o);
  return {
    on: i < a,
    pos: i,
    block: l,
    onD: a,
    offD: s,
    elapsedOn: "restart" === e.cycleResume ? i : l * a + Math.min(i, a),
  };
}
function We(e) {
  const p = e.phases || [];
  return p.filter((e, i) => e && (be(e.dur) > 0 || i === p.length - 1));
}
function je(e) {
  return e.escalate
    ? (e.phases || []).filter((e, i, p) => e && i < p.length - 1 && !(be(e.dur) > 0)).length
    : 0;
}
function Ge(e, t) {
  const n = We(e);
  if (!e.escalate || !n.length) return { dose: e.dose, unit: e.unit, phase: 0, of: 0 };
  const a = Re(e, t).elapsedOn;
  let s = 0;
  for (let t = 0; t < n.length; t++) {
    const o = Ve(n[t].dur, n[t].durUnit);
    if (a < s + o)
      return { dose: n[t].dose, unit: n[t].unit || e.unit, phase: t + 1, of: n.length, daysLeft: s + o - a };
    s += o;
  }
  const o = n[n.length - 1];
  return { dose: o.dose, unit: o.unit || e.unit, phase: n.length, of: n.length, holding: be(o.dur) > 0 };
}
function Ke(e) {
  return We(e).reduce((e, t) => e + Ve(t.dur, t.durUnit), 0);
}
function Je(e, t) {
  const n = Ge(e, t);
  for (let a = 1; a <= 400; a++) {
    const s = ne(t, a),
      o = Ge(e, s);
    if (o.phase !== n.phase || be(o.dose) !== be(n.dose)) return { date: s, dose: o };
  }
  return null;
}
function ze(e) {
  return e.cycling
    ? `${be(e.cycleOnN)} ${e.cycleOnUnit || "weeks"} on / ${be(e.cycleOffN)} ${e.cycleOffUnit || "weeks"} off`
    : "";
}
function PI(e, t) {
  if (!e.escalate) return null;
  const n = We(e);
  if (!n.length) return null;
  const a = Re(e, t).elapsedOn;
  let s = 0;
  for (let i = 0; i < n.length; i++) {
    const o = Ve(n[i].dur, n[i].durUnit);
    if (i === n.length - 1 || a < s + o) return { p: n[i], st: s, i: i };
    s += o;
  }
  return null;
}
function EF(e, t) {
  const P = PI(e, t || te());
  return P && P.p.ps
    ? { sched: P.p.ps, days: P.p.pdays, intervalDays: P.p.pint, cycleOn: e.cycleOn, cycleOff: e.cycleOff }
    : e;
}
function PSC(e, n) {
  const s = e.ps || "";
  return `<div class="phsch"><span class="tiny muted">Schedule</span><select class="ph-s" aria-label="Phase ${n + 1} schedule">${[
    ["", "Same as the protocol"],
    ["daily", "Every day"],
    ["weekdays", "Certain days"],
    ["interval", "Every N days"],
  ]
    .map(([v, l]) => `<option value="${v}"${s === v ? " selected" : ""}>${l}</option>`)
    .join(
      "",
    )}</select>${"weekdays" === s ? `<div class="daypick">${me.map((d, i) => `<button type="button" data-pd="${n},${i}" aria-pressed="${(e.pdays || []).includes(i)}">${d}</button>`).join("")}</div>` : ""}${"interval" === s ? `<span class="tiny muted">every</span><input class="ph-i" type="number" min="1" step="1" value="${Ht(e.pint || 2)}"><span class="tiny muted">days</span>` : ""}</div>`;
}
const DK = "protocol:draft";
function DG(e) {
  try {
    const x = JSON.parse(localStorage.getItem(DK) || "null");
    if (!x || (x.edit || "") !== (e || "") || Date.now() - x.at > 6048e5) return null;
    if (e && !Le(e)) return null;
    return x;
  } catch (z) {
    return null;
  }
}
function DS(x) {
  try {
    localStorage.setItem(DK, JSON.stringify(x));
  } catch (z) {}
}
function DX() {
  try {
    localStorage.removeItem(DK);
  } catch (z) {}
}
function DT(a) {
  const m = Math.round((Date.now() - a) / 6e4);
  return m < 1
    ? "just now"
    : m < 60
      ? m + " min ago"
      : m < 1440
        ? Math.round(m / 60) + " h ago"
        : Math.round(m / 1440) + " days ago";
}
function Ye(e, t) {
  if (!e.active) return !1;
  if (e.startDate && t < e.startDate) return !1;
  const n = Ze(e);
  if (n && t > n) return !1;
  let a = ae(e.startDate || t, t);
  if (a < 0) return !1;
  if (e.cycling && !Re(e, t).on) return !1;
  const P = PI(e, t),
    S = P && P.p.ps ? { sched: P.p.ps, days: P.p.pdays, intervalDays: P.p.pint } : e;
  S !== e && (a = Re(e, t).elapsedOn - P.st);
  switch (S.sched) {
    case "daily":
      return !0;
    case "weekdays":
      return (S.days || []).includes(ee(t).getDay());
    case "interval":
      return a % Math.max(1, be(S.intervalDays)) === 0;
    case "cycle": {
      const t = Math.max(1, be(e.cycleOn));
      return a % (t + Math.max(0, be(e.cycleOff))) < t;
    }
    default:
      return !1;
  }
}
function Ze(e) {
  return be(e.weeks) ? ne(e.startDate, 7 * be(e.weeks) - 1) : null;
}
function Xe(e) {
  const t = Ze(e);
  if (!t) return null;
  const n = ae(te(), t) + 1;
  return n <= 0 ? 0 : n / 7;
}
function _e(e) {
  const t = et(EF(e)) + (e.split ? " · AM + PM" : "");
  return e.cycling ? `${t} · ${ze(e)}` : t;
}
function et(e) {
  switch (e.sched) {
    case "daily":
      return "Every day";
    case "weekdays":
      return (e.days || []).length
        ? (e.days || [])
            .slice()
            .sort()
            .map((e) => me[e])
            .join(" · ")
        : "No days chosen";
    case "interval": {
      const t = Math.max(1, be(e.intervalDays));
      return 2 === t ? "Every other day" : `Every ${t} days`;
    }
    case "cycle":
      return `${be(e.cycleOn)} on / ${be(e.cycleOff)} off`;
    default:
      return "—";
  }
}
function tt(e) {
  let t = 0;
  const n = e.startDate && e.startDate > te() ? e.startDate : te();
  for (let a = 0; a < 28; a++) Ye(e, ne(n, a)) && t++;
  return t / 28;
}
function nt(e, t) {
  for (let n = 0; n < 800; n++) {
    const a = ne(t, n);
    if (Ye(e, a)) return a;
  }
  return null;
}
function at(e = 14, t = 6) {
  const n = [];
  for (let a = 0; a < e && n.length < t; a++) {
    const e = ne(te(), a);
    for (const s of d.protocols)
      if (Ye(s, e) && (0 !== a || SLO(s).length) && (n.push({ date: e, protocol: s }), n.length >= t)) break;
  }
  return n;
}
const st = (e, t, s) =>
    d.logs.find((n) => n.protocolId === e && n.date === t && (!s || (n.slot || "am") === s)),
  SL = (e) => (e && e.split ? ["am", "pm"] : [""]),
  SLT = (e, s) => ("pm" === s ? e.time2 || "" : e.time || ""),
  SLN = (s) => ("am" === s ? "AM" : "pm" === s ? "PM" : ""),
  SLO = (e) => SL(e).filter((s) => !st(e.id, te(), s)),
  ot = (e) => d.logs.filter((t) => t.date === e);
function it(e) {
  return gt(d.protocols.filter((t) => Ye(t, e)));
}
function lt(e, t, s) {
  const n = st(e, t, s);
  if (n) return n.status;
  const a = Le(e);
  return a && Ye(a, t) ? (t < te() ? "missed" : "scheduled") : null;
}
function dt(e = 30) {
  let t = 0,
    n = 0;
  for (let a = 0; a < e; a++) {
    const e = ne(te(), -a);
    for (const a of d.protocols) {
      if (!Ye(a, e)) continue;
      for (const x of SL(a)) {
        t++;
        const s = st(a.id, e, x);
        s && "taken" === s.status && n++;
      }
    }
  }
  return { sched: t, taken: n, pct: t ? Math.round((n / t) * 100) : null };
}
function rt(e) {
  const t = d.logs
    .filter((t) => t.site === e && "taken" === t.status)
    .sort((e, t) => (e.date < t.date ? 1 : -1));
  return t.length ? t[0].date : null;
}
function ct(e) {
  const t = rt(e);
  if (!t) return "fresh";
  const n = ae(t, te());
  return n < 3 ? "recent" : n < 7 ? "soon" : "fresh";
}
function ut(e) {
  let t = null,
    n = "9999";
  for (const [e] of V) {
    const a = rt(e);
    if (!a) return e;
    a < n && ((n = a), (t = e));
  }
  return t;
}
const pt = (e) => (Ce(e) || {}).name || "",
  ht = (e, t) => String(e || "").localeCompare(String(t || ""), void 0, { sensitivity: "base", numeric: !0 }),
  mt = (e) => d.protocols.some((t) => t.compoundId === e && t.active);
function gt(e) {
  return (e || d.protocols)
    .slice()
    .sort(
      (e, t) =>
        (e.active ? 0 : 1) - (t.active ? 0 : 1) ||
        ht(pt(e.compoundId), pt(t.compoundId)) ||
        be(e.dose) - be(t.dose) ||
        ht(e.id, t.id),
    );
}
function vt(e) {
  return e.slice().sort((e, t) => (mt(e) ? 0 : 1) - (mt(t) ? 0 : 1) || ht(pt(e), pt(t)));
}
function bt(e) {
  return (e || d.compounds)
    .slice()
    .sort((e, t) => (mt(e.id) ? 0 : 1) - (mt(t.id) ? 0 : 1) || ht(e.name, t.name));
}
function yt(e, t, n) {
  const a = e.filter(t),
    s = e.filter((e) => !t(e));
  return a.length && s.length
    ? `<optgroup label="Running">${a.map(n).join("")}</optgroup><optgroup label="Not running">${s.map(n).join("")}</optgroup>`
    : e.map(n).join("");
}
function ft(e) {
  return e
    .slice()
    .sort(
      (e, t) =>
        (mt(e.compoundId) ? 0 : 1) - (mt(t.compoundId) ? 0 : 1) ||
        ht(pt(e.compoundId), pt(t.compoundId)) ||
        be(e.vialMg) - be(t.vialMg),
    );
}
function wt(e) {
  return De(e).reduce((e, t) => e + be(t.sealed) * be(t.vialMg) + be(t.openMg), 0);
}
function kt(e) {
  return De(e).reduce((e, t) => e + be(t.sealed), 0);
}
function St(e) {
  return De(e).filter((e) => be(e.openMg) > 0).length;
}
function Mt(e) {
  return d.protocols
    .filter((t) => t.compoundId === e && t.active)
    .reduce((e, t) => {
      const n = Ge(t, te());
      return e + Se(n.dose, n.unit) * tt(t) * SL(t).length;
    }, 0);
}
function xt(e) {
  const t = d.protocols.filter((t) => t.compoundId === e && t.active);
  if (!t.length) return null;
  const n = Ge(t[0], te()),
    a = Se(n.dose, n.unit);
  return a > 0 ? Math.floor(wt(e) / a) : null;
}
function At(e) {
  const t = Mt(e);
  return t ? Math.floor(wt(e) / t) : null;
}
function $t(e) {
  const t = At(e),
    n = be(d.settings.targetDays) || 90;
  return null === t
    ? { text: "No protocol", cls: "" }
    : t <= 7
      ? { text: "Almost out", cls: "late" }
      : t < 0.34 * n
        ? { text: "Running low", cls: "due" }
        : t < n
          ? { text: "Below target", cls: "due" }
          : { text: "Well stocked", cls: "done" };
}
function It(e, t, n, a) {
  const s = qe(e);
  if (!s) return null;
  let o = null;
  const i = be(s.openMg);
  if ((n || i < t - 1e-9) && be(s.sealed) > 0) {
    const e = n ? 0 : Math.max(0, i);
    ((o = Ct(s, a)), (o.fromNew = ye(t - e, 6)), (s.openMg = Math.max(0, ye(be(s.openMg) - o.fromNew, 6))));
  } else s.openMg = Math.max(0, ye(i - t, 6));
  return (s.openMg <= 0 && be(s.sealed) <= 0 && (s.status = "finished"), o);
}
function Ct(e, t) {
  const n = {
    tok: ve(),
    prevTok: e.openTok || "",
    prevOpen: be(e.openMg),
    prevRecon: e.reconDate || "",
    prevStatus: e.status || "",
    solId: "",
    water: 0,
    fromNew: 0,
  };
  (be(t) > 0 &&
    be(t) !== be(e.bacMl) &&
    ((n.prevBac = null == e.bacMl ? "" : e.bacMl), (e.bacMl = String(be(t)))),
    (e.sealed = be(e.sealed) - 1),
    (e.openMg = be(e.vialMg)),
    (e.reconDate = te()),
    (e.status = "open"),
    (e.openTok = n.tok));
  const a = be(e.bacMl);
  if (a) {
    const e = $n(a);
    e && ((n.solId = e), (n.water = a));
  }
  return n;
}
function Lt(e, t) {
  if (
    ((e.sealed = be(e.sealed) + 1),
    (e.openMg = be(t.prevOpen)),
    (e.reconDate = t.prevRecon || ""),
    (e.openTok = t.prevTok || ""),
    (e.status = t.prevStatus || (be(t.prevOpen) > 0 ? "open" : "sealed")),
    "prevBac" in t && (e.bacMl = t.prevBac),
    t.solId)
  ) {
    const e = d.solutions.find((e) => e.id === t.solId);
    e && ((e.ml = ye(be(e.ml) + be(t.water), 3)), wn("mix"));
  }
}
function qt(e, t) {
  const n = qe(e);
  n &&
    ((n.openMg = Math.min(be(n.vialMg), ye(be(n.openMg) + t, 6))),
    "finished" === n.status && (n.status = "open"));
}
function Dt(e) {
  const t = be(e.startVials) * be(e.vialMg);
  if (!t) return 0;
  const n = be(e.sealed) * be(e.vialMg) + be(e.openMg);
  return Math.max(0, Math.min(100, 100 * (1 - n / t)));
}
function HL(c) {
  if (!c) return 0;
  const v = be(c.halfLife);
  if (v) return v;
  const r = u.find((x) => y(x[0]) === y(c.name));
  return r ? be(r[1]) : 0;
}
function Et(e, t) {
  const n = Ce(e),
    a = n ? HL(n) : 0;
  if (!a) return null;
  let s = 0;
  for (const n of d.logs) {
    if (n.compoundId !== e || "taken" !== n.status) continue;
    const o = new Date(n.at || n.date + "T12:00").getTime();
    o <= t && (s += be(n.doseMg) * Math.pow(0.5, (t - o) / 36e5 / a));
  }
  return s;
}
function Tt(e, t = 30) {
  const n = Ce(e);
  if (!n || !HL(n)) return 0;
  let a = 0;
  const s = Date.now();
  for (let n = 24 * t; n >= 0; n -= 3) {
    const t = Et(e, s - 36e5 * n);
    t > a && (a = t);
  }
  return a;
}
function Pt(e) {
  return (
    d.logs
      .filter((t) => t.compoundId === e && "taken" === t.status)
      .sort((e, t) => ((e.at || e.date) < (t.at || t.date) ? 1 : -1))[0] || null
  );
}
const Ot = (e) => document.querySelector(e);
function Bt(e) {
  const t = document.createElement("template");
  return ((t.innerHTML = e.trim()), t.content.firstElementChild);
}
function Ht(e) {
  return String(null == e ? "" : e).replace(
    /[&<>"']/g,
    (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e],
  );
}
function Ut() {
  const e = new Set(),
    t = [];
  for (const n of bt()) {
    const a = String(n.name || "").trim();
    a && !e.has(a.toLowerCase()) && (e.add(a.toLowerCase()), t.push(a));
  }
  for (const n of u) e.has(n[0].toLowerCase()) || (e.add(n[0].toLowerCase()), t.push(n[0]));
  return t;
}
function Qt(e, t) {
  if (!e || e.dataset.combo) return;
  const n = document.activeElement === e;
  ((e.dataset.combo = "1"), e.setAttribute("autocomplete", "off"), e.removeAttribute("list"));
  const a = document.createElement("div");
  ((a.className = "combo"), e.parentNode.insertBefore(a, e), a.appendChild(e));
  const s = Bt('<button type="button" class="combo-btn" tabindex="-1" aria-label="Show the list">▾</button>'),
    o = Bt('<div class="combo-list" hidden></div>');
  (a.appendChild(s), a.appendChild(o));
  let i = [],
    l = -1,
    d = !1;
  const r = () => {
      ((o.hidden = !0), (l = -1));
    },
    c = () => {
      ([...o.children].forEach((e, t) => e.classList.toggle("on", t === l)),
        l >= 0 && o.children[l] && o.children[l].scrollIntoView({ block: "nearest" }));
    },
    u = (t) => {
      ((d = !0),
        (e.value = t),
        e.dispatchEvent(new Event("input", { bubbles: !0 })),
        e.dispatchEvent(new Event("change", { bubbles: !0 })),
        (d = !1),
        r(),
        e.focus());
    },
    p = (n) => {
      const a = n ? "" : e.value.trim().toLowerCase();
      if (((i = t().filter((e) => !a || e.toLowerCase().includes(a))), (o.innerHTML = ""), i.length))
        for (const e of i) {
          const t = Bt(`<button type="button" class="combo-opt">${Ht(e)}</button>`);
          (t.addEventListener("mousedown", (t) => {
            (t.preventDefault(), u(e));
          }),
            o.appendChild(t));
        }
      else o.appendChild(Bt('<div class="combo-empty">Nothing matches — type your own name.</div>'));
      ((l = -1), (o.hidden = !1));
    };
  (s.addEventListener("mousedown", (e) => e.preventDefault()),
    s.addEventListener("click", () => {
      o.hidden ? p(!0) : r();
    }),
    e.addEventListener("click", () => {
      !d && o.hidden && p(!0);
    }),
    e.addEventListener("input", () => {
      d || p(!1);
    }),
    e.addEventListener("blur", () => setTimeout(r, 150)),
    e.addEventListener("keydown", (e) => {
      "ArrowDown" === e.key
        ? (o.hidden ? p(!0) : ((l = Math.min(l + 1, i.length - 1)), c()), e.preventDefault())
        : "ArrowUp" !== e.key || o.hidden
          ? "Enter" === e.key && !o.hidden && l >= 0
            ? (u(i[l]), e.preventDefault())
            : "Escape" !== e.key || o.hidden || (r(), e.stopPropagation())
          : ((l = Math.max(l - 1, 0)), c(), e.preventDefault());
    }),
    n && e.focus());
}
let Nt;
function Ft(e) {
  const t = Ot("#toast");
  ((t.textContent = e),
    (t.hidden = !1),
    clearTimeout(Nt),
    (Nt = setTimeout(
      () => {
        t.hidden = !0;
      },
      Math.max(3200, 60 * String(e).length),
    )));
}
function Vt(e, t, n) {
  ((Ot("#modal").innerHTML =
    `<h3>${Ht(e)}<button class="x" data-close aria-label="Close">×</button></h3>\n    <div class="body">${t}</div><div class="foot">${n}</div>`),
    (Ot("#scrim").hidden = !1));
  const a = Ot("#modal").querySelector("input,select,textarea");
  a && a.focus();
}
function Rt() {
  ((Ot("#scrim").hidden = !0), (Ot("#modal").innerHTML = ""), r.dirty && ((r.dirty = !1), Ua()));
}
function Wt(e, t, n) {
  const a = t || 100,
    s = (n = n || {}).compact ? 64 : 92,
    o = n.compact ? 16 : 26,
    i = n.compact ? 26 : 30,
    l = Math.min(1, Math.max(0, e / a)),
    d = 26 + 404 * l,
    r = a <= 50 ? 1 : 2,
    c = a <= 30 || a <= 50 ? 5 : 10;
  let u = "";
  for (let e = 0; e <= a; e += r) {
    const t = 26 + (e / a) * 404,
      s = e % c === 0;
    ((u += `<line x1="${t}" y1="${o}" x2="${t}" y2="${o + (s ? 10 : 5)}" stroke="var(--ink-3)" stroke-width="${s ? 1.1 : 0.7}"/>`),
      s &&
        !n.compact &&
        (u += `<text x="${t}" y="${o + 22}" font-size="9" font-family="ui-monospace,monospace" fill="var(--ink-3)" text-anchor="middle">${e}</text>`));
  }
  return `<svg viewBox="0 0 520 ${s}" width="100%" height="${s}" role="img"\n    aria-label="Syringe filled to ${fe(e, 1)} of ${a} units">\n    <rect x="26" y="${o}" width="404" height="${i}" rx="3" fill="var(--field)" stroke="var(--rule)"/>\n    <rect x="26" y="${o}" width="${Math.max(0, d - 26)}" height="${i}" rx="3" fill="var(--signal-soft)"/>\n    <line x1="${d}" y1="${o - 7}" x2="${d}" y2="${o + i + 2}" stroke="var(--signal)" stroke-width="2"/>\n    ${u}\n    <rect x="430" y="${o + 7}" width="14" height="${i - 14}" fill="var(--ink-3)"/>\n    <line x1="444" y1="${o + i / 2}" x2="504" y2="${o + i / 2}" stroke="var(--ink-3)" stroke-width="2"/>\n    <rect x="12" y="${o - 4}" width="10" height="${i + 8}" rx="2" fill="var(--ink-3)"/>\n    <text x="${d}" y="${o - 11}" font-size="11" font-family="ui-monospace,monospace" fill="var(--signal)"\n      text-anchor="${l > 0.85 ? "end" : "middle"}">${fe(e, 1)}u</text></svg>`;
}
function jt(e, t, n) {
  n = n || 34;
  const a = Math.max(0, Math.min(1, e)) * (n - 12);
  return `<svg width="15" height="${n}" viewBox="0 0 15 ${n}" aria-hidden="true">\n    <rect x="2.5" y="5" width="10" height="${n - 7}" rx="2" fill="var(--field)" stroke="var(--rule)"/>\n    <rect x="2.5" y="${n - 2 - a}" width="10" height="${a}" rx="2" fill="${t}" opacity=".8"/>\n    <rect x="1" y="1.5" width="13" height="4" rx="1.5" fill="var(--ink-3)"/></svg>`;
}
function Gt(e, t, n) {
  n = n || 110;
  const a = Math.max(...e, 1e-9),
    s = Math.min(...e, 0),
    o = a - s || 1,
    i = e
      .map((t, a) => [8 + (a / (e.length - 1 || 1)) * 504, n - 8 - ((t - s) / o) * (n - 16)])
      .map((e, t) => (t ? "L" : "M") + ye(e[0], 1) + " " + ye(e[1], 1))
      .join(" ");
  return `<svg viewBox="0 0 520 ${n}" width="100%" height="${n}" preserveAspectRatio="none" role="img" aria-label="trend">\n    <path d="${i} L 512 ${n - 8} L 8 ${n - 8} Z" fill="var(--signal-soft)"/>\n    <path d="${i}" fill="none" stroke="var(--signal)" stroke-width="1.8" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>\n    <text x="8" y="12" font-size="10" font-family="ui-monospace,monospace" fill="var(--ink-3)">peak ${fe(a, 2)} ${t}</text></svg>`;
}
document.addEventListener("keydown", (e) => {
  "Escape" !== e.key || Ot("#scrim").hidden || Rt();
});
const Kt = 307,
  Jt = 776,
  zt =
    "data:image/webp;base64,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",
  Yt = `<image href="${zt}" x="0" y="0" width="307" height="776" aria-hidden="true"/>`,
  Zt = Yt + '<ellipse class="fignavel" cx="153" cy="301" rx="2.6" ry="3.2"/>',
  Xt =
    Yt +
    '<path class="figmark" d="M153 132V392"/><path class="figmark" d="M112 176Q124 214 146 204"/><path class="figmark" d="M194 176Q182 214 160 204"/><path class="figmark" d="M90 418Q116 432 149 424"/><path class="figmark" d="M216 418Q190 432 157 424"/>';
function _t(e, t) {
  return V.filter((n) => n[2] === e && (!t || n[5].includes(t)));
}
function en(e) {
  return ct(e);
}
function tn(e, t) {
  const n = rt(e);
  return t + (n ? " — last used " + se(n) + " (" + ae(n, te()) + "d ago)" : " — never used");
}
function nn(e, t, n, a) {
  let s = 1e9;
  for (const o of e) o[0] !== t && (s = Math.min(s, Math.hypot(o[3] - n, o[4] - a)));
  return Math.max(12, Math.min(24, s / 2));
}
function an(e, t, n, a) {
  const s = _t(e, a);
  return `<svg class="bodymap photo" viewBox="0 0 307 776" role="group" aria-label="${e} ${a || ""} injection sites">\n    ${"front" === e ? Zt : Xt}\n    ${s.map(([e, a, , o, i]) => `<g class="site" data-site="${e}" data-on="${t === e ? 1 : 0}"\n        data-rest="${n ? en(e) : ""}" role="button" tabindex="0" aria-label="${Ht(a)}">\n        <title>${Ht(tn(e, a))}</title>\n        <circle cx="${o}" cy="${i}" r="11"/><circle class="hit" cx="${o}" cy="${i}" r="${ye(nn(s, e, o, i), 1)}"/></g>`).join("")}\n  </svg>`;
}
function sn(e, t, n) {
  return `<div class="sitepick">\n    ${an(e, t, !0, n)}\n    <div class="sitelist">${_t(e, n)
    .map(
      ([e, n]) =>
        `<button class="sitebtn" data-site="${e}" data-on="${t === e ? 1 : 0}" data-rest="${en(e)}"\n        title="${Ht(tn(e, n))}">${Ht(n)}</button>`,
    )
    .join("")}</div></div>`;
}
const on = {
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/></svg>',
  today:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 7v5l3 2"/><circle cx="12" cy="12" r="8.5"/></svg>',
  proto:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 3h6M10 3v6.2L5.6 18a2.4 2.4 0 0 0 2.1 3.5h8.6A2.4 2.4 0 0 0 18.4 18L14 9.2V3"/><path d="M7.4 14.5h9.2"/></svg>',
  stock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 3h8v3.5l1.5 2V20a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V8.5L8 6.5V3z"/><path d="M6.5 13h11"/></svg>',
  hist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  label:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3.5 8.5A2 2 0 0 1 5.5 6.5h8l7 5.5-7 5.5h-8a2 2 0 0 1-2-2z"/><circle cx="8" cy="12" r="1.2"/></svg>',
  tools:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4.5" y="3" width="15" height="18" rx="2"/><path d="M8 7.5h8M8 12h2m3 0h3M8 16.5h2m3 0h3"/></svg>',
  lib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4.5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4z"/><path d="M20 4.5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/></svg>',
  weight:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 17l5-6 4 3.5L21 6"/><path d="M3 21h18"/></svg>',
  set: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3"/></svg>',
};
function ln() {
  const e = [
    ["instructions", "Instructions", on.help],
    ["today", "Today", on.today],
    ["protocols", "Protocols", on.proto],
    ["stock", "Stock", on.stock],
    ["history", "History", on.hist],
    ["labs", "Labs", LAB_ICON],
    ...(COMMUNITY ? [] : [["insights", "Insights", INS_ICON]]),
    ["labels", "Labels", on.label],
    ["tools", "Tools", on.tools],
    ["library", "Library", on.lib],
  ];
  return (
    d.settings.trackWeight && e.push(["weight", "Weight", on.weight]),
    e.push(["settings", "Settings", on.set]),
    e
  );
}
function dn() {
  const e = it(te()).reduce((a, e) => a + SLO(e).length, 0),
    t = Ot("#rail");
  t.innerHTML = "";
  const n = Bt(
    '<div class="brand"><b>Protocol</b><button class="addbtn" id="quickAdd" title="Log a shot" aria-label="Log a shot">+</button></div>',
  );
  (n.querySelector("#quickAdd").addEventListener("click", () => {
    ((r.tab = "log"), (r.logDraft = null), Ua());
  }),
    t.appendChild(n));
  for (const [n, a, s] of ln()) {
    const o = Bt(
      `<button class="navbtn" aria-current="${r.tab === n}">${s}<span>${a}</span>${"today" === n && e ? `<span class="dotcount">${e}</span>` : ""}</button>`,
    );
    (o.addEventListener("click", () => {
      ((r.tab = n), (r.sel = null), (r.labTest = null), (r.labHelp = !1), (r.insOpen = null), Ua());
    }),
      t.appendChild(o));
  }
  t.appendChild(
    Bt(
      `<div class="railfoot">A log, not medical advice.<br>\n    &copy; 2026 Korah Peptides. All rights reserved.<br>\n    <span class="mono" style="font-size:10.5px">Build ${Ht(o)}</span></div>`,
    ),
  );
}
function rn() {
  const e = te(),
    t = it(e),
    n = t.flatMap((t) => SLO(t)),
    a = Bt('<div class="stack"></div>'),
    s = d.settings.name ? ", " + d.settings.name : "";
  if (
    (a.appendChild(
      Bt(
        `<div class="head"><div>\n    <h1>Today${Ht(s)}</h1>\n    <p>${n.length ? `${n.length} shot${n.length > 1 ? "s" : ""} due.` : t.length ? "Everything due today is logged." : "Nothing scheduled today."}</p></div>\n    <div class="row">${d.protocols.length ? '<button class="btn" data-go="log">Log a shot</button>' : ""}</div></div>`,
      ),
    ),
    !d.protocols.length)
  ) {
    const e = Bt(
      '<div class="panel"><div class="empty"><b>Set up your first protocol</b>\n      A protocol is one compound, one dose and one schedule. Stock and the draw follow from it.<br><br>\n      <button class="btn" data-newproto="1">New protocol</button></div></div>',
    );
    return (a.appendChild(e), a);
  }
  const o = Bt('<div class="split"></div>'),
    i = Bt('<div class="stack"></div>'),
    l = t
      .flatMap((t) => SL(t).map((s) => ({ p: t, sl: s, log: st(t.id, e, s) })))
      .sort((e, t) => {
        const n = e.log ? 1 : 0,
          a = t.log ? 1 : 0;
        return n !== a
          ? n - a
          : (SLT(e.p, e.sl) || "99:99").localeCompare(SLT(t.p, t.sl) || "99:99") ||
              ht(pt(e.p.compoundId), pt(t.p.compoundId));
      }),
    r = Bt(
      `<div class="panel"><h2><span class="hdrwrap">Today's schedule<span class="hdrdate">${Ht(de(e))}</span></span>\n    <a href="#" data-go="history">Calendar</a></h2><div class="pbody"><div class="sched" id="sc"></div></div></div>`,
    ),
    c = r.querySelector("#sc");
  l.length || c.appendChild(Bt('<div class="empty">Nothing scheduled today.</div>'));
  for (const { p: e, log: t, sl: sl } of l) {
    const n = Ce(e.compoundId),
      a = Ue(e),
      s = ue(SLT(e, sl)),
      o = t ? t.status : "due",
      ds = sl ? ` data-slot="${sl}"` : "";
    c.appendChild(
      Bt(
        `<div class="schedrow" data-s="${o}">\n      <span class="schedbar"></span>\n      <button class="schedinner" data-logfor="${e.id}"${ds}>\n        <span class="schedtime">${s ? `<b>${s.t}</b><small>${s.ap}</small>` : sl ? `<b>${SLN(sl)}</b>` : "<i>Any<br>time</i>"}</span>\n        <span class="schedmain"><b>${Ht(n.name)}</b>\n          <span>${sl ? SLN(sl) + " dose · " : ""}${Ht(fe(be(a.dose), 3))}${Ht("iu" === a.unit ? "IU" : a.unit)}${a.units ? ` · ${fe(a.units, a.units % 1 ? 1 : 0)} units` : ""}${a.phase && a.phase.of ? ` · phase ${a.phase.phase}/${a.phase.of}` : ""}</span></span>\n      </button>\n      <span class="schedact">${"taken" === o ? `<button class="donebtn" data-undop="${e.id}"${ds} title="Logged — tap to undo">✓</button>` : "missed" === o ? `<button class="skipbtn" data-undop="${e.id}"${ds} title="Missed — tap to clear">✕</button>` : `<button class="logbtn" data-logp="${e.id}"${ds}>Log</button>`}</span>\n    </div>`,
      ),
    );
  }
  i.appendChild(r);
  const u = at(21, 5).filter((t) => t.date !== e);
  if (u.length) {
    const e = Bt('<div class="panel"><h2>Coming up</h2><div id="nu"></div></div>'),
      t = e.querySelector("#nu");
    for (const { date: e, protocol: n } of u) {
      const a = Ce(n.compoundId),
        s = ue(n.time);
      t.appendChild(
        Bt(
          `<div class="listrow"><span class="cbar" style="background:${a.color}"></span>\n        <span style="width:104px;flex:none" class="lmeta">${Ht(ce(e))}${s ? ` · ${s.t}${s.ap ? " " + s.ap.toLowerCase() : ""}` : ""}</span>\n        <span><span class="lname">${Ht(a.name)}</span><span class="lmeta">${((e) => `${Ht(fe(be(e.dose), 3))} ${Ht("iu" === e.unit ? "IU" : e.unit)}`)(Ge(n, e))}${n.split ? " · AM + PM" : ""}</span></span>\n      </div>`,
        ),
      );
    }
    i.appendChild(e);
  }
  o.appendChild(i);
  const p = Bt('<div class="stack"></div>'),
    h = vt([...new Set(d.protocols.map((e) => e.compoundId))]).filter((e) => HL(Ce(e)));
  if (h.length) {
    const e = Bt(
        '<div class="panel"><h2>Estimated in your system</h2><div class="pbody" id="lv"></div></div>',
      ),
      t = e.querySelector("#lv");
    for (const e of h) {
      const n = Ce(e),
        a = Et(e, Date.now()),
        s = Math.max(Tt(e), HL(n) ? 1e-9 : 0),
        o = Pt(e),
        i = o ? ae(o.date, te()) : null;
      t.appendChild(
        Bt(
          `<div style="margin-bottom:14px">\n        <div class="spread"><b>${Ht(n.name)}</b><b class="mono">${Ht($e(a, n))}</b></div>\n        <div class="tiny muted" style="margin:1px 0 6px">${o ? `Last shot ${0 === i ? "today" : 1 === i ? "yesterday" : i + " days ago"} · ${Ht($e(be(o.doseMg), n))}` : "Nothing logged yet"}</div>\n        <div class="bar"><i style="width:${s > 0 ? Math.min(100, (a / s) * 100) : 0}%;background:${n.color}"></i></div>\n      </div>`,
        ),
      );
    }
    (t.appendChild(
      Bt(
        '<p class="tiny muted" style="margin:0">Exponential decay from your logged shots, drawn against each compound\'s recent peak. An estimate, not a clinical figure.</p>',
      ),
    ),
      p.appendChild(e));
  }
  const m = Bt(
      '<div class="panel"><h2>All stock<a href="#" data-go="stock">View all</a></h2><div id="st"></div></div>',
    ),
    g = m.querySelector("#st"),
    v = [...new Set(d.batches.filter((e) => "finished" !== e.status).map((e) => e.compoundId))];
  v.length || g.appendChild(Bt('<div class="empty tiny">Nothing in stock yet.</div>'));
  for (const e of v) {
    const t = Ce(e),
      n = At(e);
    ($t(e),
      g.appendChild(
        Bt(
          `<div class="listrow"><span class="cbar" style="background:${t.color}"></span>\n      <span><span class="lname">${Ht(t.name)}</span><span class="lmeta">${Ht($e(wt(e), t))} on hand</span></span>\n      <span class="lright"><span class="mono tiny">${null === n ? "—" : Ht(ke(n)) + " left"}</span></span></div>`,
        ),
      ));
  }
  p.appendChild(m);
  const b = dt(30);
  return (
    p.appendChild(
      Bt(
        `<div class="panel"><h2>Adherence</h2><div class="pbody">\n    <div class="big-read">${null === b.pct ? "—" : b.pct + "%"}<small> last 30 days · ${b.taken}/${b.sched}</small></div></div></div>`,
      ),
    ),
    o.appendChild(p),
    a.appendChild(o),
    a
  );
}
function cn(e, t) {
  return (e && e.route) || (Ce(t) || {}).route || "SubQ";
}
function un(e, sl) {
  const t = e ? Le(e) : d.protocols.find((e) => e.active && Ye(e, te())) || d.protocols[0],
    n = new Date();
  if (!t) {
    const e = (d.compounds[0] || {}).id || "";
    return {
      protocolId: "",
      compoundId: e,
      dose: "",
      unit: "mg",
      mode: "amount",
      purge: 0,
      batchId: "",
      site: "",
      route: cn(null, e),
      when: he(n),
      notes: "",
    };
  }
  const a = Ee(t.compoundId),
    s = Ge(t, te());
  return {
    protocolId: t.id,
    compoundId: t.compoundId,
    dose: s.dose,
    unit: s.unit,
    mode: "amount",
    purge: 0,
    batchId: a ? a.id : "",
    site: "",
    route: cn(t, t.compoundId),
    when: he(n),
    notes: "",
    pen: !!t.pen,
    slot: t.split ? sl || SLO(t)[0] || (n.getHours() < 12 ? "am" : "pm") : "",
  };
}
function pn() {
  if (!d.protocols.length && !d.compounds.length) {
    const e = Bt('<div class="stack"></div>');
    return (
      e.appendChild(
        Bt('<div class="head"><div><h1>Log a shot</h1><p>Nothing to log against yet.</p></div></div>'),
      ),
      e.appendChild(
        Bt(
          '<div class="panel"><div class="empty"><b>Add a protocol first</b>\n      <button class="btn" data-newproto="1" style="margin-top:10px">New protocol</button></div></div>',
        ),
      ),
      e
    );
  }
  r.logDraft || (r.logDraft = un());
  const e = r.logDraft;
  e.route || (e.route = cn(Le(e.protocolId), e.compoundId));
  const t = Bt('<div class="stack"></div>');
  t.appendChild(
    Bt(
      '<div class="head"><div><h1>Log a shot</h1>\n    <p>Picking a protocol fills in today’s dose. Change anything before you save it.</p></div></div>',
    ),
  );
  const n = Bt('<div class="split"></div>'),
    a = Bt('<div class="panel"><div class="pbody" id="lf"></div></div>'),
    s = Bt('<div class="stack" id="rf"></div>');
  (n.appendChild(a), n.appendChild(s), t.appendChild(n));
  const o = a.querySelector("#lf");
  o.innerHTML = `\n    <div class="field"><label for="lg-p">Protocol</label>\n      <select id="lg-p"><option value="">Not from a protocol</option>\n        ${yt(
    gt(),
    (e) => e.active,
    (t) => {
      const n = Ge(t, te());
      return `<option value="${t.id}"${e.protocolId === t.id ? " selected" : ""}>${Ht(Ce(t.compoundId).name)} · ${Ht(fe(be(n.dose), 3))} ${Ht(n.unit)} · ${Ht(cn(t, t.compoundId))}${t.split ? " · AM + PM" : ""}</option>`;
    },
  )}\n      </select></div>\n    ${(Le(e.protocolId) || {}).split ? `<div class="field"><label>Which dose</label><div class="seg" id="lg-slot">${["am", "pm"].map((s) => `<button type="button" data-sl="${s}" aria-pressed="${e.slot === s}">${SLN(s)}${st(e.protocolId, _(new Date(e.when)), s) ? " · logged" : ""}</button>`).join("")}</div><span class="hint">This protocol is split into a morning and an evening shot.</span></div>` : ""}\n    <div class="field"><label for="lg-c">Compound</label>\n      <select id="lg-c">${yt(
    bt(),
    (e) => mt(e.id),
    (t) => `<option value="${t.id}"${e.compoundId === t.id ? " selected" : ""}>${Ht(t.name)}</option>`,
  )}</select></div>\n    <div class="field">\n      <div class="spread"><label for="lg-d" style="margin:0">Dose</label>\n        <div class="seg" id="lg-mode"><button data-mode="amount" aria-pressed="${"amount" === e.mode}">Amount</button>\n          <button data-mode="volume" aria-pressed="${"volume" === e.mode}">Volume</button></div></div>\n      <div class="unitwrap"><input id="lg-d" type="number" step="any" min="0" value="${Ht(e.dose)}">\n        ${"amount" === e.mode ? `<select id="lg-u"><option value="mg"${"mg" === e.unit ? " selected" : ""}>mg</option><option value="mcg"${"mcg" === e.unit ? " selected" : ""}>mcg</option><option value="iu"${"iu" === e.unit ? " selected" : ""}>IU</option></select>` : `<select id="lg-u"><option value="units"${"units" === e.unit ? " selected" : ""}>units</option><option value="mL"${"mL" === e.unit ? " selected" : ""}>mL</option></select>`}\n      </div></div>\n    <div id="lg-draw"></div>\n    <div class="field"><label for="lg-purge">Purged priming the needle (units)</label>\n      <input id="lg-purge" type="number" step="any" min="0" value="${Ht(e.purge)}">\n      <span class="hint">Optional. Units pushed out before injecting — they come off the vial too.</span></div>\n    <div class="field"><label for="lg-b">Comes off this vial</label>\n      <select id="lg-b"><option value="">Do not touch stock</option>\n        ${d.batches
    .filter((e) => "finished" !== e.status)
    .map((t) => {
      const n = Ce(t.compoundId);
      return `<option value="${t.id}"${e.batchId === t.id ? " selected" : ""}>${Ht(n ? n.name : "?")} · ${Ht(He(t))} · ${Ht($e(be(t.openMg), n))} left${t.vendor ? " · " + Ht(t.vendor) : ""}</option>`;
    })
    .join(
      "",
    )}\n      </select><span class="hint">Which open vial this dose comes out of.</span></div>\n    <div id="lg-nvbox"></div>`;
  const i = s;
  let l = null;
  function c() {
    const t = qe(e.batchId),
      n = Ce(t ? t.compoundId : e.compoundId),
      a = t ? String(null == t.bacMl ? "" : t.bacMl) : "";
    (e.newBacFor === e.batchId && e.newBacBase === a) ||
      ((e.newBacFor = e.batchId), (e.newBacBase = a), (e.newBac = be(a) ? a : ""));
    const s = t ? be(t.sealed) : 0,
      i = t ? be(t.openMg) : 0,
      r = !!(t && s > 0 && i > 0);
    r || (e.newVial = !1);
    const u = !!(t && s > 0 && (e.newVial || i <= 0)),
      p = u ? be(e.newBac) : t ? be(t.bacMl) : 0,
      m = !e.pen && t && p > 0 ? be(t.vialMg) / p : 0;
    let g = 0,
      v = 0,
      b = 0;
    ("amount" === e.mode
      ? ((g = Se(e.dose, e.unit)), (b = m > 0 ? g / m : 0), (v = b * Oe))
      : ((b = "units" === e.unit ? be(e.dose) / Oe : be(e.dose)), (v = b * Oe), (g = b * m)),
      (e._doseMg = g),
      (e._units = v),
      (e._volMl = b),
      (e._conc = m),
      (e._drawMl = p));
    const y = m ? (be(e.purge) / Oe) * m : 0,
      f = !!(t && s > 0 && !u && i < g + y - 1e-9);
    ((e._opens = u || f),
      (function (t, n, a) {
        const s = [t ? t.id : "", n, a, !!e.newVial].join("|");
        if (s === l) return;
        l = s;
        const i = o.querySelector("#lg-nvbox");
        if (!t || (!a && !n)) return void (i.innerHTML = "");
        const d = Ce(t.compoundId),
          r = be(t.sealed),
          u = be(t.openMg),
          p = be(t.bacMl);
        let h = "";
        (a &&
          (h += `<label class="check" style="margin-bottom:4px"><input type="checkbox" id="lg-nv"${e.newVial ? " checked" : ""}><span>This shot starts a new vial</span></label>\n      <p class="tiny muted" style="margin:0 0 12px">Tick when the vial you were using ran dry. The ${Ht($e(u, d))} the tracker still shows in it is written off, one of your ${Ht(r)} sealed vials is opened (mixed today), and this dose comes out of it.</p>`),
          "empty" === n &&
            (h += `<p class="tiny muted" style="margin:0 0 12px">The tracker shows this vial empty, so saving opens one of your ${Ht(r)} sealed vials (mixed today) and this dose comes out of it.</p>`),
          "spill" === n &&
            (h += `<p class="tiny muted" style="margin:0 0 12px">Only ${Ht($e(u, d))} is left in the open vial, so the rest of this dose comes out of a new one: one of your ${Ht(r)} sealed vials, mixed today.</p>`),
          n &&
            !e.pen &&
            (h += `<div class="field"><label for="lg-nvbac">Water in the new vial (mL)</label>\n      <input id="lg-nvbac" type="number" step="any" min="0" value="${Ht(e.newBac)}">\n      <span class="hint">${p ? `Filled in from the last vial (${Ht(fe(p, 2))} mL). Change it if you mixed this one differently.` : "Enter the water you mixed it with."} It is saved to this stock entry.</span></div>`),
          (i.innerHTML = h));
        const m = i.querySelector("#lg-nv");
        m &&
          m.addEventListener("change", (t) => {
            ((e.newVial = t.target.checked), c());
          });
        const g = i.querySelector("#lg-nvbac");
        g &&
          g.addEventListener("input", (t) => {
            ((e.newBac = t.target.value), c());
          });
      })(t, u ? (e.newVial ? "tick" : "empty") : f ? "spill" : "", r),
      (o.querySelector("#lg-draw").innerHTML =
        m > 0
          ? `<div style="background:var(--surface-2);border:1px solid var(--rule-soft);border-radius:7px;padding:10px 12px;margin:-4px 0 12px">\n      <div class="tiny mono" style="color:var(--signal);margin-bottom:2px">${fe(b, 3)} mL · ${fe(v, 1)} units${"volume" === e.mode ? " · " + $e(g, Ce(e.compoundId)) : ""}</div>\n      ${Wt(v, d.settings.barrel, { compact: !0 })}\n      <div class="tiny muted" id="lg-mix">${u ? "New vial: " : ""}${Ht(fe(be(t.vialMg), 2))} ${xe(n)} + ${Ht(fe(p, 2))} mL water = ${fe(m, 2)} ${Ae(n)}</div>\n      ${v > d.settings.barrel ? `<div class="tiny" style="color:var(--alert)">Bigger than your ${d.settings.barrel}-unit barrel.</div>` : ""}\n    </div>`
          : e.pen
            ? '<p class="tiny muted" style="margin:-4px 0 12px">Pre-filled pen: dial it to the dose above. Nothing to draw.</p>'
            : `<p class="tiny" style="color:var(--due);margin:-4px 0 12px">${u ? "Enter the water you mixed the new vial with to see the draw." : "Pick a vial that has been mixed with water to see the draw."}</p>`),
      h());
  }
  function u() {
    if (!e.site) return "No site chosen — tap one, or leave it blank.";
    const t = J(e.site);
    return `<b style="color:var(--ink)">${Ht(K(e.site))}</b>${t ? `<br>${Ht(t)}` : ""}`;
  }
  function p() {
    return Y.includes(e.route)
      ? `<div id="lg-sites">${sn(r.siteView, e.site, e.route)}</div>\n      <p class="tiny muted" id="lg-sitename" style="text-align:center;margin:8px 0 0">${u()}</p>\n      <div class="legend" style="border:0;padding:8px 0 0;justify-content:center">\n        <span><i style="width:9px;height:9px;border-radius:50%;background:var(--done-soft);border:1.4px solid var(--done)"></i>rested</span>\n        <span><i style="width:9px;height:9px;border-radius:50%;background:var(--due-soft);border:1.4px solid var(--due)"></i>3–6 days</span>\n        <span><i style="width:9px;height:9px;border-radius:50%;background:var(--alert-soft);border:1.4px solid var(--alert)"></i>under 3 days</span>\n      </div>`
      : `<p class="tiny muted" style="text-align:center;margin:0">Route is ${Ht(e.route)}, so no injection site. Tap SubQ or IM above if this one was injected.</p>`;
  }
  function h() {
    const t = Ce(e.compoundId),
      n = t ? HL(t) : 0,
      a = new Date(e.when).getTime() || Date.now();
    let s = "";
    if (n) {
      const o = Et(e.compoundId, a) || 0,
        i = o + e._doseMg,
        l = (e) => i * Math.pow(0.5, e / n);
      s = `<div class="panel"><h2>Level in body<span class="mono tiny">${Ht($e(o, t))} now</span></h2><div class="pbody">\n        <div class="big-read">${Ht($e(i, t))}<small> right after this shot</small></div>\n        <div class="bar" style="margin:10px 0 12px"><i style="width:100%;background:${t.color}"></i></div>\n        <div class="kv"><span>In 24 h</span><b>${Ht($e(l(24), t))}</b></div>\n        <div class="kv"><span>In 72 h</span><b>${Ht($e(l(72), t))}</b></div>\n        <div class="kv"><span>As a multiple of this dose</span><b>${e._doseMg ? fe(i / e._doseMg, 2) : "—"}×</b></div>\n        <p class="tiny muted" style="margin:10px 0 0">Exponential decay from each dose, ignoring absorption time. An estimate, not a clinical figure.</p>\n      </div></div>`;
    }
    i.innerHTML =
      s +
      `\n      <div class="panel"><h2>Injection site<div class="seg" id="lg-view">\n        <button data-view="front" aria-pressed="${"front" === r.siteView}">Front</button>\n        <button data-view="back" aria-pressed="${"back" === r.siteView}">Back</button></div></h2>\n        <div class="pbody">\n          <div class="spread" style="margin:0 0 12px"><span class="tiny muted">Route for this shot</span>\n            <div class="seg" id="lg-route">${Y.map((t) => `<button data-route="${t}" aria-pressed="${e.route === t}">${t}</button>`).join("")}</div></div>\n          <div id="lg-sitebox">${p()}</div>\n        </div></div>\n      <div class="panel"><div class="pbody">\n        <div class="field"><label for="lg-when">When</label><input id="lg-when" type="datetime-local" value="${Ht(e.when)}"></div>\n        <div class="field"><label for="lg-n">Notes</label><textarea id="lg-n" placeholder="Optional">${Ht(e.notes)}</textarea></div>\n        <button class="btn big" id="lg-save">Log this shot</button>\n        <p class="tiny muted" style="text-align:center;margin:10px 0 0"><a href="#" data-go="history">View shot history</a></p>\n      </div></div>`;
    const o = () => {
        i.querySelectorAll("#lg-sites [data-site]").forEach((t) =>
          t.setAttribute("data-on", t.dataset.site === e.site ? "1" : "0"),
        );
        const t = i.querySelector("#lg-sitename");
        t && (t.innerHTML = u());
      },
      l = () => {
        i.querySelectorAll("#lg-sites [data-site]").forEach((t) => {
          const n = () => {
            ((e.site = e.site === t.dataset.site ? "" : t.dataset.site), o());
          };
          (t.addEventListener("click", n),
            "BUTTON" !== t.tagName &&
              t.addEventListener("keydown", (e) => {
                ("Enter" !== e.key && " " !== e.key) || (e.preventDefault(), n());
              }));
        });
      };
    (i.querySelectorAll("#lg-view button").forEach((t) =>
      t.addEventListener("click", () => {
        ((r.siteView = t.dataset.view),
          i.querySelectorAll("#lg-view button").forEach((e) => e.setAttribute("aria-pressed", e === t)));
        const n = i.querySelector("#lg-sites");
        (n && (n.innerHTML = sn(r.siteView, e.site, e.route)), l(), o());
      }),
    ),
      i.querySelectorAll("#lg-route button").forEach((t) =>
        t.addEventListener("click", () => {
          ((e.route = t.dataset.route),
            e.site && !z(e.site).includes(e.route) && (e.site = ""),
            i.querySelectorAll("#lg-route button").forEach((e) => e.setAttribute("aria-pressed", e === t)),
            (i.querySelector("#lg-sitebox").innerHTML = p()),
            l());
        }),
      ),
      l(),
      i.querySelector("#lg-when").addEventListener("change", (t) => {
        ((e.when = t.target.value), h());
      }),
      i.querySelector("#lg-n").addEventListener("input", (t) => {
        e.notes = t.target.value;
      }),
      i.querySelector("#lg-save").addEventListener("click", hn));
  }
  return (
    o.querySelectorAll("#lg-slot button").forEach((t) =>
      t.addEventListener("click", () => {
        ((e.slot = t.dataset.sl),
          o.querySelectorAll("#lg-slot button").forEach((e) => e.setAttribute("aria-pressed", e === t)));
      }),
    ),
    o.querySelector("#lg-p").addEventListener("change", (t) => {
      t.target.value
        ? ((r.logDraft = un(t.target.value)), (r.logDraft.when = e.when), Ua())
        : ((e.protocolId = ""), (e.pen = !1), c());
    }),
    o.querySelector("#lg-c").addEventListener("change", (t) => {
      e.compoundId = t.target.value;
      const n = Ee(e.compoundId);
      ((e.batchId = n ? n.id : ""),
        e.protocolId ||
          ((e.route = cn(null, e.compoundId)), e.site && !z(e.site).includes(e.route) && (e.site = "")),
        Ua());
    }),
    o.querySelectorAll("#lg-mode button").forEach((t) =>
      t.addEventListener("click", () => {
        ((e.mode = t.dataset.mode),
          (e.unit = "amount" === e.mode ? "mg" : "units"),
          "volume" === e.mode && e._units && (e.dose = ye(e._units, 2)),
          Ua());
      }),
    ),
    o.querySelector("#lg-d").addEventListener("input", (t) => {
      ((e.dose = t.target.value), c());
    }),
    o.querySelector("#lg-u").addEventListener("change", (t) => {
      ((e.unit = t.target.value), c());
    }),
    o.querySelector("#lg-purge").addEventListener("input", (t) => {
      ((e.purge = t.target.value), c());
    }),
    o.querySelector("#lg-b").addEventListener("change", (t) => {
      ((e.batchId = t.target.value), c());
    }),
    c(),
    t
  );
}
function hn() {
  const e = r.logDraft;
  if (!e._doseMg && "amount" === e.mode && !be(e.dose)) return void Ft("Enter a dose first.");
  const t = new Date(e.when),
    n = e._conc ? (be(e.purge) / Oe) * e._conc : 0,
    a = {
      id: ve(),
      protocolId: e.protocolId,
      compoundId: e.compoundId,
      date: _(t),
      at: t.toISOString(),
      status: "taken",
      doseMg: ye(e._doseMg, 6),
      units: ye(e._units, 2),
      volMl: ye(e._volMl, 4),
      purgeUnits: be(e.purge),
      purgeMg: ye(n, 6),
      batchId: e.batchId,
      site: e.site,
      route: e.route || "",
      notes: e.notes,
      ...(e.protocolId && e.slot && (Le(e.protocolId) || {}).split ? { slot: e.slot } : {}),
    },
    o = e.protocolId ? st(e.protocolId, a.date, a.slot) : null;
  if (o && "taken" === o.status) {
    if (
      !confirm(
        a.slot
          ? `The ${SLN(a.slot)} dose of this protocol is already logged on that day. Add another anyway?`
          : "You already have a shot logged against this protocol on that day. Add another anyway?",
      )
    )
      return;
  } else o && mn(o.id, !0);
  if ((d.logs.push(a), e.batchId)) {
    const t = qe(e.batchId),
      n = !!(e.newVial && t && be(t.sealed) > 0 && be(t.openMg) > 0);
    t && ((a.vialMg = be(t.vialMg)), be(e._drawMl) && (a.bacMl = be(e._drawMl)));
    const s = It(e.batchId, a.doseMg + a.purgeMg, n, e._opens ? be(e.newBac) : 0);
    s && ((a.opened = s), n && (a.newVial = !0));
  }
  (fn("shot"), s(), (r.logDraft = null), (r.tab = "today"), Ua());
  const i = a.opened ? qe(a.batchId) : null;
  Ft(
    `Logged ${$e(a.doseMg, Ce(a.compoundId))} of ${Ce(a.compoundId).name}.${i ? ` New vial opened${be(i.bacMl) ? `, mixed with ${fe(be(i.bacMl), 2)} mL` : ""}.` : ""}`,
  );
}
function mn(e, t) {
  const n = d.logs.find((t) => t.id === e);
  if (n) {
    if ("taken" === n.status && n.batchId) {
      const e = qe(n.batchId),
        t = n.opened;
      e && t && t.tok && e.openTok === t.tok && Math.abs(be(e.openMg) + be(t.fromNew) - be(e.vialMg)) < 1e-6
        ? Lt(e, t)
        : qt(n.batchId, be(n.doseMg) + be(n.purgeMg));
    }
    ((d.logs = d.logs.filter((t) => t.id !== e)), t || s());
  }
}
function gn(e, t, sl) {
  const n = Le(e);
  if (!n) return;
  sl = n.split ? sl || "am" : "";
  const a = st(e, te(), sl);
  a && mn(a.id, !0);
  const o = Ue(n),
    i = new Date(),
    l = {
      id: ve(),
      protocolId: e,
      compoundId: n.compoundId,
      date: te(),
      at: i.toISOString(),
      status: t,
      doseMg: "taken" === t ? ye(o.doseMg, 6) : 0,
      units: "taken" === t ? ye(o.units, 2) : 0,
      volMl: ye(o.volMl, 4),
      purgeUnits: 0,
      purgeMg: 0,
      batchId: "taken" === t && o.batch ? o.batch.id : "",
      site: "",
      notes: "",
      ...(sl ? { slot: sl } : {}),
    };
  d.logs.push(l);
  let r = null;
  return (
    l.batchId && (vn(l), (r = It(l.batchId, l.doseMg)), r && (l.opened = r)),
    "taken" === t && fn("shot"),
    s(),
    yn(n, l, t) || (r ? bn(l) : "")
  );
}
function vn(e) {
  const t = qe(e.batchId);
  t && ((e.vialMg = be(t.vialMg)), be(t.bacMl) && (e.bacMl = be(t.bacMl)));
}
function bn(e) {
  const t = qe(e.batchId),
    n = Ce(e.compoundId);
  return (Le(e.protocolId) || {}).pen
    ? "Logged. That started a new pen."
    : t
      ? `Logged. That opened a new ${n ? n.name : ""} vial, counted as mixed with ${fe(be(t.bacMl), 2)} mL like the last one. If you used a different amount, change it on Stock.`
      : "";
}
function yn(e, t, n) {
  return "taken" !== n || e.pen || be(t.units) > 0
    ? ""
    : t.batchId
      ? `Logged, but no units worked out — ${pt(e.compoundId)} has no water entered for its vial. The dose still came off stock; add the water on Stock.`
      : `Logged, but no units worked out — ${pt(e.compoundId)} has no vial in stock, so stock was not touched.`;
}
function fn(e) {
  for (const t of d.supplies) t.per === e && (t.count = Math.max(0, be(t.count) - be(t.each || 1)));
}
function wn(e) {
  for (const t of d.supplies) t.per === e && (t.count = be(t.count) + be(t.each || 1));
}
function kn() {
  const e = Bt('<div class="stack"></div>'),
    t = Bt(
      `<div class="head"><div><h1>Protocols</h1>\n    <p>${d.protocols.filter((e) => e.active).length} active. A protocol is one compound on one dose and one schedule, optionally for a set number of weeks.</p></div>\n    <button class="btn" data-newproto="1">New protocol</button></div>`,
    );
  if ((e.appendChild(t), !d.protocols.length))
    return (
      e.appendChild(
        Bt(
          '<div class="panel"><div class="empty"><b>No protocols yet</b>Add one to get a schedule, a draw and a stock countdown.</div></div>',
        ),
      ),
      e
    );
  let n = Bt('<div class="grid2"></div>'),
    a = !1;
  for (const t of gt()) {
    t.active ||
      a ||
      ((a = !0),
      e.appendChild(n),
      e.appendChild(Bt('<div class="eyebrow" style="margin:6px 0 -4px">Not running</div>')),
      (n = Bt('<div class="grid2"></div>')));
    const s = Ce(t.compoundId),
      o = Ue(t),
      i = t.split
        ? SLO(t).length
          ? null
          : (() => {
              const m = SL(t).filter((x) => "taken" !== st(t.id, te(), x).status).length;
              return {
                status: m ? "missed" : "taken",
                txt: m ? (2 === m ? "Both missed today" : "1 missed today") : "Both doses logged",
              };
            })()
        : st(t.id, te()),
      l = Xe(t),
      d = nt(t, te()),
      r = Re(t, te()),
      c = t.cycling && !r.on;
    let u = null;
    if (c)
      for (let e = 1; e <= 400; e++) {
        const n = ne(te(), e);
        if (Re(t, n).on) {
          u = n;
          break;
        }
      }
    const p = Je(t, te());
    n.appendChild(
      Bt(
        `<div class="panel"><div class="pbody">\n      <div class="spread" style="margin-bottom:2px"><b style="font-size:17px">${Ht(s.name)}</b>\n        ${t.active ? (c ? '<span class="pill">Resting</span>' : i ? `<span class="pill ${"taken" === i.status ? "done" : "late"}">${i.txt || ("taken" === i.status ? "Logged today" : "Missed today")}</span>` : Ye(t, te()) ? `<span class="pill due">${t.split && 1 === SLO(t).length ? SLN(SLO(t)[0]) + " dose due" : "Due today"}</span>` : '<span class="pill">Scheduled</span>') : '<span class="pill">Paused</span>'}</div>\n      <div class="muted tiny" style="margin-bottom:12px">${Ht(fe(be(o.dose), 3))} ${Ht("iu" === o.unit ? "IU" : o.unit)}${o.phase && o.phase.of ? ` · phase ${o.phase.phase} of ${o.phase.of}${o.phase.holding ? ", held" : ""}` : ""} · ${Ht(_e(t))} · ${Ht(t.route || "SubQ")}</div>\n      ${Sn(t, o.dose, o.unit) ? `<div class="blsplit">${Ht(Sn(t, o.dose, o.unit))}</div>` : ""}\n      ${je(t) ? `<div class="note warn" style="margin:0 0 12px"><span>⚠</span><span>${je(t)} titration step${1 === je(t) ? " has" : "s have"} no length, so ${1 === je(t) ? "it is" : "they are"} being skipped and the dose above is off. Tap Edit and give ${1 === je(t) ? "it" : "each of them"} a duration.</span></div>` : ""}\n      ${c ? `<div class="note" style="margin:0 0 12px"><span>ⓘ</span><span>Resting${u ? ` until ${Ht(oe(u))}` : ""}. Nothing is scheduled meanwhile.</span></div>` : ""}\n      ${p ? `<div class="tiny muted" style="margin:-6px 0 12px">Next change ${Ht(oe(p.date))}: ${fe(be(p.dose.dose), 3)} ${"iu" === p.dose.unit ? "IU" : p.dose.unit} · ${Ht(et(EF(t, p.date)))}</div>` : ""}\n      <div class="grid2" style="gap:10px">\n        <div><div class="eyebrow" style="margin-bottom:2px">Next shot</div><b>${d ? Ht(ce(d)) : "—"}</b></div>\n        <div><div class="eyebrow" style="margin-bottom:2px">Length</div>\n          <b>${be(t.weeks) ? Ht(t.weeks) + " weeks" : "Open ended"}</b>\n          ${null !== l ? `<div class="tiny muted">${l <= 0 ? "Finished" : fe(l, 1) + " weeks left"}</div>` : ""}</div>\n        <div><div class="eyebrow" style="margin-bottom:2px">Draw</div><b class="mono">${t.pen ? "Pen" : o.units ? fe(o.units, 1) + "u" : "—"}</b>\n          <div class="tiny muted">${t.pen ? "nothing to draw" : o.batch ? Ht(He(o.batch)) : "no vial in stock"}</div></div>\n        <div><div class="eyebrow" style="margin-bottom:2px">Stock</div><b class="mono">${Ht($e(wt(t.compoundId), s))}</b></div>\n      </div>\n      ${be(t.weeks) ? `<div class="bar" style="margin:12px 0 0"><i style="width:${Math.max(0, Math.min(100, 100 * (1 - (l || 0) / be(t.weeks))))}%;background:${s.color}"></i></div>` : ""}\n      <div class="row" style="margin-top:14px">\n        <button class="btn" style="flex:1" data-logfor="${t.id}">Log a shot</button>\n        <button class="btn ghost" data-pauseproto="${t.id}">${t.active ? "Pause" : "Resume"}</button>\n        <button class="btn ghost" data-editproto="${t.id}">Edit</button></div>\n    </div></div>`,
      ),
    );
  }
  return (e.appendChild(n), e);
}
function Sn(e, t, n) {
  if (!e || !e.blend) return "";
  const a = (e.parts || []).filter((e) => e.name && be(e.dose) > 0),
    s = a.reduce((e, t) => e + be(t.dose), 0);
  if (a.length < 1 || !s) return "";
  const o = "iu" === n ? "IU" : n;
  return a.map((e) => `${e.name} ${fe((be(t) * be(e.dose)) / s, 3)} ${o}`).join(" + ");
}
function Mn(e) {
  const DR = DG(e),
    t = DR
      ? DR.t
      : e
        ? Object.assign({}, Le(e))
        : {
            id: ve(),
            compoundId: "",
            dose: 250,
            unit: "mcg",
            route: "SubQ",
            time: "",
            sched: "daily",
            days: [1, 3, 5],
            intervalDays: 2,
            cycleOn: 5,
            cycleOff: 2,
            startDate: te(),
            weeks: "",
            active: !0,
            notes: "",
            escalate: !1,
            phases: [],
            cycling: !1,
            cycleOnN: 8,
            cycleOnUnit: "weeks",
            cycleOffN: 4,
            cycleOffUnit: "weeks",
            cycleResume: "final",
          };
  t.phases = (t.phases || []).map((e) => Object.assign({}, e));
  const n = DR ? DR.name : (t.compoundId && (Ce(t.compoundId) || {}).name) || "";
  Vt(
    e ? "Edit protocol" : "New protocol",
    `${DR ? `<div class="note warn" style="margin:0 0 14px;align-items:center;flex-wrap:wrap"><span>↺</span><span style="flex:1;min-width:160px">Picked up where you left off (${Ht(DT(DR.at))}).</span><button type="button" class="btn ghost sm" id="p-discard">Start over</button></div>` : ""}\n    <datalist id="lib">${u.map((e) => `<option value="${Ht(e[0])}">`).join("")}</datalist>\n    <div class="field"><label for="p-name">Compound</label>\n      <input id="p-name" list="lib" value="${Ht(n)}" placeholder="Start typing — the list has common ones">\n      <span class="hint">Anything not on the list is added as your own.</span></div>\n    <fieldset><legend>Dose</legend><div class="fgrid3">\n      <div class="field"><label for="p-dose" id="p-dlab">${t.split ? "Amount per shot" : "Amount"}</label><input id="p-dose" type="number" step="any" min="0" value="${Ht(t.dose)}">\n        <span class="hint" id="p-dosenote" hidden></span><span class="hint" id="p-daily"></span></div>\n      <div class="field"><label for="p-unit">Measured in</label><select id="p-unit">\n        <option value="mcg"${"mcg" === t.unit ? " selected" : ""}>mcg</option><option value="mg"${"mg" === t.unit ? " selected" : ""}>mg</option>\n        <option value="iu"${"iu" === t.unit ? " selected" : ""}>IU</option></select></div>\n      <div class="field"><label>Doses per day</label><div class="seg" id="p-split"><button type="button" data-split="0" aria-pressed="${!t.split}">Once</button><button type="button" data-split="1" aria-pressed="${!!t.split}">Split AM + PM</button></div>\n        <span class="hint">Split gives you a morning and an evening shot, each this amount.</span></div>\n      <div class="field"><label for="p-time" id="p-tlab">${t.split ? "AM time" : "Time of day"}</label><input id="p-time" type="time" value="${Ht(t.time || "")}">\n        <span class="hint" id="p-thint">${t.split ? "Optional — leave blank and Today just says AM." : "Optional — orders your Today list."}</span></div>\n      <div class="field" id="p-t2" style="${t.split ? "" : "display:none"}"><label for="p-time2">PM time</label><input id="p-time2" type="time" value="${Ht(t.time2 || "")}">\n        <span class="hint">Optional — leave blank and Today just says PM.</span></div>\n      <div class="field"><label for="p-route">Route</label><select id="p-route">\n        ${["SubQ", "IM", "Oral", "Nasal", "Topical"].map((e) => `<option${t.route === e ? " selected" : ""}>${e}</option>`).join("")}</select></div>\n    </div></fieldset>\n    <div class="togrow" style="border-top:0;padding-top:0;margin-bottom:6px">\n      <div><b>Blend</b><span>Several peptides in one vial</span></div>\n      <label class="switch"><input type="checkbox" id="p-blend" ${t.blend ? "checked" : ""}><i></i></label></div>\n    <div id="p-blendbox" style="margin-bottom:14px" ${t.blend ? "" : "hidden"}></div>\n    <div class="togrow" style="margin-bottom:6px"><div><b>Pre-filled pen</b><span>Comes ready to inject, nothing to mix or draw (Mounjaro, Ozempic and the like)</span></div>\n      <label class="switch"><input type="checkbox" id="p-pen" ${t.pen ? "checked" : ""}><i></i></label></div>\n    <fieldset id="p-mixfs" ${t.pen ? "hidden" : ""}><legend>Vial mix</legend>\n      <div class="field"><label for="p-water">Bac water added to the vial (mL)</label>\n        <input id="p-water" type="number" step="any" min="0" placeholder="e.g. 2">\n        <span class="hint" id="p-waterhint"></span>\n        <span class="tiny mono muted" id="p-waterprev" style="display:block;margin-top:4px"></span></div>\n    </fieldset>\n    <fieldset><legend>Schedule</legend>\n      <div class="field"><label for="p-sched">Pattern</label><select id="p-sched">\n        <option value="daily"${"daily" === t.sched ? " selected" : ""}>Every day</option>\n        <option value="weekdays"${"weekdays" === t.sched ? " selected" : ""}>Certain days of the week</option>\n        <option value="interval"${"interval" === t.sched ? " selected" : ""}>Every N days</option>\n        <option value="cycle"${"cycle" === t.sched ? " selected" : ""}>Days on, days off</option></select></div>\n      <div id="p-extra"></div>\n      <div class="fgrid">\n        <div class="field"><label for="p-start">Starts</label><input id="p-start" type="date" value="${Ht(t.startDate)}"></div>\n        <div class="field"><label for="p-weeks">Length in weeks</label><input id="p-weeks" type="number" min="0" step="1" value="${Ht(t.weeks)}" placeholder="Leave blank for open ended"></div>\n      </div></fieldset>\n    <div class="togrow" style="border-top:0">\n      <div><b>Phases</b><span>Change the dose or the schedule partway through: titration, or daily then a few times a week</span></div>\n      <label class="switch"><input type="checkbox" id="p-esc" ${t.escalate ? "checked" : ""}><i></i></label></div>\n    <div id="p-escbox" ${t.escalate ? "" : "hidden"}></div>\n    <div class="togrow">\n      <div><b>On/off cycling</b><span>Run for a spell, then rest</span></div>\n      <label class="switch"><input type="checkbox" id="p-cyc" ${t.cycling ? "checked" : ""}><i></i></label></div>\n    <div id="p-cycbox" ${t.cycling ? "" : "hidden"}></div>\n    <div class="prev" id="p-preview"></div>\n    <div class="field" style="margin-top:12px"><label for="p-active">Status</label><select id="p-active">\n      <option value="1"${t.active ? " selected" : ""}>Running</option><option value="0"${t.active ? "" : " selected"}>Paused</option></select></div>\n    <div class="field"><label for="p-notes">Notes</label><textarea id="p-notes">${Ht(t.notes)}</textarea></div>\n    <p id="p-prev" class="tiny mono muted"></p>`,
    `${e ? '<button class="btn danger" id="p-del">Delete</button>' : ""}\n     <button class="btn ghost" data-close>Cancel</button><button class="btn" id="p-save">${e ? "Save changes" : "Add protocol"}</button>`,
  );
  const a = Ot("#modal");
  Qt(a.querySelector("#p-name"), Ut);
  const o = () => {
      ((t.dose = be(a.querySelector("#p-dose").value)),
        (t.unit = a.querySelector("#p-unit").value),
        (t.blend = a.querySelector("#p-blend").checked),
        (t.pen = a.querySelector("#p-pen").checked));
      const e = a.querySelectorAll("#p-blendbox .blrow");
      (t.blend &&
        e.length &&
        ((t.parts = [...e].map((e) => {
          const t = e.querySelector(".bl-d").value;
          return { name: e.querySelector(".bl-n").value.trim(), dose: "" === t ? "" : be(t) };
        })),
        (t.dose = ye(
          t.parts.reduce((e, t) => e + be(t.dose), 0),
          6,
        )),
        (a.querySelector("#p-dose").value = t.dose || "")),
        (t.route = a.querySelector("#p-route").value),
        (t.sched = a.querySelector("#p-sched").value),
        (t.time = a.querySelector("#p-time").value),
        (t.time2 = a.querySelector("#p-time2").value),
        (t.startDate = a.querySelector("#p-start").value || te()),
        (t.weeks = a.querySelector("#p-weeks").value),
        (t.active = "1" === a.querySelector("#p-active").value),
        (t.notes = a.querySelector("#p-notes").value),
        (t.escalate = a.querySelector("#p-esc").checked),
        (t.cycling = a.querySelector("#p-cyc").checked),
        a.querySelectorAll("#p-escbox .phrow").forEach((e, n) => {
          t.phases[n] &&
            ((t.phases[n].dose = be(e.querySelector(".ph-d").value)),
            (t.phases[n].unit = e.querySelector(".ph-u").value),
            (t.phases[n].dur = be(e.querySelector(".ph-n").value)),
            (t.phases[n].durUnit = e.querySelector(".ph-du").value),
            (t.phases[n].ps = e.querySelector(".ph-s").value),
            e.querySelector(".ph-i") && (t.phases[n].pint = be(e.querySelector(".ph-i").value)));
        }));
      const n = a.querySelector("#p-on-n");
      n &&
        ((t.cycleOnN = be(n.value)),
        (t.cycleOnUnit = a.querySelector("#p-on-u").value),
        (t.cycleOffN = be(a.querySelector("#p-off-n").value)),
        (t.cycleOffUnit = a.querySelector("#p-off-u").value),
        (t.cycleResume = a.querySelector("#p-resume").value));
      const s = a.querySelector("#p-int"),
        o = a.querySelector("#p-on"),
        i = a.querySelector("#p-off");
      (s && (t.intervalDays = be(s.value)), o && (t.cycleOn = be(o.value)), i && (t.cycleOff = be(i.value)));
    },
    i = () => {
      const e = a.querySelector("#p-extra"),
        n = a.querySelector("#p-sched").value;
      ("weekdays" === n
        ? ((e.innerHTML = `<div class="field"><label>Which days</label><div class="daypick" id="p-dp">${me.map((e, n) => `<button type="button" data-dow="${n}" aria-pressed="${(t.days || []).includes(n)}">${e}</button>`).join("")}</div></div>`),
          e.querySelectorAll("#p-dp button").forEach((e) =>
            e.addEventListener("click", () => {
              const n = +e.dataset.dow;
              ((t.days = t.days || []),
                (t.days = t.days.includes(n) ? t.days.filter((e) => e !== n) : t.days.concat(n)),
                e.setAttribute("aria-pressed", t.days.includes(n)),
                y());
            }),
          ))
        : (e.innerHTML =
            "interval" === n
              ? `<div class="field"><label for="p-int">Dose every ___ days</label>\n        <input id="p-int" type="number" min="1" step="1" value="${Ht(t.intervalDays || 2)}"><span class="hint">2 means every other day.</span></div>`
              : "cycle" === n
                ? `<div class="fgrid"><div class="field"><label for="p-on">Days on</label>\n        <input id="p-on" type="number" min="1" step="1" value="${Ht(t.cycleOn || 5)}"></div>\n        <div class="field"><label for="p-off">Days off</label><input id="p-off" type="number" min="0" step="1" value="${Ht(t.cycleOff || 2)}"></div></div>`
                : ""),
        e.querySelectorAll("input").forEach((e) => e.addEventListener("input", y)));
    };
  let l = be(t.dose);
  const r = () => {
      const e = a.querySelector("#p-blendbox");
      ((e.hidden = !t.blend),
        (a.querySelector("#p-dose").readOnly = !!t.blend),
        t.blend
          ? ((t.parts || []).length ||
              (t.parts = [
                { name: "", dose: "" },
                { name: "", dose: "" },
              ]),
            (e.innerHTML = `<div class="blhead"><span>Peptide</span><span>Per shot (<span class="bl-u"></span>)</span><span></span></div>\n      ${t.parts.map((e, t) => `<div class="blrow">\n        <input class="bl-n" list="lib" value="${Ht(e.name)}" placeholder="e.g. BPC-157" aria-label="Peptide ${t + 1}">\n        <input class="bl-d" type="number" step="any" min="0" value="${Ht(e.dose)}" aria-label="Amount per shot">\n        <button type="button" class="phdel" data-bl="${t}" title="Remove">×</button></div>`).join("")}\n      <div class="spread" style="padding:9px 0 0">\n        <button type="button" class="btn ghost sm" id="p-addbl" style="white-space:nowrap">+ Add peptide</button>\n        <b class="mono" id="p-bltot" style="font-size:13.5px;white-space:nowrap"></b></div>\n      <div class="note"><span>ⓘ</span><span>Enter what goes into each shot, not the vial label. The split has to match the vial — a 10 mg + 10 mg vial always gives equal amounts.</span></div>`),
            e.querySelectorAll("input").forEach((e) => e.addEventListener("input", y)),
            e.querySelectorAll(".bl-n").forEach((e) => Qt(e, Ut)),
            e.querySelectorAll("[data-bl]").forEach((e) =>
              e.addEventListener("click", () => {
                (o(), t.parts.splice(+e.dataset.bl, 1), r(), y());
              }),
            ),
            e.querySelector("#p-addbl").addEventListener("click", () => {
              (o(), t.parts.push({ name: "", dose: "" }), r(), y());
              const n = e.querySelectorAll(".bl-n");
              n[n.length - 1].focus();
            }))
          : (e.innerHTML = ""));
    },
    c = (e) => {
      const n = be(t.dose) || 1,
        a = [];
      for (let s = 1; s <= e; s++)
        a.push({ dose: ye((n * s) / e, 4), unit: t.unit, dur: 4, durUnit: "weeks" });
      return a;
    },
    p = (e) =>
      ["weeks", "days"]
        .map((t) => `<option value="${t}"${e === t ? " selected" : ""}>${t}</option>`)
        .join(""),
    h = () => {
      const e = a.querySelector("#p-phases");
      e &&
        ((e.innerHTML = t.phases
          .map((e, n) => {
            return `<div class="phrow"${be(e.dur) > 0 || n === t.phases.length - 1 ? "" : ' data-bad="1"'}>\n      <span class="phn">${n + 1}</span>\n      <input class="ph-d" type="number" step="any" min="0" value="${Ht(e.dose)}">\n      <select class="ph-u">${((a = e.unit || t.unit), ["mcg", "mg", "iu"].map((e) => `<option value="${e}"${a === e ? " selected" : ""}>${"iu" === e ? "IU" : e}</option>`).join(""))}</select>\n      <span style="display:flex;gap:5px"><input class="ph-n" type="number" step="1" min="1" value="${be(e.dur) > 0 ? Ht(e.dur) : ""}"${n === t.phases.length - 1 ? ' placeholder="∞" title="Leave blank to keep going"' : ""}>\n        <select class="ph-du" style="width:auto">${p(e.durUnit || "weeks")}</select></span>\n      <button type="button" class="phdel" data-ph="${n}" title="Remove">×</button>${PSC(e, n)}\n    </div>`;
            var a;
          })
          .join("")),
        e.querySelectorAll("input,select").forEach((e) => e.addEventListener("input", y)),
        e.querySelectorAll(".ph-s").forEach((x) =>
          x.addEventListener("change", () => {
            (o(),
              t.phases.forEach((P) => {
                "weekdays" === P.ps && !(P.pdays || []).length && (P.pdays = [1, 3, 5]);
              }),
              h(),
              y());
          }),
        ),
        e.querySelectorAll("[data-pd]").forEach((x) =>
          x.addEventListener("click", () => {
            const [i, D] = x.dataset.pd.split(",").map(Number),
              P = t.phases[i];
            if (!P) return;
            ((P.pdays = P.pdays || []),
              (P.pdays = P.pdays.includes(D) ? P.pdays.filter((z) => z !== D) : P.pdays.concat(D)),
              x.setAttribute("aria-pressed", P.pdays.includes(D)),
              y());
          }),
        ),
        e.querySelectorAll(".phdel").forEach((e) =>
          e.addEventListener("click", () => {
            (o(), t.phases.splice(+e.dataset.ph, 1), h(), y());
          }),
        ),
        m());
    },
    m = () => {
      a.querySelectorAll("#p-escbox .phrow").forEach((e, n) => {
        const a = t.phases[n];
        a && (be(a.dur) > 0 || n === t.phases.length - 1) ? delete e.dataset.bad : (e.dataset.bad = "1");
      });
      const e = a.querySelector("#p-phsum");
      if (e) {
        const n = Ke(t);
        e.textContent = `${t.phases.length} phase${1 === t.phases.length ? "" : "s"} · ${n % 7 == 0 ? n / 7 + " weeks" : n + " days"}${t.phases.length && !(be(t.phases[t.phases.length - 1].dur) > 0) ? ", then ongoing" : ""}`;
      }
      const n = a.querySelector("#p-escnote");
      if (n) {
        const e = We(t).slice(-1)[0];
        n.textContent = e
          ? `Each phase can have its own dose and schedule. Leave the last phase’s length blank to keep it going until the protocol ends; if it has a length, dosing carries on afterwards at ${fe(be(e.dose), 3)} ${"iu" === (e.unit || t.unit) ? "IU" : e.unit || t.unit} until the protocol ends.`
          : "Add at least one phase.";
      }
    },
    g = () => {
      const e = a.querySelector("#p-escbox");
      ((e.hidden = !t.escalate),
        t.escalate
          ? (t.phases.length || (t.phases = c(2)),
            (e.innerHTML =
              '<div class="tmpls">\n        <button type="button" class="tmpl" data-esc="2"><b>2-phase ramp</b><span>Half, then full</span></button>\n        <button type="button" class="tmpl" data-esc="3"><b>3-phase ramp</b><span>Third, two thirds, full</span></button>\n        <button type="button" class="tmpl" data-esc="4"><b>4-phase ramp</b><span>Four even steps</span></button>\n        <button type="button" class="tmpl" data-esc="ld"><b>Daily, then 3× a week</b><span>5 weeks daily, then Mon · Wed · Fri</span></button>\n      </div>\n      <div class="phhead"><span></span><span>Dose</span><span></span><span>Duration</span><span></span></div>\n      <div id="p-phases"></div>\n      <div class="spread" style="padding:9px 0 0">\n        <button type="button" class="btn ghost sm" id="p-addph">+ Add phase</button>\n        <span class="tiny muted" id="p-phsum"></span></div>\n      <div class="note"><span>ⓘ</span><span id="p-escnote"></span></div>'),
            e.querySelectorAll(".tmpl").forEach((e) =>
              e.addEventListener("click", () => {
                (o(),
                  (t.phases =
                    "ld" === e.dataset.esc
                      ? [
                          { dose: be(t.dose), unit: t.unit, dur: 5, durUnit: "weeks", ps: "daily" },
                          {
                            dose: be(t.dose),
                            unit: t.unit,
                            dur: 0,
                            durUnit: "weeks",
                            ps: "weekdays",
                            pdays: [1, 3, 5],
                          },
                        ]
                      : c(+e.dataset.esc)),
                  h(),
                  y());
              }),
            ),
            e.querySelector("#p-addph").addEventListener("click", () => {
              o();
              const e = t.phases[t.phases.length - 1];
              e && !(be(e.dur) > 0) && (e.dur = 4);
              (t.phases.push({
                dose: e ? e.dose : be(t.dose),
                unit: e ? e.unit : t.unit,
                dur: 4,
                durUnit: "weeks",
              }),
                h(),
                y());
            }),
            h())
          : (e.innerHTML = ""));
    },
    v = () => {
      const e = a.querySelector("#p-cycbox");
      ((e.hidden = !t.cycling),
        t.cycling
          ? ((e.innerHTML = `<div class="tmpls">\n        <button type="button" class="tmpl" data-cyc="8,4"><b>8 on / 4 off</b><span>Common peptide pattern</span></button>\n        <button type="button" class="tmpl" data-cyc="12,4"><b>12 on / 4 off</b><span>Longer run</span></button>\n        <button type="button" class="tmpl" data-cyc="4,2"><b>4 on / 2 off</b><span>Shorter cycle</span></button>\n      </div>\n      <div class="row" style="gap:6px;margin-bottom:10px;flex-wrap:nowrap">\n        <input id="p-on-n" type="number" min="1" step="1" value="${Ht(t.cycleOnN)}" style="width:66px">\n        <select id="p-on-u" style="width:auto">${p(t.cycleOnUnit)}</select>\n        <span class="tiny muted">on</span><span class="muted">/</span>\n        <input id="p-off-n" type="number" min="0" step="1" value="${Ht(t.cycleOffN)}" style="width:66px">\n        <select id="p-off-u" style="width:auto">${p(t.cycleOffUnit)}</select>\n        <span class="tiny muted">off</span></div>\n      <div class="field"><label for="p-resume">After a rest</label><select id="p-resume">\n        <option value="final"${"restart" !== t.cycleResume ? " selected" : ""}>Carry on at the dose you finished at</option>\n        <option value="restart"${"restart" === t.cycleResume ? " selected" : ""}>Start the ramp again from phase 1</option>\n      </select></div>\n      <div class="note"><span>ⓘ</span><span>Phases only advance on dosing blocks — a rest does not push the ramp forward.</span></div>`),
            e.querySelectorAll(".tmpl").forEach((e) =>
              e.addEventListener("click", () => {
                o();
                const [n, a] = e.dataset.cyc.split(",").map(Number);
                ((t.cycleOnN = n),
                  (t.cycleOffN = a),
                  (t.cycleOnUnit = "weeks"),
                  (t.cycleOffUnit = "weeks"),
                  v(),
                  y());
              }),
            ),
            e.querySelectorAll("input,select").forEach((e) => e.addEventListener("input", y)))
          : (e.innerHTML = ""));
    };
  (a.querySelector("#p-blend").addEventListener("change", (e) => {
    (o(),
      e.target.checked && (l = be(t.dose) || l),
      (t.blend = e.target.checked),
      r(),
      t.blend || be(a.querySelector("#p-dose").value) || !l || (a.querySelector("#p-dose").value = l),
      y());
  }),
    a.querySelector("#p-pen").addEventListener("change", (e) => {
      ((t.pen = e.target.checked), (a.querySelector("#p-mixfs").hidden = t.pen), y());
    }),
    a.querySelector("#p-esc").addEventListener("change", (e) => {
      (o(), (t.escalate = e.target.checked), g(), y());
    }),
    a.querySelector("#p-cyc").addEventListener("change", (e) => {
      (o(), (t.cycling = e.target.checked), v(), y());
    }));
  let b = null;
  const y = () => {
    if (
      (o(),
      (() => {
        const e = a.querySelector("#p-water"),
          n = a.querySelector("#p-waterhint"),
          s = a.querySelector("#p-waterprev"),
          o = Te(a.querySelector("#p-name").value),
          i = o ? Ee(o.id) : null,
          l = o ? o.id : "";
        (l !== b && ((b = l), (e.value = i && be(i.bacMl) ? String(i.bacMl) : "")),
          (e.disabled = !i),
          (n.textContent = i
            ? be(i.openMg) > 0
              ? `Saved to your open ${o.name} vial on Stock.`
              : "No vial open yet. Saved to the stock entry and used when the next vial is mixed."
            : "No stock for this compound yet. Add a vial on Stock first, then set the water here."));
        const d = be(e.value);
        if (!(i && d > 0)) return void (s.textContent = "");
        const r = Ge(t, te()),
          c = be(i.vialMg) / d,
          u = Se(r.dose, r.unit);
        s.textContent =
          `${fe(be(i.vialMg), 2)} ${xe(o)} + ${fe(d, 2)} mL = ${fe(c, 2)} ${Ae(o)}` +
          (u > 0
            ? ` · ${fe(be(r.dose), 3)} ${"iu" === r.unit ? "IU" : r.unit} = ${fe((u / c) * Oe, 1)} units`
            : "");
      })(),
      t.blend)
    ) {
      const e = "iu" === t.unit ? "IU" : t.unit;
      a.querySelectorAll(".bl-u").forEach((t) => (t.textContent = e));
      const n = a.querySelector("#p-bltot");
      n && (n.textContent = `Total ${fe(be(t.dose), 3)} ${e}`);
    }
    const pd = a.querySelector("#p-daily");
    if (pd) {
      const g = Ge(t, te());
      pd.textContent =
        t.split && be(g.dose)
          ? `2 shots a day = ${fe(2 * be(g.dose), 3)} ${"iu" === g.unit ? "IU" : g.unit} daily.`
          : "";
    }
    const e = 7 * tt(t) * SL(t).length,
      n = Ze(t);
    a.querySelector("#p-prev").textContent =
      `${fe(e, 1)} shots a week · ${fe(Se(Ge(t, te()).dose, Ge(t, te()).unit) * tt(t) * SL(t).length * 7, 3)} ${xe(Ce(t.compoundId))} a week${n ? " · ends " + oe(n) : ""}`;
    const s = a.querySelector("#p-dosenote");
    if (s) {
      const e = Ge(t, te()),
        n = "iu" === e.unit ? "IU" : e.unit;
      ((s.hidden = !(t.escalate && e.of)),
        s.hidden ||
          (s.textContent = `Phases are on, so this box is only the starting point for the phase buttons. Today you are on ${fe(be(e.dose), 3)} ${n} — step ${e.phase} of ${e.of}${e.holding ? ", held" : ""}, from the steps below.`));
    }
    (t.escalate && a.querySelector("#p-phsum") && m(),
      (() => {
        const e = a.querySelector("#p-preview"),
          n = t.startDate || te(),
          s = Ze(t),
          o = [];
        let i = null;
        for (let e = 0; e < 730 && o.length < 8; e++) {
          const a = ne(n, e);
          if (s && a > s) break;
          const l = Re(t, a),
            d = Ge(t, a),
            sc = t.escalate ? et(EF(t, a)) : "",
            r = (l.on ? "on" : "off") + "|" + d.dose + "|" + d.unit + "|" + d.phase + "|" + sc;
          r !== i && (o.push({ date: a, on: l.on, a: d, sc: sc }), (i = r));
        }
        o.length < 2 && !t.cycling && !t.escalate
          ? (e.innerHTML = "")
          : (e.innerHTML =
              '<div class="eyebrow" style="margin:0 0 4px">Schedule preview</div>' +
              o
                .map(
                  (e) =>
                    `<div><span class="muted">${Ht(oe(e.date))}</span><b class="mono">${e.on ? `${fe(be(e.a.dose), 3)} ${"iu" === e.a.unit ? "IU" : e.a.unit}${e.a.of ? ` · phase ${e.a.phase}/${e.a.of}${e.a.holding ? " held" : ""}` : ""}${e.sc ? " · " + Ht(e.sc) : ""}` : "rest"}</b></div>`,
                )
                .join("") +
              (s ? `<div><span class="muted">${Ht(oe(s))}</span><b class="mono">ends</b></div>` : ""));
      })());
  };
  (a.querySelectorAll("input,select,textarea").forEach((e) => e.addEventListener("input", y)),
    a.querySelector("#p-name").addEventListener("change", (e) => {
      const t = e.target.value.trim(),
        n = Te(t),
        s = u.find((e) => e[0].toLowerCase() === t.toLowerCase());
      (((n && "iu" === n.base) || (s && "iu" === s[3])) && (a.querySelector("#p-unit").value = "iu"),
        /^(mounjaro|zepbound|ozempic|wegovy|saxenda|victoza|trulicity)\b/i.test(t) &&
          !a.querySelector("#p-pen").checked &&
          ((a.querySelector("#p-pen").checked = !0), (a.querySelector("#p-mixfs").hidden = !0)),
        y());
    }),
    a.querySelector("#p-sched").addEventListener("change", () => {
      (o(), i(), y());
    }),
    a.querySelectorAll("#p-split button").forEach((e) =>
      e.addEventListener("click", () => {
        (o(),
          (t.split = "1" === e.dataset.split),
          a.querySelectorAll("#p-split button").forEach((n) => n.setAttribute("aria-pressed", n === e)),
          (a.querySelector("#p-t2").style.display = t.split ? "" : "none"),
          (a.querySelector("#p-tlab").textContent = t.split ? "AM time" : "Time of day"),
          (a.querySelector("#p-dlab").textContent = t.split ? "Amount per shot" : "Amount"),
          (a.querySelector("#p-thint").textContent = t.split
            ? "Optional — leave blank and Today just says AM."
            : "Optional — orders your Today list."),
          y());
      }),
    ),
    i(),
    r(),
    g(),
    v(),
    y(),
    (() => {
      const W = a.querySelector("#p-water"),
        BD = a.querySelector(".body");
      DR && DR.water && !W.disabled && ((W.value = DR.water), y());
      const snap = () => (o(), JSON.stringify([t, a.querySelector("#p-name").value, W.value]));
      const S0 = snap();
      let TT = null;
      const sv = () => {
        (clearTimeout(TT),
          (TT = setTimeout(() => {
            if (!a.querySelector("#p-save")) return;
            const cur = snap();
            cur !== S0 || DR
              ? DS({
                  edit: e || "",
                  at: Date.now(),
                  t: JSON.parse(JSON.stringify(t)),
                  name: a.querySelector("#p-name").value,
                  water: W.value,
                })
              : DX();
          }, 250)));
      };
      ["input", "change", "click"].forEach((ev) => BD.addEventListener(ev, sv));
      const X = a.querySelector("#p-discard");
      X &&
        X.addEventListener("click", () => {
          (DX(), Rt(), Mn(e));
        });
    })(),
    a.querySelector("#p-save").addEventListener("click", () => {
      o();
      const e = a.querySelector("#p-name").value.trim();
      if (!e) return void Ft("Name the compound first.");
      if ("weekdays" === t.sched && !(t.days || []).length) return void Ft("Pick at least one day.");
      if (t.split && t.time && t.time2 && t.time2 <= t.time)
        return void Ft("The PM time has to be later than the AM time.");
      if (t.escalate) {
        if (!(t.phases || []).length) return void Ft("Add at least one titration step.");
        if (t.phases.some((e, i) => i < t.phases.length - 1 && !(be(e.dur) > 0)))
          return (Ft("Give every phase except the last a length."), void h());
        if (t.phases.some((e) => "weekdays" === e.ps && !(e.pdays || []).length))
          return void Ft("Pick at least one day for each phase set to Certain days.");
        if (t.phases.some((e) => !be(e.dose))) return (Ft("Give every titration step a dose."), void h());
      }
      if (t.blend) {
        if (((t.parts = (t.parts || []).filter((e) => e.name || be(e.dose))), t.parts.some((e) => !e.name)))
          return void Ft("Name each peptide in the blend.");
        if (t.parts.some((e) => !be(e.dose)) || !be(t.dose))
          return void Ft("Enter how much of each peptide goes into a shot.");
      }
      const n = a.querySelector("#p-water");
      if (!(t.pen || n.disabled || "" === n.value || be(n.value) > 0))
        return void Ft("Bac water has to be more than 0 mL.");
      t.compoundId = Pe(e).id;
      let i = "";
      if (!t.pen && !n.disabled && be(n.value) > 0) {
        const e = Ee(t.compoundId),
          a = be(n.value);
        e && a !== be(e.bacMl) && ((e.bacMl = String(a)), (i = ` Water set to ${fe(a, 2)} mL.`));
      }
      const l = d.protocols.findIndex((e) => e.id === t.id);
      (l >= 0 ? (d.protocols[l] = t) : d.protocols.push(t),
        s(),
        DX(),
        Rt(),
        Ua(),
        Ft((l >= 0 ? "Protocol saved." : "Protocol added.") + i));
    }));
  const f = a.querySelector("#p-del");
  f &&
    f.addEventListener("click", () => {
      confirm("Delete this protocol? Shots already logged stay in your history.") &&
        ((d.protocols = d.protocols.filter((e) => e.id !== t.id)),
        s(),
        DX(),
        Rt(),
        Ua(),
        Ft("Protocol deleted."));
    });
}
function xn() {
  const e = Bt('<div class="stack"></div>'),
    t = [...new Set(d.batches.filter((e) => "finished" !== e.status).map((e) => e.compoundId))];
  (e.appendChild(
    Bt(
      `<div class="head"><div><h1>Stock</h1>\n    <p>${t.length} compound${1 === t.length ? "" : "s"} in stock. Every logged shot, and anything you purge priming the needle, comes off the open vial.</p></div>\n    <button class="btn" data-newbatch="1">Add stock</button></div>`,
    ),
  ),
    t.length ||
      e.appendChild(
        Bt(
          '<div class="panel"><div class="empty"><b>Nothing in stock</b>Add a batch and the countdown starts.</div></div>',
        ),
      ));
  let n = !1;
  for (const a of vt(t)) {
    mt(a) ||
      n ||
      ((n = !0), e.appendChild(Bt('<div class="eyebrow" style="margin:6px 0 -6px">Not running</div>')));
    const t = Ce(a),
      s = De(a),
      o = At(a),
      i = $t(a),
      l = be(d.settings.targetDays) || 90,
      r = null === o ? null : ne(te(), o),
      c = xt(a),
      u = Mt(a),
      p = d.protocols.filter((e) => e.compoundId === a && e.active),
      h = Bt(
        `<div class="panel"><div class="pbody">\n      <div class="spread" style="margin-bottom:2px"><b style="font-size:17px">${Ht(t.name)}</b>\n        <span class="pill ${i.cls}">${Ht(i.text)}</span></div>\n      <div class="muted tiny" style="margin-bottom:16px">${Ht($e(wt(a), t))} on hand · ${kt(a)} sealed vial${1 === kt(a) ? "" : "s"} · ${St(a)} open</div>\n      <div class="grid2">\n        <div>\n          <div class="eyebrow">How long it lasts</div>\n          <div class="spread" style="align-items:baseline">\n            <div class="big-read" style="color:${null === o ? "var(--ink-2)" : o >= l ? "var(--done)" : o < 0.34 * l ? "var(--alert)" : "var(--due)"}">${null === o ? "—" : Ht(ke(o))}<small> left</small></div>\n            <span class="tiny muted">${r ? "until " + Ht(oe(r)) : ""}</span></div>\n          <div class="bar ${null === o ? "" : o >= l ? "good" : o < 0.34 * l ? "bad" : "warn"}" style="margin:10px 0 4px">\n            <i style="width:${null === o ? 0 : Math.min(100, (o / l) * 100)}%"></i></div>\n          <div class="tiny muted">${null === o ? "No active protocol draws on this." : o >= l ? `At or above your ${l}-day target` : `Below your ${l}-day target`}</div>\n        </div>\n        <div>\n          <div class="eyebrow">Drawn down by</div>\n          ${
          p.length
            ? p
                .map((e) => {
                  const t = Ge(e, te());
                  return `<div class="tiny" style="margin-bottom:3px">${Ht(fe(be(t.dose), 3))} ${Ht("iu" === t.unit ? "IU" : t.unit)} ${Ht(_e(e).toLowerCase())}</div>`;
                })
                .join("")
            : '<div class="tiny muted">Nothing active.</div>'
        }\n          ${null !== c ? `<div class="tiny muted" style="margin-top:6px">${c} doses left · ${fe(u, 3)} ${xe(t)} a day</div>` : ""}\n        </div>\n      </div>\n      <div id="bl-${a}" style="margin-top:16px;border-top:1px solid var(--rule-soft)"></div>\n    </div></div>`,
      ),
      m = h.querySelector("#bl-" + a);
    for (const e of s) {
      const n = Dt(e),
        a = be(e.startVials) * be(e.vialMg);
      m.appendChild(
        Bt(
          `<div class="listrow" style="padding:12px 0">\n        <span style="display:flex;gap:2px;flex:none">${jt(be(e.openMg) / (be(e.vialMg) || 1), t.color, 30)}${e.sealed > 0 ? jt(1, t.color, 30) : ""}</span>\n        <span><span class="lname">${Ht(e.vialMg)} ${xe(t)} vial</span>\n          <span class="lmeta">${e.sealed} sealed · ${Ht($e(be(e.openMg), t))} open${e.bacMl ? ` · mixed with ${Ht(e.bacMl)} mL` : " · not mixed yet"}${e.vendor ? " · " + Ht(e.vendor) : ""}${e.lot ? " · lot " + Ht(e.lot) : ""}</span></span>\n        <span class="lright" style="min-width:180px;display:block">\n          <div class="bar" style="margin-bottom:4px"><i style="width:${n}%;background:${t.color}"></i></div>\n          <span class="tiny muted">${Math.round(n)}% used · ${Ht($e(a - (be(e.sealed) * be(e.vialMg) + be(e.openMg)), t))} of ${Ht($e(a, t))}</span></span>\n        <span class="lright"><button class="btn ghost sm" data-editbatch="${e.id}">Edit</button></span></div>`,
        ),
      );
    }
    e.appendChild(h);
  }
  const a = Bt('<div class="grid2"></div>'),
    s = Bt(
      '<div class="panel"><h2>Solutions<button class="btn ghost sm" data-newsol="1">Add solution</button></h2><div id="sl"></div></div>',
    ),
    o = s.querySelector("#sl");
  d.solutions.length ||
    o.appendChild(
      Bt(
        '<div class="empty tiny">No bacteriostatic water or diluent tracked. Add some and mixing a vial will draw from it.</div>',
      ),
    );
  for (const e of d.solutions)
    o.appendChild(
      Bt(
        `<div class="listrow"><span><span class="lname">${Ht(e.name)}</span>\n      <span class="lmeta">${Ht(fe(be(e.ml), 1))} mL left of ${Ht(fe(be(e.startMl), 1))} mL${e.vendor ? " · " + Ht(e.vendor) : ""}</span></span>\n      <span class="lright"><button class="btn ghost sm" data-editsol="${e.id}">Edit</button></span></div>`,
      ),
    );
  const i = Bt(
      '<div class="panel"><h2>Supplies<button class="btn ghost sm" data-newsup="1">Add supply</button></h2><div id="su"></div></div>',
    ),
    l = i.querySelector("#su");
  d.supplies.length ||
    l.appendChild(
      Bt(
        '<div class="empty tiny">Filters, syringes, pen needles — anything a mix or a shot uses up. Give one a rule and it counts itself down.</div>',
      ),
    );
  for (const e of d.supplies) {
    const t = be(e.count) <= be(e.lowAt || 10);
    l.appendChild(
      Bt(
        `<div class="listrow"><span><span class="lname">${Ht(e.name)}</span>\n      <span class="lmeta">${Ht(e.each || 1)} per ${"mix" === e.per ? "mix" : "shot"}</span></span>\n      <span class="lright"><span class="pill ${t ? "late" : ""}">${Ht(fe(be(e.count), 0))} left</span>\n        <button class="btn ghost sm" data-editsup="${e.id}">Edit</button></span></div>`,
      ),
    );
  }
  return (a.appendChild(s), a.appendChild(i), e.appendChild(a), e);
}
function An(e) {
  const t = e
      ? Object.assign({}, qe(e))
      : {
          id: ve(),
          compoundId: "",
          vialMg: 5,
          sealed: 1,
          startVials: "",
          openMg: 0,
          bacMl: "",
          reconDate: "",
          vendor: "",
          lot: "",
          coa: "",
          received: te(),
          expiry: "",
          notes: "",
          status: "sealed",
        },
    n = (t.compoundId && (Ce(t.compoundId) || {}).name) || "",
    a = be(t.openMg) > 0,
    o = t.bacMl || "";
  Vt(
    e ? "Edit stock" : "Add stock",
    `\n    <datalist id="lib2">${u.map((e) => `<option value="${Ht(e[0])}">`).join("")}</datalist>\n    <div class="field"><label for="b-name">Compound</label><input id="b-name" list="lib2" value="${Ht(n)}" placeholder="Start typing — the list has common ones"></div>\n    <div class="field"><label for="b-mg">Strength per vial</label>\n      <div class="unitwrap"><input id="b-mg" type="number" step="any" min="0" value="${Ht(t.vialMg)}">\n        <select id="b-unit"><option value="mg"${"iu" !== t.vialUnit ? " selected" : ""}>mg</option>\n          <option value="iu"${"iu" === t.vialUnit ? " selected" : ""}>IU</option></select></div>\n      <span class="hint">What the vial is labelled as, before you mix it. Choose IU for anything labelled that way — the compound is then held in IU everywhere.</span></div>\n    <div class="fgrid">\n      <div class="field"><label for="b-sealed">Sealed vials</label><input id="b-sealed" type="number" min="0" step="1" value="${Ht(t.sealed)}">\n        <span class="hint">Unopened vials in this batch.</span></div>\n      <div class="field"><label for="b-start">Vials in the batch to start with</label>\n        <input id="b-start" type="number" min="0" step="1" value="${Ht(t.startVials)}" placeholder="Same as unopened">\n        <span class="hint">Only if you have already used some — it is what the used percentage is measured against.</span></div>\n    </div>\n    <div id="b-more"></div><button class="btn ghost sm" type="button" id="b-addrow" style="margin:0 0 14px">+ Add another strength</button><label class="check"><input type="checkbox" id="b-hasopen" ${a ? "checked" : ""}><span>I have a vial already open</span></label>\n    <div class="b-openrow"><button class="btn ghost sm" type="button" id="b-opennew">Open new vial</button>\n      <span class="hint" id="b-openhint"${a && e && t.reconDate === te() ? ' style="color:var(--due)"' : ""}>${a && e && t.reconDate === te() ? "A vial was already opened today. Only press this if you have opened another one." : "Takes one from Sealed vials, fills the open vial to full strength and sets Mixed on to today."}</span></div>\n    <div id="b-open" ${a ? "" : "hidden"}>\n      <div class="fgrid3">\n        <div class="field"><label for="b-openmg">Left in the open vial (mg)</label><input id="b-openmg" type="number" step="any" min="0" value="${Ht(t.openMg || t.vialMg)}"></div>\n        <div class="field"><label for="b-bac">Water it was mixed with (mL)</label><input id="b-bac" type="number" step="any" min="0" value="${Ht(t.bacMl)}"></div>\n        <div class="field"><label for="b-recon">Mixed on</label><input id="b-recon" type="date" value="${Ht(t.reconDate)}"></div>\n      </div></div>\n    <details class="batch"><summary>Batch details (optional)</summary><div>\n      <div class="fgrid"><div class="field"><label for="b-vendor">Source</label><input id="b-vendor" value="${Ht(t.vendor)}"></div>\n        <div class="field"><label for="b-lot">Lot</label><input id="b-lot" value="${Ht(t.lot)}"></div></div>\n      <div class="fgrid"><div class="field"><label for="b-recv">Received</label><input id="b-recv" type="date" value="${Ht(t.received)}"></div>\n        <div class="field"><label for="b-exp">Use by</label><input id="b-exp" type="date" value="${Ht(t.expiry)}"></div></div>\n      <div class="field"><label for="b-coa">CoA link</label><input id="b-coa" value="${Ht(t.coa)}" placeholder="https://"></div>\n      <div class="field"><label for="b-notes">Notes</label><textarea id="b-notes">${Ht(t.notes)}</textarea></div>\n    </div></details>\n    <p id="b-prev" class="tiny mono muted"></p>`,
    `${e ? '<button class="btn danger" id="b-del">Delete</button>' : ""}\n     <button class="btn ghost" data-close>Cancel</button><button class="btn" id="b-save">${e ? "Save" : "Add to stock"}</button>`,
  );
  const i = Ot("#modal");
  Qt(i.querySelector("#b-name"), Ut);
  const l = i.querySelector("#b-hasopen");
  let r = !1;
  l.addEventListener("change", () => {
    if (l.checked) {
      const e = Math.max(0, Math.round(be(m.value)));
      e > 0 && ((m.value = e - 1), (r = !0));
    }
    ((i.querySelector("#b-open").hidden = !l.checked), g(), w());
  });
  let c = 0;
  const p = i.querySelector("#b-opennew"),
    h = i.querySelector("#b-openhint"),
    m = i.querySelector("#b-sealed"),
    g = () => {
      p.disabled = Math.round(be(m.value)) < 1;
    };
  (p.addEventListener("click", () => {
    const t = Math.round(be(m.value));
    if (t < 1) return void Ft("No sealed vials left to open.");
    const n = be(i.querySelector("#b-mg").value);
    if (!n) return void Ft("Enter the strength per vial first.");
    ((m.value = t - 1),
      l.checked || ((l.checked = !0), (i.querySelector("#b-open").hidden = !1)),
      (i.querySelector("#b-openmg").value = n),
      (i.querySelector("#b-recon").value = te()),
      c++,
      (h.style.color = ""),
      (h.textContent = `${1 === c ? "New vial opened" : c + " new vials opened"}. Press ${e ? "Save" : "Add to stock"} to keep it, or Cancel to undo.`),
      g(),
      w());
    const a = i.querySelector("#b-bac");
    be(a.value) || a.focus();
  }),
    m.addEventListener("input", g),
    g(),
    l.addEventListener("change", () => {
      l.checked ||
        (!c && !r) ||
        ((m.value = Math.round(be(m.value)) + c + (r ? 1 : 0)),
        (c = 0),
        (r = !1),
        (h.textContent =
          "Takes one from Sealed vials, fills the open vial to full strength and sets Mixed on to today."),
        g(),
        w());
    }));
  const v = i.querySelector("#b-more"),
    b = () => (v ? [...v.querySelectorAll(".b-row")] : []),
    y = () => {
      const e = "iu" === i.querySelector("#b-unit").value ? "IU" : "mg";
      i.querySelectorAll(".b-ru").forEach((t) => (t.textContent = e));
    };
  v &&
    (i.querySelector("#b-addrow").addEventListener("click", () => {
      const e = Bt(
        `<div class="b-row">\n        <div class="b-top">\n          <div class="field" style="flex:1"><label>Strength (<span class="b-ru">mg</span>)</label><input class="b-rmg" type="number" step="any" min="0"></div>\n          <div class="field" style="flex:1"><label>Sealed vials</label><input class="b-rsealed" type="number" min="0" step="1" value="1"></div>\n          <div class="field"><button class="btn ghost b-rm" type="button" aria-label="Remove this strength">×</button></div>\n        </div>\n        <details class="batch"><summary>Batch details (optional)</summary><div>\n          <div class="fgrid"><div class="field"><label>Source</label><input class="b-rvendor"></div>\n            <div class="field"><label>Lot</label><input class="b-rlot"></div></div>\n          <div class="fgrid"><div class="field"><label>Received</label><input class="b-rrecv" type="date" value="${te()}"></div>\n            <div class="field"><label>Use by</label><input class="b-rexp" type="date"></div></div>\n          <div class="field"><label>CoA link</label><input class="b-rcoa" placeholder="https://"></div>\n          <div class="field"><label>Notes</label><textarea class="b-rnotes"></textarea></div>\n        </div></details></div>`,
      );
      (v.appendChild(e), y(), w(), e.querySelector(".b-rmg").focus());
    }),
    v.addEventListener("input", () => w()),
    v.addEventListener("click", (e) => {
      const t = e.target.closest(".b-rm");
      t && (t.closest(".b-row").remove(), w());
    }),
    i.querySelector("#b-unit").addEventListener("change", y));
  const f = () => {
      ((t.vialMg = be(i.querySelector("#b-mg").value)),
        (t.vialUnit = i.querySelector("#b-unit").value),
        (t.sealed = Math.max(0, Math.round(be(i.querySelector("#b-sealed").value)))));
      const e = i.querySelector("#b-start").value;
      ((t.openMg = l.checked ? be(i.querySelector("#b-openmg").value) : 0),
        (t.bacMl = l.checked ? i.querySelector("#b-bac").value : a ? "" : o),
        (t.reconDate = l.checked ? i.querySelector("#b-recon").value : ""),
        (t.startVials = "" !== e ? be(e) : t.sealed + (l.checked ? 1 : 0)),
        (t.vendor = i.querySelector("#b-vendor").value.trim()),
        (t.lot = i.querySelector("#b-lot").value.trim()),
        (t.received = i.querySelector("#b-recv").value),
        (t.expiry = i.querySelector("#b-exp").value),
        (t.coa = i.querySelector("#b-coa").value.trim()),
        (t.notes = i.querySelector("#b-notes").value),
        (t.status = t.sealed > 0 || t.openMg > 0 ? (t.openMg > 0 ? "open" : "sealed") : "finished"));
    },
    w = () => {
      f();
      const e =
          t.sealed * t.vialMg +
          t.openMg +
          b().reduce(
            (e, t) => e + be(t.querySelector(".b-rmg").value) * be(t.querySelector(".b-rsealed").value),
            0,
          ),
        n = be(t.bacMl) ? t.vialMg / be(t.bacMl) : 0,
        a = { base: "iu" === i.querySelector("#b-unit").value ? "iu" : "mg" },
        s = Math.max(0, Math.round(be(t.startVials)));
      i.querySelector("#b-prev").textContent =
        `${$e(e, a)} on hand${s ? ` · batch of ${s} vial${1 === s ? "" : "s"}` : ""}${n ? ` · open vial at ${fe(n, 2)} ${Ae(a)}` : ""}`;
    };
  (i.querySelectorAll("input,textarea").forEach((e) => e.addEventListener("input", w)),
    w(),
    i.querySelector("#b-save").addEventListener("click", () => {
      f();
      const n = i.querySelector("#b-name").value.trim();
      if (!n) return void Ft("Name the compound first.");
      const a = Pe(n);
      if (((a.base = "iu" === t.vialUnit ? "iu" : a.base || "mg"), (t.compoundId = a.id), !t.vialMg))
        return void Ft("Enter what the vial is labelled as.");
      const o = d.batches.findIndex((e) => e.id === t.id);
      o >= 0 ? (d.batches[o] = t) : d.batches.push(t);
      const u = c + (r ? 1 : 0),
        p = l.checked ? (e ? u : Math.max(1, u)) : 0;
      if ((l.checked && u && (t.openTok = ve()), be(t.bacMl))) for (let e = 0; e < p; e++) $n(be(t.bacMl));
      for (const e of b()) {
        const n = be(e.querySelector(".b-rmg").value),
          a = Math.max(0, Math.round(be(e.querySelector(".b-rsealed").value)));
        if (!n || !a) continue;
        const s = e.querySelector(".b-rvendor").value.trim(),
          o = e.querySelector(".b-rlot").value.trim(),
          i = e.querySelector(".b-rrecv").value,
          l = e.querySelector(".b-rexp").value,
          r = e.querySelector(".b-rcoa").value.trim(),
          c = e.querySelector(".b-rnotes").value;
        d.batches.push({
          id: ve(),
          compoundId: t.compoundId,
          vialMg: n,
          vialUnit: t.vialUnit,
          sealed: a,
          startVials: a,
          openMg: 0,
          bacMl: "",
          reconDate: "",
          vendor: s,
          lot: o,
          coa: r,
          received: i || t.received,
          expiry: l,
          notes: c,
          status: "sealed",
        });
      }
      (s(), Rt(), Ua(), Ft("Stock saved."));
    }));
  const k = i.querySelector("#b-del");
  k &&
    k.addEventListener("click", () => {
      confirm("Delete this batch?") &&
        ((d.batches = d.batches.filter((e) => e.id !== t.id)), s(), Rt(), Ua(), Ft("Batch deleted."));
    });
}
function $n(e) {
  const t = d.solutions.find((e) => be(e.ml) > 0);
  return (t && ((t.ml = Math.max(0, ye(be(t.ml) - e, 3))), fn("mix")), t ? t.id : "");
}
function In(e) {
  const t = e
    ? Object.assign(
        {},
        d.solutions.find((t) => t.id === e),
      )
    : { id: ve(), name: "Bacteriostatic water", ml: 30, startMl: 30, vendor: "", notes: "" };
  Vt(
    e ? "Edit solution" : "Add solution",
    `\n    <div class="field"><label for="s-n">Name</label><input id="s-n" value="${Ht(t.name)}"></div>\n    <div class="fgrid"><div class="field"><label for="s-ml">Left (mL)</label><input id="s-ml" type="number" step="any" min="0" value="${Ht(t.ml)}"></div>\n      <div class="field"><label for="s-st">Started with (mL)</label><input id="s-st" type="number" step="any" min="0" value="${Ht(t.startMl)}"></div></div>\n    <div class="field"><label for="s-v">Source</label><input id="s-v" value="${Ht(t.vendor)}"></div>`,
    (e ? '<button class="btn danger" id="s-del">Delete</button>' : "") +
      '\n     <button class="btn ghost" data-close>Cancel</button><button class="btn" id="s-save">Save</button>',
  );
  const n = Ot("#modal");
  n.querySelector("#s-save").addEventListener("click", () => {
    ((t.name = n.querySelector("#s-n").value.trim() || "Solution"),
      (t.ml = be(n.querySelector("#s-ml").value)),
      (t.startMl = be(n.querySelector("#s-st").value) || t.ml),
      (t.vendor = n.querySelector("#s-v").value.trim()));
    const e = d.solutions.findIndex((e) => e.id === t.id);
    (e >= 0 ? (d.solutions[e] = t) : d.solutions.push(t), s(), Rt(), Ua(), Ft("Solution saved."));
  });
  const a = n.querySelector("#s-del");
  a &&
    a.addEventListener("click", () => {
      ((d.solutions = d.solutions.filter((e) => e.id !== t.id)), s(), Rt(), Ua());
    });
}
function Cn(e) {
  const t = e
    ? Object.assign(
        {},
        d.supplies.find((t) => t.id === e),
      )
    : { id: ve(), name: "Insulin syringes", count: 100, each: 1, per: "shot", lowAt: 10 };
  Vt(
    e ? "Edit supply" : "Add supply",
    `\n    <div class="field"><label for="u-n">Name</label><input id="u-n" value="${Ht(t.name)}"></div>\n    <div class="fgrid3">\n      <div class="field"><label for="u-c">How many left</label><input id="u-c" type="number" step="1" min="0" value="${Ht(t.count)}"></div>\n      <div class="field"><label for="u-e">Used each time</label><input id="u-e" type="number" step="any" min="0" value="${Ht(t.each)}"></div>\n      <div class="field"><label for="u-p">Counts down on</label><select id="u-p">\n        <option value="shot"${"shot" === t.per ? " selected" : ""}>Every shot</option>\n        <option value="mix"${"mix" === t.per ? " selected" : ""}>Every mix</option></select></div></div>\n    <div class="field"><label for="u-l">Warn me at</label><input id="u-l" type="number" step="1" min="0" value="${Ht(t.lowAt)}"></div>`,
    (e ? '<button class="btn danger" id="u-del">Delete</button>' : "") +
      '\n     <button class="btn ghost" data-close>Cancel</button><button class="btn" id="u-save">Save</button>',
  );
  const n = Ot("#modal");
  n.querySelector("#u-save").addEventListener("click", () => {
    ((t.name = n.querySelector("#u-n").value.trim() || "Supply"),
      (t.count = be(n.querySelector("#u-c").value)),
      (t.each = be(n.querySelector("#u-e").value) || 1),
      (t.per = n.querySelector("#u-p").value),
      (t.lowAt = be(n.querySelector("#u-l").value)));
    const e = d.supplies.findIndex((e) => e.id === t.id);
    (e >= 0 ? (d.supplies[e] = t) : d.supplies.push(t), s(), Rt(), Ua(), Ft("Supply saved."));
  });
  const a = n.querySelector("#u-del");
  a &&
    a.addEventListener("click", () => {
      ((d.supplies = d.supplies.filter((e) => e.id !== t.id)), s(), Rt(), Ua());
    });
}
function Ln() {
  const e = Bt('<div class="stack"></div>');
  e.appendChild(
    Bt(
      `<div class="head"><div><h1>History</h1>\n    <p>${d.logs.filter((e) => "taken" === e.status).length} shots logged.</p></div>\n    <button class="btn" data-go="log">Log a shot</button></div>`,
    ),
  );
  const t = Bt(
    `<div class="seg" id="hv">\n    <button data-v="calendar" aria-pressed="${"calendar" === r.histView}">Calendar</button>\n    <button data-v="list" aria-pressed="${"list" === r.histView}">List</button>\n    <button data-v="batches" aria-pressed="${"batches" === r.histView}">Finished batches</button></div>`,
  );
  return (
    t.querySelectorAll("button").forEach((e) =>
      e.addEventListener("click", () => {
        ((r.histView = e.dataset.v), Ua());
      }),
    ),
    e.appendChild(t),
    "calendar" === r.histView
      ? e.appendChild(qn())
      : "list" === r.histView
        ? (e.appendChild(histListBar()), e.appendChild(Dn()))
        : e.appendChild(En()),
    e
  );
}
function qn() {
  const e = r.calMonth
      ? ee(r.calMonth + "-01")
      : (() => {
          const e = new Date();
          return new Date(e.getFullYear(), e.getMonth(), 1);
        })(),
    t = e.getFullYear(),
    n = e.getMonth();
  ((r.calMonth = `${t}-${X(n + 1)}`), r.calDay || (r.calDay = te()));
  const a = (new Date(t, n, 1).getDay() + 6) % 7,
    s = new Date(t, n, 1 - a),
    o = Bt('<div class="split"></div>'),
    i = Bt(
      `<div class="panel" style="overflow:hidden">\n    <h2><button class="btn ghost sm" id="pm">‹</button>\n      <b style="font-weight:600;color:var(--ink)">${e.toLocaleDateString(void 0, { month: "long", year: "numeric" })}</b>\n      <button class="btn ghost sm" id="nm">›</button></h2>\n    <div class="cal" id="cal"></div>\n    <div class="legend">\n      <span><i class="cdot" data-s="taken"></i>Taken</span>\n      <span><i class="cdot"></i>Scheduled</span>\n      <span><i class="cdot" data-s="missed"></i>Missed</span></div></div>`,
    );
  (i.querySelector("#pm").addEventListener("click", () => {
    ((r.calMonth = _(new Date(t, n - 1, 1)).slice(0, 7)), Ua());
  }),
    i.querySelector("#nm").addEventListener("click", () => {
      ((r.calMonth = _(new Date(t, n + 1, 1)).slice(0, 7)), Ua());
    }));
  const l = i.querySelector("#cal");
  ge.forEach((e) => l.appendChild(Bt(`<div class="cal-h">${me[e][0]}</div>`)));
  for (let e = 0; e < 42; e++) {
    const t = new Date(s);
    t.setDate(s.getDate() + e);
    const a = _(t),
      o = t.getMonth() !== n,
      i0 = it(a),
      i =
        i0
          .flatMap((e) =>
            SL(e).map((x) => {
              const t = lt(e.id, a, x),
                n = Ce(e.compoundId);
              return `<span class="cdot" data-s="${t}" style="${"taken" === t ? `background:${n.color};border-color:${n.color}` : "missed" === t ? "background:var(--alert)" : `border-color:${n.color}`}"></span>`;
            }),
          )
          .join("") +
        ot(a)
          .filter((e) => "taken" === e.status && !(e.protocolId && i0.some((t) => t.id === e.protocolId)))
          .map((e) => {
            const n = Ce(e.compoundId) || { color: "var(--ink-3)" };
            return `<span class="cdot" data-s="taken" style="background:${n.color};border-color:${n.color}"></span>`;
          })
          .join("");
    l.appendChild(
      Bt(
        `<button class="cal-d" data-out="${o ? 1 : 0}" data-today="${a === te() ? 1 : 0}"\n      data-sel="${a === r.calDay ? 1 : 0}" data-calday="${a}">\n      <span class="cal-n">${t.getDate()}</span><span class="cal-dots">${i}</span></button>`,
      ),
    );
  }
  o.appendChild(i);
  const d = Bt(`<div class="panel"><h2>${Ht(oe(r.calDay))}</h2><div id="dd"></div></div>`),
    c = d.querySelector("#dd"),
    u = it(r.calDay),
    p = ot(r.calDay).filter((e) => !e.protocolId || !u.some((t) => t.id === e.protocolId));
  u.length ||
    p.length ||
    c.appendChild(Bt('<div class="empty tiny">Nothing logged or scheduled on this day.</div>'));
  for (const e of u)
    for (const x of SL(e)) {
      const t = Ce(e.compoundId),
        n = st(e.id, r.calDay, x),
        a = Ue(e, r.calDay),
        s = a.phase,
        o = `${Ht(fe(be(a.dose), 3))} ${Ht("iu" === a.unit ? "IU" : a.unit)}${a.units ? ` · ${fe(a.units, a.units % 1 ? 1 : 0)}u` : ""} scheduled${s && s.of ? ` · phase ${s.phase}/${s.of}${s.holding ? ", held" : ""}` : ""}`;
      c.appendChild(
        Bt(
          `<div style="padding:11px 16px;border-bottom:1px solid var(--rule-soft)">\n      <div class="spread"><div><b>${Ht(t.name)}${x ? " · " + SLN(x) : ""}</b>\n        <div class="tiny muted">${n && "taken" === n.status ? `${Ht($e(be(n.doseMg), t))} · ${fe(be(n.units), 1)}u${n.site ? " · " + Ht(Z(n)) : ""}` : o}</div></div>\n        <span class="pill ${n ? ("taken" === n.status ? "done" : "late") : r.calDay < te() ? "late" : "due"}">${n ? n.status : r.calDay < te() ? "missed" : "scheduled"}</span></div>\n      <div class="row" style="margin-top:8px">\n        <button class="btn sm ${n && "taken" === n.status ? "" : "ghost"}" data-mark="taken" data-p="${e.id}" data-d="${r.calDay}"${x ? ` data-slot="${x}"` : ""}>Taken</button>\n        <button class="btn sm ${n && "missed" === n.status ? "" : "ghost"}" data-mark="missed" data-p="${e.id}" data-d="${r.calDay}"${x ? ` data-slot="${x}"` : ""}>Missed</button>\n        ${n ? `<button class="btn ghost sm" data-clear="${n.id}">Clear</button>` : ""}</div></div>`,
        ),
      );
    }
  for (const e of p) {
    const t = Ce(e.compoundId);
    c.appendChild(
      Bt(
        `<div style="padding:11px 16px;border-bottom:1px solid var(--rule-soft)">\n      <div class="spread"><div><b>${Ht(t ? t.name : "—")}</b>\n        <div class="tiny muted">${Ht($e(be(e.doseMg), t))}${e.site ? " · " + Ht(Z(e)) : ""} · ${e.protocolId && Le(e.protocolId) ? "protocol paused" : "one-off"}</div></div>\n      ${e.protocolId && Le(e.protocolId) ? "" : `<button class="btn ghost sm" data-clear="${e.id}">Clear</button>`}</div></div>`,
      ),
    );
  }
  return (o.appendChild(d), o);
}
function Dn() {
  const e = d.logs
      .filter((t) => !r.histComp || t.compoundId === r.histComp)
      .slice()
      .sort((e, t) => ((e.at || e.date) < (t.at || t.date) ? 1 : -1)),
    t = Bt(
      '<div class="panel" style="overflow:auto"><table><thead><tr>\n    <th>When</th><th>Compound</th><th class="num">Dose</th><th class="num">Units</th><th class="num">Purged</th>\n    <th>Site</th><th>Vial</th><th>Status</th><th>Notes</th><th></th></tr></thead><tbody id="tb"></tbody></table></div>',
    ),
    n = t.querySelector("#tb");
  e.length ||
    n.appendChild(Bt('<tr><td colspan="10"><div class="empty">Nothing logged yet.</div></td></tr>'));
  for (const t of e) {
    const e = Ce(t.compoundId),
      a = qe(t.batchId),
      s = t.at ? new Date(t.at) : ee(t.date);
    n.appendChild(
      Bt(
        `<tr>\n      <td>${Ht(se(t.date))}<div class="tiny muted">${t.at ? Ht(re(s)) : ""}${t.slot ? " · " + SLN(t.slot) + " dose" : ""}</div></td>\n      <td>${e ? `<button class="hcomp" data-hcomp="${Ht(t.compoundId)}">${Ht(e.name)}</button>` : "—"}</td>\n      <td class="num">${Ht($e(be(t.doseMg), e))}</td>\n      <td class="num">${t.units ? fe(be(t.units), 1) : "—"}</td>\n      <td class="num">${be(t.purgeUnits) ? fe(be(t.purgeUnits), 1) + "u" : "—"}</td>\n      <td>${Ht(t.site ? Z(t) : "—")}</td>\n      <td class="tiny">${t.bacMl ? Ht(`${fe(be(t.vialMg), 2)} ${xe(e)} in ${fe(be(t.bacMl), 2)} mL` + (a && a.lot ? " · " + a.lot : "")) : a ? Ht(`${a.vialMg} ${xe(e)}` + (a.lot ? " · " + a.lot : "")) : "—"}</td>\n      <td><span class="pill ${"taken" === t.status ? "done" : "late"}">${Ht(t.status)}</span></td>\n      <td class="tiny">${Ht(t.notes || "")}</td>\n      <td class="num"><button class="btn ghost sm" data-clear="${t.id}">Delete</button></td></tr>`,
      ),
    );
  }
  return t;
}
function En() {
  const e = d.batches.filter((e) => "finished" === e.status),
    t = Bt(
      '<div class="panel" style="overflow:auto"><table><thead><tr>\n    <th>Compound</th><th class="num">Vial</th><th class="num">Vials</th><th>Source / lot</th><th>Mixed</th><th class="num">Shots from it</th></tr></thead>\n    <tbody id="tb"></tbody></table></div>',
    ),
    n = t.querySelector("#tb");
  e.length ||
    n.appendChild(
      Bt(
        '<tr><td colspan="6"><div class="empty">No batches finished yet. They move here when the last vial runs out.</div></td></tr>',
      ),
    );
  for (const t of e) {
    const e = Ce(t.compoundId),
      a = d.logs.filter((e) => e.batchId === t.id).length;
    n.appendChild(
      Bt(
        `<tr><td>${Ht(e ? e.name : "—")}</td><td class="num">${Ht(t.vialMg)} ${Ht(xe(e))}</td>\n      <td class="num">${Ht(t.startVials || "—")}</td><td>${Ht(t.vendor || "—")}${t.lot ? '<div class="tiny muted">lot ' + Ht(t.lot) + "</div>" : ""}</td>\n      <td>${t.reconDate ? Ht(se(t.reconDate)) : "—"}</td><td class="num">${a}</td></tr>`,
      ),
    );
  }
  return t;
}
const Tn = [
  ["White / black", "#FFFFFF", "#111111"],
  ["Matt silver / black", "#C8CBCD", "#111111"],
  ["Black / gold", "#141414", "#C8A44D"],
  ["Black / white", "#141414", "#FFFFFF"],
];
function Pn(e) {
  const r0 = PnBase(e);
  // Community build: no CoA link or lot on labels, so members can't make labels pointing at Korah's COA pages.
  if (COMMUNITY) return ((r0.coa = ""), (r0.lot = ""), r0);
  if (!r0.coa) {
    const l0 = String(e.lot || "").trim();
    /^KP-\d+$/i.test(l0) && (r0.coa = "https://coa.korahpeptides.com/" + l0.toUpperCase() + ".pdf");
  }
  return r0;
}
function PnBase(e) {
  const t = Ce(e.compoundId) || { name: "" },
    n = d.settings.labelDefaults || {},
    a = be(e.bacMl) ? be(e.vialMg) / be(e.bacMl) : 0,
    s = d.protocols.find((t) => t.compoundId === e.compoundId && t.active);
  let o = "";
  if (s && a) {
    const e = Ge(s, te()),
      t = (Se(e.dose, e.unit) / a) * Oe;
    o = `${fe(t, t < 10 ? 1 : 0)}u = ${fe(be(e.dose), 3)}${"iu" === e.unit ? "IU" : e.unit}`;
  }
  return Object.assign(
    {
      ribbon: n.ribbon || "",
      name: t.name,
      under: a ? n.under || "Injection" : "Lyophilised powder",
      strength: a
        ? `${fe(be(e.vialMg), 0)}${Me(t) ? "IU" : "MG"}/${fe(be(e.bacMl), be(e.bacMl) % 1 ? 1 : 0)}ML`
        : `${fe(be(e.vialMg), 0)}${Me(t) ? "IU" : "MG"}`,
      note: a ? "Multi dose vial" : "Reconstitute before use",
      between: n.between || "For subcutaneous use",
      bottom: o,
      small: n.small || "",
      made: e.vendor ? `MFG: ${e.vendor}` : n.made || "",
      useby: e.expiry ? oe(e.expiry) : "",
      lot: e.lot ? `LOT: ${e.lot}` : "",
      coa: e.coa || "",
    },
    e.label || {},
  );
}
function On(e, t, n, a) {
  ((e.width = 472), (e.height = 236));
  const s = e.getContext("2d");
  ((s.fillStyle = n), s.fillRect(0, 0, 472, 236), (s.fillStyle = a));
  const o = (e, t, n, a, o) => {
    let i = n;
    do {
      if (
        ((s.font = `${a || "700"} ${i}px ${o || '"IBM Plex Sans",Arial,sans-serif'}`),
        s.measureText(e).width <= t)
      )
        break;
      i -= 1;
    } while (i > 6);
    return i;
  };
  let i = 8;
  if (t.ribbon) {
    const e = 40;
    (s.fillRect(8, 8, e, 220), s.save(), s.translate(8 + e / 2, 222), s.rotate(-Math.PI / 2));
    const l = o(t.ribbon, 206, 26, "700");
    ((s.fillStyle = n),
      (s.textAlign = "left"),
      (s.textBaseline = "middle"),
      (s.font = `700 ${l}px "IBM Plex Sans",Arial,sans-serif`),
      s.fillText(t.ribbon, 0, 0),
      s.restore(),
      (s.fillStyle = a),
      (i = 8 + e + 10));
  }
  let l = 464;
  const d = [t.small, t.made, t.useby, COMMUNITY ? "" : t.lot].filter(Boolean);
  d.length &&
    ((l = 464 - (17 * d.length + 4)),
    d.forEach((e, t) => {
      (s.save(), s.translate(458 - 17 * t, 228), s.rotate(-Math.PI / 2));
      const n = o(e, 220, 13, "600");
      ((s.font = `600 ${n}px "IBM Plex Sans",Arial,sans-serif`),
        (s.textAlign = "left"),
        (s.textBaseline = "middle"),
        s.fillText(e, 0, 0),
        s.restore());
    }));
  let r = l - 8;
  if (!COMMUNITY && t.coa && "undefined" != typeof qrcode)
    try {
      const e = qrcode(0, "Q");
      (e.addData(t.coa), e.make());
      const o = e.getModuleCount(),
        q = 4,
        k = (o + 2 * q) * 3 <= 150 ? 3 : 2,
        z = (o + 2 * q) * k,
        d = r - z,
        c = 228 - z;
      ((s.fillStyle = n), s.fillRect(d, c, z, z), (s.fillStyle = a));
      for (let t = 0; t < o; t++)
        for (let n = 0; n < o; n++) e.isDark(t, n) && s.fillRect(d + (q + n) * k, c + (q + t) * k, k, k);
      r = d - 8;
    } catch (e) {}
  const c = r - i;
  let u = 12;
  if (t.name) {
    const e = o(t.name, c, 40, "700");
    ((s.font = `700 ${e}px "IBM Plex Sans",Arial,sans-serif`),
      (s.textAlign = "left"),
      (s.textBaseline = "top"),
      s.fillText(t.name, i, u),
      (u += e + 3));
  }
  if (t.under) {
    const e = o(t.under, c, 25, "400");
    ((s.font = `400 ${e}px "IBM Plex Sans",Arial,sans-serif`), s.fillText(t.under, i, u), (u += e + 6));
  }
  if (t.strength) {
    const e = o(t.strength, c - 16, 34, "700"),
      l = e + 12;
    (s.fillRect(i, u, c, l),
      (s.fillStyle = n),
      (s.font = `700 ${e}px "IBM Plex Sans",Arial,sans-serif`),
      (s.textBaseline = "middle"),
      s.fillText(t.strength, i + 8, u + l / 2 + 1),
      (s.fillStyle = a),
      (s.textBaseline = "top"),
      (u += l + 3));
  }
  if (t.note) {
    const e = o(t.note, c, 17, "400");
    ((s.font = `400 ${e}px "IBM Plex Sans",Arial,sans-serif`), s.fillText(t.note, i, u), (u += e + 4));
  }
  if (t.between) {
    const e = o(t.between, c, 24, "400");
    ((s.font = `400 ${e}px "IBM Plex Sans",Arial,sans-serif`), s.fillText(t.between, i, u), (u += e + 6));
  }
  if (t.bottom) {
    const e = o(t.bottom, c - 16, 34, "700"),
      l = e + 12,
      d = Math.max(u, 228 - l);
    (s.fillRect(i, d, c, l),
      (s.fillStyle = n),
      (s.font = `700 ${e}px "IBM Plex Sans",Arial,sans-serif`),
      (s.textBaseline = "middle"),
      s.fillText(t.bottom, i + 8, d + l / 2 + 1),
      (s.fillStyle = a));
  }
}
function Bn() {
  const e = Bt('<div class="stack"></div>'),
    t = d.batches.filter((e) => "finished" !== e.status);
  if (
    ((r.labelId && t.some((e) => e.id === r.labelId)) || (r.labelId = (t[0] || {}).id || null),
    e.appendChild(
      Bt(
        `<div class="head"><div><h1>Vial labels</h1>\n    <p>Print one, or paste it into your label printer's editor. Nothing here changes the vial — it only affects the label.</p></div>\n    ${
          t.length
            ? `<select id="lb-pick" style="width:auto;min-width:220px">${ft(t)
                .map((e) => {
                  const t = Ce(e.compoundId);
                  return `<option value="${e.id}"${r.labelId === e.id ? " selected" : ""}>${Ht(t ? t.name : "?")} · ${Ht(e.vialMg)} mg${e.lot ? " · " + Ht(e.lot) : ""}</option>`;
                })
                .join("")}</select>`
            : ""
        }</div>`,
      ),
    ),
    !t.length)
  )
    return (
      e.appendChild(
        Bt('<div class="panel"><div class="empty"><b>No vials to label</b>Add stock first.</div></div>'),
      ),
      e
    );
  e.querySelector("#lb-pick").addEventListener("change", (e) => {
    ((r.labelId = e.target.value), Ua());
  });
  const n = qe(r.labelId),
    a = Pn(n);
  let o = be(n.labelStock) || 0;
  const i = Bt('<div class="split"></div>'),
    l = Bt(
      `<div class="stack">\n    <div class="panel"><div class="pbody">\n      <div class="labelcard" id="lcard">\n        <img id="limg" alt="Vial label preview" style="width:100%;max-width:472px;height:auto;border-radius:3px">\n      </div>\n      <p class="tiny muted" style="margin:12px 0 0">${be(n.bacMl) ? "This batch is mixed, so the label carries its concentration and units per dose." : "This batch is still powder, so the label says so instead of a concentration."}</p>\n    </div></div>\n    <div class="panel"><h2>Label stock</h2><div class="pbody">\n      <div class="chips" id="lb-stock">${Tn.map((e, t) => `<button class="chip" data-si="${t}" aria-pressed="${o === t ? "true" : "false"}">\n        <span class="chipdot" style="background:${e[1]}"></span><span class="chipdot" style="background:${e[2]}"></span>${Ht(e[0])}</button>`).join("")}</div>\n      <p class="tiny muted" style="margin:12px 0 0">Preview only. The file you download is always black on white — a thermal printer decides per dot whether to lay ribbon down and cannot know what colour is on the spool, so gold on black and black on silver print from the same image.</p>\n      <p class="tiny muted" style="margin:8px 0 0">40 × 20 mm at 300 dpi — 472×236 pixels. Black and white only.</p>\n      <div class="row" style="margin-top:14px">\n        <button class="btn" id="lb-share" hidden>Save to Photos</button>\n        <button class="btn" id="lb-png">Download PNG</button>\n        <button class="btn ghost" id="lb-print">Print</button></div>\n      <p class="tiny muted" style="margin:8px 0 0" id="lb-hint">You can also press and hold the label to save it.</p>\n    </div></div></div>`,
    ),
    c = Bt('<div class="panel"><h2>What is printed</h2><div class="pbody" id="lf2"></div></div>');
  (i.appendChild(l), i.appendChild(c), e.appendChild(i));
  const u = [
    ["ribbon", "Left ribbon"],
    ["name", "Compound"],
    ["under", "Under the name"],
    ["strength", "Strength"],
    ["note", "Note under the strength"],
    ["between", "Between the bars"],
    ["bottom", "Bottom bar"],
    ["small", "Small print (sideways)"],
    ["made", "Made by (sideways)"],
    ["useby", "Use by (sideways)"],
    ["lot", "Lot (sideways)"],
    ["coa", "CoA link (printed as a QR code)"],
  ].filter(([e]) => !COMMUNITY || (e !== "lot" && e !== "coa"));
  c.querySelector("#lf2").innerHTML =
    '<p class="tiny muted" style="margin:0 0 12px">Change any of these and the label redraws.</p>' +
    (COMMUNITY ? "" : `<div class="qrbox"><div class="qrhead">QR address for Niimbot</div><div class="cprow"><input id="lf-coa" value="${Ht(a.coa || "")}"><button class="btn sm cpb" type="button" data-cp="coa">Copy address</button></div><p class="tiny muted" style="margin:8px 0 0">Filled in from the lot number when it looks like KP-0001, otherwise type it. In Niimbot, add a QR code element and paste this. Size about 10 × 10 mm with 1 mm clear around it. The picture label draws this same address as its QR code.</p></div>`) +
    u
      .filter(([e]) => "coa" !== e)
      .map(
        ([e, t]) =>
          `<div class="field"><label for="lf-${e}">${t}</label><div class="cprow"><input id="lf-${e}" value="${Ht(a[e] || "")}"><button class="btn sm cpb" type="button" data-cp="${e}">Copy</button></div></div>`,
      )
      .join("") +
    '<div class="row"><button class="btn sm" id="lb-savebatch">Save to this vial</button>\n      <button class="btn ghost sm" id="lb-savedef">Save wording as default</button>\n      <button class="btn ghost sm" id="lb-reset">Reset</button></div>';
  const p = document.createElement("canvas"),
    h = l.querySelector("#limg"),
    m = () => {
      u.forEach(([e]) => {
        a[e] = c.querySelector("#lf-" + e).value;
      });
      const e = Tn[o];
      On(p, a, e[1], e[2]);
      try {
        h.src = p.toDataURL("image/png");
      } catch (e) {}
      l.querySelector("#lcard").style.background = (e[1], "var(--surface-2)");
    };
  (u.forEach(([e]) => c.querySelector("#lf-" + e).addEventListener("input", m)),
    c.querySelectorAll("[data-cp]").forEach((b) =>
      b.addEventListener("click", async () => {
        const el = c.querySelector("#lf-" + b.dataset.cp);
        if (!el) return;
        try {
          await navigator.clipboard.writeText(el.value);
        } catch (x) {
          (el.select(), document.execCommand("copy"));
        }
        Ft("Copied.");
      }),
    ),
    l.querySelectorAll("#lb-stock button").forEach((e) =>
      e.addEventListener("click", () => {
        ((o = +e.dataset.si),
          (n.labelStock = o),
          s(),
          l
            .querySelectorAll("#lb-stock button")
            .forEach((t) => t.setAttribute("aria-pressed", t === e ? "true" : "false")),
          m());
      }),
    ));
  const g = () => {
      const e = document.createElement("canvas");
      On(e, a, "#FFFFFF", "#000000");
      const t = e.toDataURL("image/png"),
        n = atob(t.split(",")[1]),
        s = new Uint8Array(n.length);
      for (let e = 0; e < n.length; e++) s[e] = n.charCodeAt(e);
      return new Blob([s], { type: "image/png" });
    },
    v = () => {
      const e = Ce(n.compoundId);
      return `label-${(e ? e.name : "vial").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
    };
  l.querySelector("#lb-png").addEventListener("click", () => {
    (Ea(v(), g()), Ft("Label downloaded."));
  });
  const b = l.querySelector("#lb-share");
  try {
    const e = new File([new Blob([1])], "x.png", { type: "image/png" });
    navigator.canShare &&
      navigator.canShare({ files: [e] }) &&
      ((b.hidden = !1),
      (l.querySelector("#lb-hint").textContent =
        "Save to Photos opens the share sheet — choose Save Image, then import it in the Niimbot app."),
      b.addEventListener("click", async () => {
        try {
          await navigator.share({ files: [new File([g()], v(), { type: "image/png" })] });
        } catch (e) {
          e && "AbortError" !== e.name && Ft("Could not open the share sheet.");
        }
      }));
  } catch (e) {}
  return (
    l.querySelector("#lb-print").addEventListener("click", () => {
      const e = document.createElement("canvas");
      On(e, a, "#FFFFFF", "#000000");
      const t = window.open("", "_blank");
      t
        ? (t.document.write(`<img src="${e.toDataURL()}" style="width:40mm;height:20mm">`),
          t.document.close(),
          setTimeout(() => t.print(), 300))
        : Ft("Your browser blocked the print window.");
    }),
    c.querySelector("#lb-savebatch").addEventListener("click", () => {
      ((n.label = {}),
        u.forEach(([e]) => {
          n.label[e] = a[e];
        }),
        s(),
        Ft("Label saved to this vial."));
    }),
    c.querySelector("#lb-savedef").addEventListener("click", () => {
      ((d.settings.labelDefaults = {
        ribbon: a.ribbon,
        under: a.under,
        between: a.between,
        small: a.small,
        made: a.made,
      }),
        s(),
        Ft("Wording saved as your default."));
    }),
    c.querySelector("#lb-reset").addEventListener("click", () => {
      (delete n.label, s(), Ua(), Ft("Reset to the vial’s own values."));
    }),
    document.fonts && document.fonts.ready && document.fonts.ready.then(m),
    setTimeout(m, 30),
    e
  );
}
let Hn = { vialMg: 10, bacMl: 2, dose: 2.5, unit: "mg", vialUnit: "mg", barrel: 100, from: "" },
  Un = { vialMg: 10, dose: 2.5, unit: "mg", vialUnit: "mg", units: 25, from: "" },
  Qn = { cid: "", dose: "", unit: "mg", freq: "daily", addVials: 0, vialMg: "" };
function Nn() {
  const e = Bt('<div class="stack"></div>');
  e.appendChild(
    Bt(
      '<div class="head"><div><h1>Tools</h1>\n    <p>Calculators for the questions that come before anything is recorded. Nothing here changes your stock or your logs.</p></div></div>',
    ),
  );
  const t = Bt('<div class="grid2"></div>'),
    n = ft(d.batches.filter((e) => "finished" !== e.status))
      .map((e) => {
        const t = Ce(e.compoundId);
        return `<option value="${e.id}">${Ht(t ? t.name : "?")} · ${Ht(e.vialMg)} mg${e.bacMl ? " in " + Ht(e.bacMl) + " mL" : ""}</option>`;
      })
      .join(""),
    a = Bt(
      `<div class="panel"><h2>Draw calculator</h2><div class="pbody">\n    <p class="tiny muted" style="margin:0 0 12px">What to pull for a dose, from a vial mixed with a known amount of water.</p>\n    <div class="field"><label for="a-from">Start from a vial in stock</label>\n      <select id="a-from"><option value="">Enter the numbers myself</option>${n}</select>\n      <span class="hint">Fills the fields in. Change any of them afterwards.</span></div>\n    <div class="fgrid">\n      <div class="field"><label for="a-vial">Vial strength</label>\n        <div class="unitwrap"><input id="a-vial" type="number" step="any" min="0" value="${Hn.vialMg}">\n          <select id="a-vu"><option value="mg"${"iu" !== Hn.vialUnit ? " selected" : ""}>mg</option>\n            <option value="iu"${"iu" === Hn.vialUnit ? " selected" : ""}>IU</option></select></div></div>\n      <div class="field"><label for="a-bac">Water added (mL)</label><input id="a-bac" type="number" step="any" min="0" value="${Hn.bacMl}">\n        <span class="hint">Bacteriostatic water the vial was mixed with.</span></div></div>\n    <div class="fgrid">\n      <div class="field"><label for="a-dose">Dose</label>\n        <div class="unitwrap"><input id="a-dose" type="number" step="any" min="0" value="${Hn.dose}">\n          <select id="a-unit"><option value="mg"${"mg" === Hn.unit ? " selected" : ""}>mg</option><option value="mcg"${"mcg" === Hn.unit ? " selected" : ""}>mcg</option><option value="iu"${"iu" === Hn.unit ? " selected" : ""}>IU</option></select></div></div>\n      <div class="field"><label for="a-barrel">Syringe barrel</label><select id="a-barrel">\n        <option value="100"${100 == Hn.barrel ? " selected" : ""}>1 mL (100 units)</option>\n        <option value="50"${50 == Hn.barrel ? " selected" : ""}>0.5 mL (50 units)</option>\n        <option value="30"${30 == Hn.barrel ? " selected" : ""}>0.3 mL (30 units)</option></select></div></div>\n    <div id="a-out"></div></div></div>`,
    ),
    s = () => {
      Hn = {
        vialMg: be(a.querySelector("#a-vial").value),
        bacMl: be(a.querySelector("#a-bac").value),
        dose: be(a.querySelector("#a-dose").value),
        unit: a.querySelector("#a-unit").value,
        vialUnit: a.querySelector("#a-vu").value,
        barrel: +a.querySelector("#a-barrel").value,
        from: a.querySelector("#a-from").value,
      };
      const e = { base: "iu" === Hn.vialUnit ? "iu" : "mg" },
        t = ("iu" === Hn.vialUnit) != ("iu" === Hn.unit),
        n = Se(Hn.dose, Hn.unit),
        s = Qe(Hn.vialMg, Hn.bacMl, n),
        o = Hn.vialMg - Math.floor(s.perVial) * n;
      a.querySelector("#a-out").innerHTML =
        `\n      <div style="background:var(--surface-2);border:1px solid var(--rule-soft);border-radius:7px;padding:12px">\n        <div class="eyebrow" style="margin:0 0 4px">Draw</div>\n        <div class="big-read">${fe(s.units, 1)}<small> units</small></div>\n        ${Wt(s.units, Hn.barrel, { compact: !0 })}\n        <div class="tiny muted">${fe(s.volMl, 3)} mL · ${fe(s.conc, 2)} ${Ae(e)}</div>\n        <div class="tiny muted">Makes ${fe(s.perVial, s.perVial % 1 ? 1 : 0)} doses${o > 5e-4 ? `, with ${$e(o, e)} left over` : ", with nothing left over"}.</div>\n        ${t ? `<div class="tiny" style="color:var(--due);margin-top:6px">The vial is in ${"iu" === Hn.vialUnit ? "IU" : "mg"} but the dose is in ${"iu" === Hn.unit ? "IU" : Hn.unit}. IU has no fixed mg equivalent, so put both in the same unit or this figure means nothing.</div>` : ""}\n        ${s.units > Hn.barrel ? '<div class="tiny" style="color:var(--alert);margin-top:6px">More than the barrel holds. Use less water, or split the dose.</div>' : ""}\n        ${s.units && s.units < 3 ? '<div class="tiny" style="color:var(--due);margin-top:6px">Under 3 units is hard to measure. More water spreads the same dose over more units.</div>' : ""}\n      </div>`;
    };
  (a.querySelectorAll("input,select").forEach((e) => e.addEventListener("input", s)),
    a.querySelector("#a-from").addEventListener("change", (e) => {
      const t = qe(e.target.value);
      if (t) {
        ((a.querySelector("#a-vial").value = t.vialMg),
          (a.querySelector("#a-bac").value = t.bacMl || ""),
          (a.querySelector("#a-vu").value = Me(Ce(t.compoundId)) ? "iu" : "mg"));
        const e = d.protocols.find((e) => e.compoundId === t.compoundId);
        e && ((a.querySelector("#a-dose").value = e.dose), (a.querySelector("#a-unit").value = e.unit));
      }
      s();
    }));
  const o = Bt(
      `<div class="panel"><h2>Mixing calculator</h2><div class="pbody">\n    <p class="tiny muted" style="margin:0 0 12px">How much water to add so a dose lands on the syringe mark you want.</p>\n    <div class="field"><label for="b-from">Start from a vial in stock</label>\n      <select id="b-from"><option value="">Enter the numbers myself</option>${n}</select></div>\n    <div class="field"><label for="b-vial">Vial strength</label>\n      <div class="unitwrap"><input id="b-vial" type="number" step="any" min="0" value="${Un.vialMg}">\n        <select id="b-vu"><option value="mg"${"iu" !== Un.vialUnit ? " selected" : ""}>mg</option>\n          <option value="iu"${"iu" === Un.vialUnit ? " selected" : ""}>IU</option></select></div></div>\n    <div class="fgrid">\n      <div class="field"><label for="b-dose">Dose</label>\n        <div class="unitwrap"><input id="b-dose" type="number" step="any" min="0" value="${Un.dose}">\n          <select id="b-unit"><option value="mg"${"mg" === Un.unit ? " selected" : ""}>mg</option><option value="mcg"${"mcg" === Un.unit ? " selected" : ""}>mcg</option><option value="iu"${"iu" === Un.unit ? " selected" : ""}>IU</option></select></div></div>\n      <div class="field"><label for="b-units">Draw per shot (units)</label><input id="b-units" type="number" step="any" min="0" value="${Un.units}">\n        <span class="hint" id="b-ml"></span></div></div>\n    <div id="b-out"></div></div></div>`,
    ),
    i = () => {
      Un = {
        vialMg: be(o.querySelector("#b-vial").value),
        dose: be(o.querySelector("#b-dose").value),
        unit: o.querySelector("#b-unit").value,
        vialUnit: o.querySelector("#b-vu").value,
        units: be(o.querySelector("#b-units").value),
        from: o.querySelector("#b-from").value,
      };
      const e = { base: "iu" === Un.vialUnit ? "iu" : "mg" },
        t = ("iu" === Un.vialUnit) != ("iu" === Un.unit),
        n = Se(Un.dose, Un.unit),
        a = Ne(Un.vialMg, n, Un.units);
      ((o.querySelector("#b-ml").textContent = `${fe(Un.units / Oe, 3)} mL on the syringe`),
        (o.querySelector("#b-out").innerHTML =
          `\n      <div style="background:var(--surface-2);border:1px solid var(--rule-soft);border-radius:7px;padding:12px;display:flex;gap:14px;align-items:flex-start">\n        <div style="flex:none;text-align:center">${jt(1, "var(--signal)", 52)}\n          <div class="tiny muted" style="margin-top:4px">${a.waterMl ? Fe(a.waterMl) + " mL vial" : ""}</div></div>\n        <div style="flex:1">\n          <div class="eyebrow" style="margin:0 0 4px">Mix with</div>\n          <div class="big-read">${fe(a.waterMl, 2)}<small> mL</small></div>\n          <div class="tiny muted" style="margin-top:8px">Your dose lands exactly on that mark.</div>\n          <div class="tiny muted">${fe(a.conc, 2)} ${Ae(e)}</div>\n          <div class="tiny muted">Makes ${fe(a.perVial, a.perVial % 1 ? 1 : 0)} doses.</div>\n          ${t ? '<div class="tiny" style="color:var(--due);margin-top:6px">Vial and dose are in different units. IU does not convert to mg — match them up.</div>' : ""}\n        </div></div>`));
    };
  (o.querySelectorAll("input,select").forEach((e) => e.addEventListener("input", i)),
    o.querySelector("#b-from").addEventListener("change", (e) => {
      const t = qe(e.target.value);
      if (t) {
        ((o.querySelector("#b-vial").value = t.vialMg),
          (o.querySelector("#b-vu").value = Me(Ce(t.compoundId)) ? "iu" : "mg"));
        const e = d.protocols.find((e) => e.compoundId === t.compoundId);
        e && ((o.querySelector("#b-dose").value = e.dose), (o.querySelector("#b-unit").value = e.unit));
      }
      i();
    }),
    t.appendChild(a),
    t.appendChild(o),
    e.appendChild(t));
  const l = [...new Set(d.batches.filter((e) => "finished" !== e.status).map((e) => e.compoundId))];
  if (l.length) {
    if (!Qn.cid || !l.includes(Qn.cid)) {
      Qn.cid = l[0];
      const e = d.protocols.find((e) => e.compoundId === Qn.cid && e.active);
      if (e) {
        const t = Ge(e, te());
        ((Qn.dose = t.dose),
          (Qn.unit = t.unit),
          (Qn.freq = "daily" === e.sched ? (e.split ? "twice" : "daily") : "custom"));
      }
    }
    const t = Bt(
        `<div class="panel"><h2>Runway simulator</h2><div class="pbody">\n      <p class="tiny muted" style="margin:0 0 12px">How long your stock lasts at a dose you are thinking about, rather than the one you are on.</p>\n      <div class="fgrid3">\n        <div class="field"><label for="c-c">Compound</label><select id="c-c">${l
          .map((e) => {
            const t = Ce(e);
            return `<option value="${e}"${Qn.cid === e ? " selected" : ""}>${Ht(t.name)}</option>`;
          })
          .join(
            "",
          )}</select>\n          <span class="hint" id="c-hand"></span></div>\n        <div class="field"><label for="c-d">Dose to try</label>\n          <div class="unitwrap"><input id="c-d" type="number" step="any" min="0" value="${Ht(Qn.dose)}">\n            <select id="c-u"><option value="mg"${"mg" === Qn.unit ? " selected" : ""}>mg</option><option value="mcg"${"mcg" === Qn.unit ? " selected" : ""}>mcg</option><option value="iu"${"iu" === Qn.unit ? " selected" : ""}>IU</option></select></div>\n          <span class="hint" id="c-now"></span></div>\n        <div class="field"><label for="c-f">How often</label><select id="c-f">\n          <option value="daily"${"daily" === Qn.freq ? " selected" : ""}>Daily</option>\n          <option value="2"${"2" === Qn.freq ? " selected" : ""}>Every other day</option>\n          <option value="3"${"3" === Qn.freq ? " selected" : ""}>Every 3 days</option>\n          <option value="7"${"7" === Qn.freq ? " selected" : ""}>Weekly</option>\n          <option value="twice"${"twice" === Qn.freq ? " selected" : ""}>Twice a day</option></select></div></div>\n      <div class="fgrid">\n        <div class="field"><label for="c-av">Vials to add</label><input id="c-av" type="number" min="0" step="1" value="${Ht(Qn.addVials)}"><span class="hint">Optional</span></div>\n        <div class="field"><label for="c-vm">Of what size (mg)</label><input id="c-vm" type="number" step="any" min="0" value="${Ht(Qn.vialMg)}" placeholder=""></div></div>\n      <div id="c-out"></div></div></div>`,
      ),
      n = () => {
        Qn = {
          cid: t.querySelector("#c-c").value,
          dose: be(t.querySelector("#c-d").value),
          unit: t.querySelector("#c-u").value,
          freq: t.querySelector("#c-f").value,
          addVials: be(t.querySelector("#c-av").value),
          vialMg: be(t.querySelector("#c-vm").value),
        };
        const e = wt(Qn.cid) + Qn.addVials * Qn.vialMg,
          n = Se(Qn.dose, Qn.unit),
          a = "daily" === Qn.freq ? 1 : "twice" === Qn.freq ? 2 : 1 / be(Qn.freq),
          s = n > 0 ? Math.floor(e / n) : null,
          o = null !== s && a > 0 ? Math.floor(s / a) : null,
          i = be(d.settings.targetDays) || 90,
          l = At(Qn.cid);
        t.querySelector("#c-hand").textContent = `${$e(wt(Qn.cid), Ce(Qn.cid))} on hand`;
        const r = d.protocols.find((e) => e.compoundId === Qn.cid && e.active),
          c = r ? Ge(r, te()) : null;
        ((t.querySelector("#c-now").textContent = c
          ? `You take ${fe(be(c.dose), 3)} ${c.unit} at the moment${c.of ? ` — phase ${c.phase} of ${c.of}${c.holding ? ", held" : ""}` : ""}.`
          : ""),
          (t.querySelector("#c-out").innerHTML =
            `\n        <div style="background:var(--surface-2);border:1px solid var(--rule-soft);border-radius:7px;padding:12px">\n          <div class="eyebrow" style="margin:0 0 4px">Your stock lasts</div>\n          <div class="big-read" style="color:${null === o ? "var(--ink-2)" : o >= i ? "var(--done)" : o < 0.34 * i ? "var(--alert)" : "var(--due)"}">${null === o ? "—" : ke(o)}<small> left</small></div>\n          <div class="bar ${null === o ? "" : o >= i ? "good" : o < 0.34 * i ? "bad" : "warn"}" style="margin:10px 0 8px">\n            <i style="width:${null === o ? 0 : Math.min(100, (o / i) * 100)}%"></i></div>\n          <div class="tiny muted">${null === s ? "Enter a dose." : `${s} doses left · until ${oe(ne(te(), o))}`}</div>\n          <div class="tiny muted">${$e(e, Ce(Qn.cid))} on hand${Qn.addVials ? ` (including ${Qn.addVials} new vial${Qn.addVials > 1 ? "s" : ""})` : ""}</div>\n          <div class="tiny muted">As things stand: ${null === l ? "no active protocol" : ke(l) + " left"}</div>\n        </div>`));
      };
    (t.querySelectorAll("input,select").forEach((e) => e.addEventListener("input", n)),
      t.querySelector("#c-c").addEventListener("change", () => {
        const e = Ee(t.querySelector("#c-c").value);
        (e && (t.querySelector("#c-vm").value = e.vialMg), n());
      }),
      e.appendChild(t),
      setTimeout(n, 0));
  }
  return (
    setTimeout(() => {
      (s(), i());
    }, 0),
    e
  );
}
const Fn = [
    "compounds",
    "protocols",
    "batches",
    "solutions",
    "supplies",
    "logs",
    "metrics",
    "weights",
    "labTests",
    "labDraws",
    "insights",
    "insGuides",
  ],
  Vn =
    /^my\.korahpeptides\.com$/i.test(location.hostname) || /^rickspeptidetracker\./i.test(location.hostname),
  Rn =
    'const firebaseConfig = {\n  apiKey: "AIzaSyCII6ZuPDIFfanFXNqX_QaKG7W5_B7-pYg",\n  authDomain: "korah-peptides.firebaseapp.com",\n  projectId: "korah-peptides",\n  storageBucket: "korah-peptides.firebasestorage.app",\n  messagingSenderId: "28465208707",\n  appId: "1:28465208707:web:09df25830f07778cc06ab6"\n};',
  Wn = !Vn && !!Rn.trim(),
  jn = Vn || Wn,
  Gn = 8,
  Kn = () => (Wn ? Rn : (d.settings && d.settings.sync && d.settings.sync.config) || ""),
  Jn = ["12.18.0", "11.10.0", "10.14.1"];
let zn = null,
  Yn = !1,
  Zn = null,
  Xn = {},
  _n = { status: "off", msg: "", at: 0 };
function ea(e) {
  const t = {};
  for (const n in e) "_m" !== n && (t[n] = e[n]);
  return JSON.stringify(t);
}
function ta() {
  const e = Date.now(),
    t = {};
  for (const n of Fn)
    for (const a of d[n] || []) {
      if (!a || !a.id) continue;
      t[a.id] = 1;
      const n = ea(a);
      Xn[a.id] !== n && ((a._m = e), (Xn[a.id] = n));
    }
  d._del = d._del || {};
  for (const n in Xn) t[n] || d._del[n] || ((d._del[n] = e), delete Xn[n]);
  const n = ea(d.settings || {});
  Xn.__settings !== n && ((d.settings._m = e), (Xn.__settings = n));
}
function na() {
  Xn = {};
  for (const e of Fn) for (const t of d[e] || []) t && t.id && (Xn[t.id] = ea(t));
  Xn.__settings = ea(d.settings || {});
}
function aa(e, t) {
  const n = Object.assign({}, t._del || {});
  for (const t in e._del || {}) n[t] = Math.max(n[t] || 0, e._del[t]);
  const a = l();
  a._del = n;
  for (const s of Fn) {
    const o = {};
    for (const e of t[s] || []) e && e.id && (o[e.id] = e);
    for (const t of e[s] || []) {
      if (!t || !t.id) continue;
      const e = o[t.id];
      (!e || (t._m || 0) >= (e._m || 0)) && (o[t.id] = t);
    }
    a[s] = Object.keys(o)
      .map((e) => o[e])
      .filter((e) => !(n[e.id] && n[e.id] > (e._m || 0)));
  }
  const s = (e.settings && e.settings._m) || 0,
    o = (t.settings && t.settings._m) || 0;
  return ((a.settings = Object.assign(l().settings, o > s ? t.settings : e.settings)), a);
}
const sa = (e) => {
    let t = "";
    for (let n = 0; n < e.length; n += 32768) t += String.fromCharCode.apply(null, e.subarray(n, n + 32768));
    return btoa(t);
  },
  oa = (e) => {
    const t = atob(e),
      n = new Uint8Array(t.length);
    for (let a = 0; a < t.length; a++) n[a] = t.charCodeAt(a);
    return n;
  };
async function ia(e, t) {
  const n = await crypto.subtle.importKey("raw", new TextEncoder().encode(e), "PBKDF2", !1, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: t, iterations: 25e4, hash: "SHA-256" },
    n,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"],
  );
}
async function la(e, t) {
  if (!t) return { enc: 0, body: JSON.stringify(e) };
  const n = crypto.getRandomValues(new Uint8Array(16)),
    a = crypto.getRandomValues(new Uint8Array(12)),
    s = await ia(t, n),
    o = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: a },
      s,
      new TextEncoder().encode(JSON.stringify(e)),
    );
  return { enc: 1, salt: sa(n), iv: sa(a), body: sa(new Uint8Array(o)) };
}
async function da(e, t) {
  if (!e.enc) return JSON.parse(e.body);
  if (!t) throw new Error("This log is encrypted. Enter your passphrase.");
  const n = await ia(t, oa(e.salt));
  let a;
  try {
    a = await crypto.subtle.decrypt({ name: "AES-GCM", iv: oa(e.iv) }, n, oa(e.body));
  } catch (e) {
    throw new Error("That passphrase does not open this log.");
  }
  return JSON.parse(new TextDecoder().decode(a));
}
function ra(e) {
  const t = {};
  for (const n of ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]) {
    const a = e.match(new RegExp(n + "\\s*:\\s*[\"']([^\"']+)[\"']"));
    a && (t[n] = a[1]);
  }
  if (!t.apiKey || !t.projectId) {
    try {
      const t = JSON.parse(e);
      if (t.apiKey && t.projectId) return t;
    } catch (e) {}
    throw new Error(
      "That does not look like a Firebase config. Copy the whole block, from the opening brace to the closing one.",
    );
  }
  return (t.authDomain || (t.authDomain = t.projectId + ".firebaseapp.com"), t);
}
async function ca() {
  if (zn) return zn;
  let e;
  for (const t of Jn)
    try {
      const [e, n, a] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${t}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${t}/firebase-auth.js`),
        import(`https://www.gstatic.com/firebasejs/${t}/firebase-firestore.js`),
      ]);
      return ((zn = { v: t, app: e, auth: n, fs: a }), zn);
    } catch (t) {
      e = t;
    }
  throw new Error("Could not load Firebase. Check the connection. (" + ((e && e.message) || "") + ")");
}
function ua() {
  try {
    return !!localStorage.getItem("protocol:pw");
  } catch (e) {
    return !1;
  }
}
function pa() {
  try {
    return !!localStorage.getItem("protocol:pass");
  } catch (e) {
    return !1;
  }
}
function ha() {
  return d.settings.sync || (d.settings.sync = { enabled: !1, config: "", email: "", auto: !0 });
}
async function ma() {
  const e = Kn();
  if (!e) throw new Error("Paste your Firebase config first.");
  const t = await ca();
  if (!t.instance) {
    const n = ra(e);
    ((t.instance = t.app.initializeApp(n)),
      (t.authI = t.auth.getAuth(t.instance)),
      (t.db = t.fs.getFirestore(t.instance)));
    let a = !1;
    for (const e of [t.auth.indexedDBLocalPersistence, t.auth.browserLocalPersistence])
      if (e)
        try {
          (await t.auth.setPersistence(t.authI, e), (a = !0));
          break;
        } catch (e) {}
    t.persisted = a;
  }
  return t;
}
async function ga(e, t, n) {
  const a = await ma(),
    o = n ? a.auth.createUserWithEmailAndPassword : a.auth.signInWithEmailAndPassword,
    i = await o(a.authI, e, t),
    l = ha();
  if (((l.email = e), !1 !== l.remember))
    try {
      localStorage.setItem("protocol:pw", t);
    } catch (e) {}
  return (s(), i.user);
}
async function va() {
  const e = ha();
  if (!e.enabled || !Kn() || !e.email) return null;
  const t = await ma();
  if (t.authI.currentUser) return t.authI.currentUser;
  let n = null;
  try {
    n = localStorage.getItem("protocol:pw");
  } catch (e) {}
  return n ? (await t.auth.signInWithEmailAndPassword(t.authI, e.email, n)).user : null;
}
async function ba() {
  try {
    localStorage.removeItem("protocol:pw");
  } catch (e) {}
  (zn && zn.authI && (await zn.auth.signOut(zn.authI)), (_n = { status: "off", msg: "", at: 0 }), Ua());
}
function ya() {
  return zn && zn.authI ? zn.authI.currentUser : null;
}
async function fa(e) {
  if (!jn) return;
  if (!ha().enabled || Yn) return;
  const n = localStorage.getItem("protocol:pass") || "";
  try {
    ((Yn = !0), (_n = { status: "working", msg: "Syncing…", at: _n.at }), e || ka());
    const a = await ma(),
      s = ya();
    if (!s) throw new Error("Sign in first.");
    if (Wn && n.length < 8) throw new Error("Set a passphrase of at least 8 characters first.");
    const o = a.fs.doc(a.db, "logs", s.uid),
      i = await a.fs.getDoc(o);
    ta();
    let l = d;
    if (i.exists()) {
      const e = await da(i.data(), n);
      l = aa(d, e);
    }
    ((d = l), na(), await t.set(JSON.stringify(d)));
    const r = await la(d, n);
    ((r.updatedAt = Date.now()),
      await a.fs.setDoc(o, r),
      (_n = { status: "ok", msg: "", at: Date.now() }),
      e || Ft("Synced."),
      Ua(1));
  } catch (t) {
    ((_n = { status: "error", msg: t.message || String(t), at: _n.at }),
      e || Ft(t.message || "Sync failed."),
      ka());
  } finally {
    Yn = !1;
  }
}
function wa() {
  if (!jn) return;
  const e = d.settings && d.settings.sync;
  e && e.enabled && e.auto && (clearTimeout(Zn), (Zn = setTimeout(() => fa(!0), 4e3)));
}
function ka() {
  const e = document.querySelector("#sync-status");
  if (!e) return;
  const t = ya();
  e.innerHTML =
    "working" === _n.status
      ? '<span class="pill">Syncing…</span>'
      : !t && ha().enabled && ha().email && ua() && "error" !== _n.status
        ? '<span class="pill">Reconnecting…</span>'
        : "error" === _n.status
          ? `<span class="pill late">Problem</span> <span class="tiny" style="color:var(--alert)">${Ht(_n.msg)}</span>`
          : t
            ? `<span class="pill done">Signed in as ${Ht(t.email)}</span>${_n.at ? ` <span class="tiny muted">last synced ${Ht(re(new Date(_n.at)))}</span>` : ""}`
            : '<span class="pill">Not signed in</span>';
}
function Sa() {
  const e = ha(),
    n = "undefined" != typeof localStorage && localStorage.getItem("protocol:pass"),
    a = Bt(
      `<div class="panel"><h2>Sync between devices<span id="sync-status"></span></h2><div class="pbody">\n    <p class="tiny muted" style="margin:0 0 12px">${Wn ? "Optional. Off by default — everything works without it. Turn it on to keep your phone and your computer level: sign in with the same email, password and passphrase on both. Your log is scrambled in this browser with your passphrase before it uploads, so what is stored is unreadable to anyone else, including whoever runs this site. Logging on one device does not wipe the other." : "Optional. Off by default — everything works without it. When it is on, your log is merged\n      through your own Firebase project so the phone and the PC stay level. Records are matched by id and the newer edit wins, so logging\n      on one device does not wipe the other."}</p>\n    <label class="check"><input type="checkbox" id="sy-on" ${e.enabled ? "checked" : ""}><span>Turn sync on</span></label>\n    <div id="sy-body" ${e.enabled ? "" : "hidden"}>\n      ${Wn ? "" : `<div class="field"><label for="sy-cfg">Firebase config</label>\n        <textarea id="sy-cfg" style="min-height:110px;font-family:var(--mono);font-size:12px" placeholder="Paste the whole firebaseConfig block from the Firebase console">${Ht(e.config)}</textarea>\n        <span class="hint">Project settings › Your apps › the web app › Config. Paste it all; the fields are picked out for you.</span></div>`}\n      <div class="fgrid">\n        <div class="field"><label for="sy-em">Email</label><input id="sy-em" type="email" autocomplete="username" value="${Ht(e.email)}"></div>\n        <div class="field"><label for="sy-pw">Password</label>\n          <input id="sy-pw" type="password" autocomplete="current-password" placeholder="${ua() ? "•••••• saved on this device" : "At least 6 characters"}"></div>\n      </div>\n      <label class="check"><input type="checkbox" id="sy-rem" ${!1 !== e.remember ? "checked" : ""}>\n        <span>Stay signed in on this device</span></label>\n      <div class="field"><label for="sy-ph">Passphrase (encryption${Wn ? ", required" : ""})</label>\n        <input id="sy-ph" type="password" autocomplete="off" placeholder="${n ? "•••••• already set on this device" : Wn ? "At least 8 characters" : "Leave blank to store it unencrypted"}">\n        <span class="hint">${Wn ? "Scrambles the log in your browser before it uploads. Use the same passphrase on both devices. <b>There is no way to recover it.</b> If you lose it, the only way back is to start the cloud copy over from a device that still has your data. Write it down somewhere real." : "Scrambles the log in your browser before it uploads, so the database holds text nobody can read — not Google, not me.\n          Use the same passphrase on both devices. <b>There is no way to recover it.</b> Lose it and the synced copy is gone for good, so write it down somewhere real."}</span></div>\n      ${Wn ? '<div class="field"><label for="sy-ph2">Repeat passphrase (new accounts only)</label>\n        <input id="sy-ph2" type="password" autocomplete="off"></div>' : ""}\n      <div class="row" style="margin-bottom:10px">\n        <button class="btn" id="sy-in">Sign in</button>\n        <button class="btn ghost" id="sy-new">Create account</button>\n        <button class="btn ghost" id="sy-go">Sync now</button>\n        <button class="btn ghost" id="sy-out">Sign out</button>\n        <button class="btn ghost" id="sy-fp">Forgot password</button></div>\n      <label class="check" style="margin:0"><input type="checkbox" id="sy-auto" ${!1 !== e.auto ? "checked" : ""}><span>Sync automatically a few seconds after a change</span></label>\n      ${Wn ? '<p class="tiny muted" style="margin:12px 0 0">Lost your passphrase? Type a new one above, then\n        <button class="btn ghost sm" id="sy-reset">Replace the cloud copy with this device</button>\n        The old cloud copy is gone for good; this device’s data becomes the new one.</p>' : ""}\n    </div></div></div>`,
    ),
    o = a.querySelector("#sy-on");
  o.addEventListener("change", () => {
    ((e.enabled = o.checked), (a.querySelector("#sy-body").hidden = !o.checked), s(), ka());
  });
  const i = a.querySelector("#sy-cfg");
  (i &&
    i.addEventListener("input", (t) => {
      ((e.config = t.target.value), s());
    }),
    a.querySelector("#sy-auto").addEventListener("change", (t) => {
      ((e.auto = t.target.checked), s());
    }),
    a.querySelector("#sy-rem").addEventListener("change", (t) => {
      if (((e.remember = t.target.checked), !e.remember))
        try {
          localStorage.removeItem("protocol:pw");
        } catch (e) {}
      s();
    }));
  const l = async (e) => {
    let {
      em: t,
      pw: n,
      ph: s,
    } = {
      em: a.querySelector("#sy-em").value.trim(),
      pw: a.querySelector("#sy-pw").value,
      ph: a.querySelector("#sy-ph").value,
    };
    if (!n && ua())
      try {
        n = localStorage.getItem("protocol:pw");
      } catch (e) {}
    if (!s && pa())
      try {
        s = localStorage.getItem("protocol:pass");
      } catch (e) {}
    if (t && n) {
      if (Wn) {
        if (!s) return void Ft("Choose a passphrase of at least 8 characters.");
        if (s.length < 8) return void Ft("The passphrase needs at least 8 characters.");
        const t = a.querySelector("#sy-ph").value,
          n = a.querySelector("#sy-ph2").value;
        if (e && t !== n) return void Ft("The two passphrases do not match.");
      }
      try {
        ((_n = { status: "working", msg: "", at: _n.at }),
          ka(),
          localStorage.setItem("protocol:pass", s || ""),
          await ga(t, n, e),
          await fa());
      } catch (e) {
        let t = e.message || String(e);
        (/email-already-in-use/.test(t)
          ? (t = "That email already has an account — use Sign in instead.")
          : /invalid-credential|wrong-password|user-not-found/.test(t)
            ? (t = "Email or password not recognised.")
            : /weak-password/.test(t)
              ? (t = "Password needs to be at least 6 characters.")
              : /operation-not-allowed/.test(t)
                ? (t = Wn
                    ? "Sync is not available right now. Try again later."
                    : "Turn on Email/Password in Firebase under Authentication › Sign-in method.")
                : /unauthorized-domain|auth\/invalid-api-key/.test(t)
                  ? (t = Wn
                      ? "Sync is not set up for this address yet."
                      : "Add this site’s address to Authorized domains in Firebase Authentication settings.")
                  : /permission-denied|Missing or insufficient/.test(t) &&
                    (t = Wn
                      ? "The sync service refused that. Try again later."
                      : "Firestore rules are blocking this. Paste the rule from the setup steps."),
          (_n = { status: "error", msg: t, at: _n.at }),
          ka(),
          Ft(t));
      }
    } else Ft("Enter your email and password.");
  };
  (a.querySelector("#sy-in").addEventListener("click", () => l(!1)),
    a.querySelector("#sy-new").addEventListener("click", () => l(!0)),
    a.querySelector("#sy-go").addEventListener("click", () => {
      const e = a.querySelector("#sy-ph").value;
      (e && localStorage.setItem("protocol:pass", e), fa());
    }),
    a.querySelector("#sy-out").addEventListener("click", () => {
      (localStorage.removeItem("protocol:pass"), ba());
    }),
    a.querySelector("#sy-fp").addEventListener("click", async () => {
      const e = a.querySelector("#sy-em").value.trim();
      if (e)
        try {
          const t = await ma();
          (await t.auth.sendPasswordResetEmail(t.authI, e),
            Ft(
              "If that email has an account, a reset link is on its way. It does not reset your passphrase.",
            ));
        } catch (e) {
          Ft(
            /invalid-email/.test(e.message || "")
              ? "That email does not look right."
              : e.message || "Could not send it.",
          );
        }
      else Ft("Type your email first.");
    }));
  const r = a.querySelector("#sy-reset");
  return (
    r &&
      r.addEventListener("click", async () => {
        const e = a.querySelector("#sy-ph").value;
        if (e.length < 8) Ft("Type the new passphrase (8+ characters) in the Passphrase box first.");
        else if (ya())
          if (d.compounds.length || d.logs.length) {
            if (
              confirm(
                "This replaces the synced copy in the cloud with what is on THIS device, scrambled with the passphrase you just typed. Anything that was only in the old cloud copy is lost for good. Continue?",
              )
            )
              try {
                localStorage.setItem("protocol:pass", e);
                const n = await ma();
                (ta(), na(), await t.set(JSON.stringify(d)));
                const a = await la(d, e);
                ((a.updatedAt = Date.now()),
                  await n.fs.setDoc(n.fs.doc(n.db, "logs", ya().uid), a),
                  (_n = { status: "ok", msg: "", at: Date.now() }),
                  ka(),
                  Ft("Cloud copy replaced."));
              } catch (e) {
                ((_n = { status: "error", msg: e.message || String(e), at: _n.at }),
                  ka(),
                  Ft(e.message || "Could not replace it."));
              }
          } else
            Ft(
              "This device has no data to put in the cloud. Use a device that has your log, or add your compounds first.",
            );
        else Ft("Sign in first.");
      }),
    setTimeout(ka, 0),
    a
  );
}
let Ma = 0;
async function xa() {
  if (!jn) return;
  const e = d.settings && d.settings.sync;
  if (e && e.enabled && Kn())
    try {
      const t = await ma();
      if (
        (t._watching ||
          ((t._watching = !0),
          t.auth.onAuthStateChanged(t.authI, (e) => {
            e ? ((Ma = 0), ka(), fa(!0)) : ka();
          })),
        await va())
      )
        return ((Ma = 0), ka(), void fa(!0));
      (e.email && localStorage.getItem("protocol:pw")) || ka();
    } catch (e) {
      Ma < 5
        ? (Ma++, setTimeout(xa, 2e3 * Ma))
        : ((_n = { status: "error", msg: e.message || "Could not reconnect.", at: _n.at }), ka());
    }
}
function Aa() {
  const e = Bt('<div class="stack"></div>');
  if (
    (e.appendChild(
      Bt(
        `<div class="head"><div><h1>Library</h1>\n    <p>Half-lives are reported figures used to draw the decay curves. Blank means no dependable human number, so no curve is drawn. Edit any of yours to override.</p>\n    <p id="sch-note">${Ht(C())}</p></div>\n    <div class="libctl"><span class="tiny muted">Schedule</span>\n      <div class="seg" id="sch-seg" role="group" aria-label="Schedule source">\n        <button data-schsrc="qr" aria-pressed="${!r.schedAlt}">Quick Reference</button>\n        <button data-schsrc="alt" aria-pressed="${!!r.schedAlt}">Alternative</button></div>\n      <button class="btn ghost" data-newcomp="1">Add a compound</button></div></div>`,
      ),
    ),
    e.querySelectorAll("#sch-seg button").forEach((t) =>
      t.addEventListener("click", () => {
        ((r.schedAlt = "alt" === t.dataset.schsrc),
          e
            .querySelectorAll("#sch-seg button")
            .forEach((e) =>
              e.setAttribute("aria-pressed", String(("alt" === e.dataset.schsrc) === r.schedAlt)),
            ),
          e.querySelectorAll("td[data-schn]").forEach((e) => {
            e.innerHTML = I(e.dataset.schn);
          }),
          (e.querySelector("#sch-note").textContent = C()));
      }),
    ),
    d.compounds.length)
  ) {
    const t = Bt(
        '<div class="panel"><h2>Yours</h2><div style="overflow:auto"><table class="libtbl"><thead><tr>\n      <th>Compound</th><th>Dose</th><th>JIBH</th><th>Schedule</th><th class="num">Half-life</th><th>Units</th><th>Route</th><th class="num">On hand</th><th class="num">Shots</th><th>Notes</th><th></th></tr></thead>\n      <tbody id="tb"></tbody></table></div></div>',
      ),
      n = t.querySelector("#tb");
    for (const e of bt()) {
      const t = d.logs.filter((t) => t.compoundId === e.id && "taken" === t.status).length;
      n.appendChild(
        Bt(
          `<tr>\n        <td class="libname"><div class="libnm"><span class="chipsq" style="background:${e.color}"></span><span>${q(e.name)}</span></div></td>\n        <td>${k(e.name)}</td>\n        <td>${S(e.name)}</td>\n        ${L(e.name)}\n        <td class="num">${HL(e) ? Ht(fe(HL(e), 1)) + " h" : "—"}</td>\n        <td>${Ht(xe(e))}</td>\n        <td>${Ht(e.route || "—")}</td>\n        <td class="num">${Ht($e(wt(e.id), e))}</td>\n        <td class="num">${t}</td>\n        <td class="tiny">${Ht(e.notes || "")}</td>\n        <td class="num"><button class="btn ghost sm" data-editcomp="${e.id}">Edit</button></td></tr>`,
        ),
      );
    }
    e.appendChild(t);
  }
  const t = Bt(
      '<div class="panel"><h2>Reference half-lives</h2><div style="overflow:auto"><table class="libtbl"><thead><tr>\n    <th>Compound</th><th>Dose</th><th>JIBH</th><th>Schedule</th><th class="num">Reported half-life</th><th>Units</th><th>Usual route</th><th></th></tr></thead><tbody id="rb"></tbody></table></div></div>',
    ),
    n = t.querySelector("#rb");
  for (const [e, t, a, s] of u) {
    const o = Te(e);
    n.appendChild(
      Bt(
        `<tr><td class="libname">${q(e)}</td><td>${k(e)}</td><td>${S(e)}</td>${L(e)}<td class="num">${t ? Ht(fe(t, 1)) + " h" : "—"}</td><td>${"iu" === s ? "IU" : "mg"}</td><td>${Ht(a)}</td>\n      <td class="num">${o ? '<span class="pill done">in yours</span>' : `<button class="btn ghost sm" data-addlib="${Ht(e)}">Add</button>`}</td></tr>`,
      ),
    );
  }
  return (e.appendChild(t), e);
}
function $a(e) {
  const t = e
    ? Object.assign({}, Ce(e))
    : { id: ve(), name: "", halfLife: "", route: "SubQ", color: c[d.compounds.length % c.length], notes: "" };
  Vt(
    e ? "Edit compound" : "Add a compound",
    `\n    <datalist id="lib3">${u.map((e) => `<option value="${Ht(e[0])}">`).join("")}</datalist>\n    <div class="field"><label for="c-n">Name</label><input id="c-n" list="lib3" value="${Ht(t.name)}"></div>\n    <div class="fgrid3">\n      <div class="field"><label for="c-h">Half-life (hours)</label><input id="c-h" type="number" step="any" min="0" value="${Ht(t.halfLife)}">\n        <span class="hint">Leave blank to skip the decay curve.</span></div>\n      <div class="field"><label for="c-base">Measured in</label><select id="c-base">\n        <option value="mg"${"iu" !== t.base ? " selected" : ""}>mg / mcg</option>\n        <option value="iu"${"iu" === t.base ? " selected" : ""}>IU</option></select>\n        <span class="hint">IU compounds stay in IU everywhere — nothing is converted.</span></div>\n      <div class="field"><label for="c-r">Usual route</label><select id="c-r">\n        ${["SubQ", "IM", "Oral", "Nasal", "Topical"].map((e) => `<option${t.route === e ? " selected" : ""}>${e}</option>`).join("")}</select></div>\n      <div class="field"><label for="c-col">Colour</label><select id="c-col">\n        ${c.map((e) => `<option value="${e}"${t.color === e ? " selected" : ""}>${e}</option>`).join("")}</select></div></div>\n    <div class="field"><label for="c-notes">Notes</label><textarea id="c-notes">${Ht(t.notes)}</textarea></div>`,
    (e ? '<button class="btn danger" id="c-del">Delete</button>' : "") +
      '\n     <button class="btn ghost" data-close>Cancel</button><button class="btn" id="c-save">Save</button>',
  );
  const n = Ot("#modal");
  (Qt(n.querySelector("#c-n"), Ut),
    n.querySelector("#c-n").addEventListener("change", (e) => {
      const t = u.find((t) => t[0].toLowerCase() === e.target.value.trim().toLowerCase());
      t && t[1] && !n.querySelector("#c-h").value && (n.querySelector("#c-h").value = t[1]);
    }),
    n.querySelector("#c-save").addEventListener("click", () => {
      if (((t.name = n.querySelector("#c-n").value.trim()), !t.name)) return void Ft("Give it a name.");
      ((t.halfLife = n.querySelector("#c-h").value),
        (t.route = n.querySelector("#c-r").value),
        (t.base = n.querySelector("#c-base").value),
        (t.color = n.querySelector("#c-col").value),
        (t.notes = n.querySelector("#c-notes").value));
      const e = d.compounds.findIndex((e) => e.id === t.id);
      (e >= 0 ? (d.compounds[e] = t) : d.compounds.push(t), s(), Rt(), Ua(), Ft("Saved."));
    }));
  const a = n.querySelector("#c-del");
  a &&
    a.addEventListener("click", () => {
      confirm("Delete this compound? Its protocols, stock and logs go too.") &&
        ((d.compounds = d.compounds.filter((e) => e.id !== t.id)),
        (d.protocols = d.protocols.filter((e) => e.compoundId !== t.id)),
        (d.batches = d.batches.filter((e) => e.compoundId !== t.id)),
        (d.logs = d.logs.filter((e) => e.compoundId !== t.id)),
        s(),
        Rt(),
        Ua(),
        Ft("Deleted."));
    });
}
(document.addEventListener("visibilitychange", () => {
  "visible" === document.visibilityState && (ya() ? fa(!0) : ((Ma = 0), xa()));
}),
  window.addEventListener("online", () => {
    ya() || ((Ma = 0), xa());
  }));
const Ia = [
  ["weight", "Weight", "lb"],
  ["bf", "Body fat", "%"],
  ["sbp", "Systolic BP", "mmHg"],
  ["dbp", "Diastolic BP", "mmHg"],
  ["hr", "Resting pulse", "bpm"],
  ["glucose", "Fasting glucose (home meter)", "mmol/L"],
  ["waist", "Waist", "in"],
];
function Ca() {
  const e = Bt('<div class="stack"></div>');
  e.appendChild(
    Bt(
      '<div class="head"><div><h1>Weight</h1>\n    <p>Readings sit alongside the protocol, so a change is easy to line up against what you started or stopped.</p></div>\n    <button class="btn" data-newmetric="1">Add a reading</button></div>',
    ),
  );
  const t = d.metrics.slice().sort((e, t) => (e.date < t.date ? 1 : -1));
  if (!t.length)
    return (
      e.appendChild(
        Bt(
          '<div class="panel"><div class="empty"><b>Nothing logged yet</b>Weight, blood pressure, pulse, fasting glucose — whatever you actually measure.</div></div>',
        ),
      ),
      e
    );
  const n = Bt('<div class="grid3"></div>');
  for (const [e, a, s] of Ia) {
    const o = t
      .slice()
      .reverse()
      .filter((t) => "" !== t[e] && null != t[e])
      .map((t) => be(t[e]));
    if (o.length < 2) continue;
    const i = o[o.length - 1],
      l = i - o[0];
    n.appendChild(
      Bt(
        `<div class="panel"><h2>${a}<span class="mono tiny">${fe(i, 1)} ${s}${l ? ` (${l > 0 ? "+" : ""}${fe(l, 1)})` : ""}</span></h2>\n      <div style="padding:10px 12px">${Gt(o, s, 100)}</div></div>`,
      ),
    );
  }
  n.children.length && e.appendChild(n);
  const a = Bt(
      `<div class="panel" style="overflow:auto"><table><thead><tr><th>Date</th>\n    ${Ia.map(([, e, t]) => `<th class="num">${e}<div class="tiny muted">${t}</div></th>`).join("")}<th>Notes</th><th></th></tr></thead>\n    <tbody id="tb"></tbody></table></div>`,
    ),
    s = a.querySelector("#tb");
  for (const e of t)
    s.appendChild(
      Bt(
        `<tr><td>${Ht(de(e.date))}</td>\n    ${Ia.map(([t]) => `<td class="num">${"" !== e[t] && null != e[t] ? Ht(e[t]) : "—"}</td>`).join("")}\n    <td class="tiny">${Ht(e.notes || "")}</td>\n    <td class="num"><button class="btn ghost sm" data-editmetric="${e.id}">Edit</button></td></tr>`,
      ),
    );
  return (e.appendChild(a), e);
}
function La(e) {
  const t = e
    ? Object.assign(
        {},
        d.metrics.find((t) => t.id === e),
      )
    : Object.assign({ id: ve(), date: te(), notes: "" }, ...Ia.map(([e]) => ({ [e]: "" })));
  Vt(
    e ? "Edit reading" : "Add a reading",
    `\n    <div class="field"><label for="m-date">Date</label><input id="m-date" type="date" value="${Ht(t.date)}"></div>\n    <div class="fgrid3">${Ia.map(([e, n, a]) => `<div class="field"><label for="m-${e}">${n} <span class="muted">(${a})</span></label>\n      <input id="m-${e}" type="number" step="any" value="${Ht(t[e])}"></div>`).join("")}</div>\n    <div class="field"><label for="m-n">Notes</label><textarea id="m-n">${Ht(t.notes)}</textarea></div>`,
    (e ? '<button class="btn danger" id="m-del">Delete</button>' : "") +
      '\n     <button class="btn ghost" data-close>Cancel</button><button class="btn" id="m-save">Save reading</button>',
  );
  const n = Ot("#modal");
  n.querySelector("#m-save").addEventListener("click", () => {
    ((t.date = n.querySelector("#m-date").value || te()),
      Ia.forEach(([e]) => (t[e] = n.querySelector("#m-" + e).value)),
      (t.notes = n.querySelector("#m-n").value));
    const e = d.metrics.findIndex((e) => e.id === t.id);
    (e >= 0 ? (d.metrics[e] = t) : d.metrics.push(t), s(), Rt(), Ua(), Ft("Reading saved."));
  });
  const a = n.querySelector("#m-del");
  a &&
    a.addEventListener("click", () => {
      ((d.metrics = d.metrics.filter((e) => e.id !== t.id)), s(), Rt(), Ua());
    });
}
function qa() {
  const e = Bt('<div class="stack"></div>'),
    n = d.settings;
  (e.appendChild(
    Bt(
      `<div class="head"><div><h1>Settings</h1>\n    <p>Saved on this device${"app" === t.kind ? " through Claude" : ""}. Export a backup before you switch device or clear your browser.</p></div></div>`,
    ),
  ),
    e.appendChild(
      Bt(
        `<div class="panel"><h2>Version</h2><div class="pbody">\n    <div class="big-read" style="font-size:22px">${Ht(o)}</div>\n    <p class="tiny muted" style="margin:6px 0 0">Latest change: ${Ht(i)}.</p>\n    <p class="tiny muted" style="margin:6px 0 0">Compare this against the build number I give you when I hand over a file.\n      If it is older after deploying, the page came from cache — close the app fully and reopen it, or press Ctrl+Shift+R on the PC.</p>\n    <p class="tiny muted" style="margin:10px 0 0">&copy; 2026 Korah Peptides. All rights reserved. This app, its code and its compiled reference tables are protected by copyright. Copying, republishing or reselling them without written permission is not allowed.</p>\n  </div></div>`,
      ),
    ));
  const a = Bt(
    `<div class="panel"><h2>Weight tracking</h2><div class="pbody">\n    <p class="tiny muted" style="margin:0 0 10px">Off by default. Turning it on adds a Weight page and a place to log blood pressure, pulse and fasting glucose alongside it.</p>\n    <label class="check" style="margin:0"><input type="checkbox" id="s-wt" ${n.trackWeight ? "checked" : ""}><span>Track my weight</span></label></div></div>`,
  );
  (a.querySelector("#s-wt").addEventListener("change", (e) => {
    ((n.trackWeight = e.target.checked), s(), Ua());
  }),
    e.appendChild(a));
  const r = Bt('<div class="grid2"></div>'),
    c = Bt(
      `<div class="panel"><h2>Appearance and units</h2><div class="pbody">\n    <div class="field"><label>Theme</label><div class="seg" id="s-theme">\n      ${[
        ["system", "Match system"],
        ["light", "Light"],
        ["dark", "Dark"],
      ]
        .map(([e, t]) => `<button data-t="${e}" aria-pressed="${n.theme === e}">${t}</button>`)
        .join(
          "",
        )}</div></div>\n    <div class="field"><label>Clock</label><div class="seg" id="s-clock">\n      ${[
        ["12", "12-hour"],
        ["24", "24-hour"],
      ]
        .map(([e, t]) => `<button data-c="${e}" aria-pressed="${n.clock === e}">${t}</button>`)
        .join(
          "",
        )}</div>\n      <span class="hint">Times read as ${re(new Date())} right now.</span></div>\n    <div class="field"><label for="s-barrel">Syringe you normally use</label><select id="s-barrel">\n      <option value="100"${100 == n.barrel ? " selected" : ""}>1 mL (100 units)</option>\n      <option value="50"${50 == n.barrel ? " selected" : ""}>0.5 mL (50 units)</option>\n      <option value="30"${30 == n.barrel ? " selected" : ""}>0.3 mL (30 units)</option></select></div>\n    <div class="field"><label for="s-name">Name on the Today page</label><input id="s-name" value="${Ht(n.name)}" placeholder="Optional"></div>\n  </div></div>`,
    );
  (c.querySelectorAll("#s-theme button").forEach((e) =>
    e.addEventListener("click", () => {
      ((n.theme = e.dataset.t), s(), Ba(), Ua());
    }),
  ),
    c.querySelectorAll("#s-clock button").forEach((e) =>
      e.addEventListener("click", () => {
        ((n.clock = e.dataset.c), s(), Ua());
      }),
    ),
    c.querySelector("#s-barrel").addEventListener("change", (e) => {
      ((n.barrel = +e.target.value), s());
    }),
    c.querySelector("#s-name").addEventListener("input", (e) => {
      ((n.name = e.target.value), s());
    }));
  const u = Bt(
    `<div class="panel"><h2>Supply you keep on hand</h2><div class="pbody">\n    <p class="tiny muted" style="margin:0 0 10px">The stock bar is full at this level and starts falling below it. Set it to what you actually like to have in the cupboard.</p>\n    <div class="field"><label for="s-td">Days</label><input id="s-td" type="number" min="7" max="730" step="1" value="${Ht(n.targetDays)}">\n      <span class="hint">${fe(be(n.targetDays) / 30.44, 1)} months. Between 7 and 730 days.</span></div></div></div>`,
  );
  (u.querySelector("#s-td").addEventListener("change", (e) => {
    ((n.targetDays = Math.max(7, Math.min(730, be(e.target.value) || 90))), s(), Ua(), Ft("Target saved."));
  }),
    r.appendChild(c),
    r.appendChild(u),
    e.appendChild(r));
  const p = Bt(
    '<div class="panel"><h2>Backup</h2><div class="pbody">\n    <p class="tiny muted" style="margin:0 0 12px">Export writes one file holding every compound, protocol, batch, shot and reading. Import reads one back and replaces what is here now.</p>\n    <div class="row"><button class="btn" id="d-exp">Export a backup</button>\n      <button class="btn ghost" id="d-csv">Export shots as CSV</button>\n      <button class="btn ghost" id="d-imp">Import a backup</button>\n      <input type="file" id="d-file" accept="application/json" hidden>\n      <button class="btn ghost" id="d-sites">Clear injection sites</button>\n      <button class="btn danger" id="d-wipe">Erase everything</button></div></div></div>',
  );
  return (
    p.querySelector("#d-exp").addEventListener("click", () => {
      (Ea(
        `protocol-backup-${te()}.json`,
        new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }),
      ),
        Ft("Backup downloaded."));
    }),
    p.querySelector("#d-csv").addEventListener("click", Ta),
    p.querySelector("#d-sites").addEventListener("click", () => {
      const e = d.logs.filter((e) => e.site);
      e.length
        ? confirm(
            `Remove the injection site from ${e.length} logged shot${1 === e.length ? "" : "s"}? The shots themselves stay. Every site goes back to rested.`,
          ) &&
          (e.forEach((e) => {
            e.site = "";
          }),
          s(),
          Ua(),
          Ft("Injection sites cleared."))
        : Ft("No logged shots have a site on them.");
    }),
    p.querySelector("#d-imp").addEventListener("click", () => p.querySelector("#d-file").click()),
    p.querySelector("#d-file").addEventListener("change", Pa),
    p.querySelector("#d-wipe").addEventListener("click", () => {
      confirm("Erase everything? Export first if you want a copy. This cannot be undone.") &&
        ((d = l()), s(), Ua(), Ft("Everything erased."));
    }),
    e.appendChild(p),
    jn && e.appendChild(Sa()),
    e.appendChild(
      Bt(
        `<p class="tiny muted" style="margin:0">Storage in use: ${"app" === t.kind ? "Claude’s artifact storage" : "browser" === t.kind ? "this browser on this device" : "memory only — nothing will survive a reload, so export before you close"}.</p>`,
      ),
    ),
    e
  );
}
function Da() {
  const e = Bt('<div class="stack howto-wrap"></div>');
  return (
    e.appendChild(
      Bt(
        `<div class="head"><div><h1>Instructions</h1>\n    <p>${Wn ? "Using more than one device? Start with the sync box below. Then set the app up in this order: add your stock first, then set up your protocols." : "Set the app up in this order: add your stock first, then set up your protocols."}</p></div></div>`,
      ),
    ),
    Wn &&
      e.appendChild(
        Bt(
          '<div class="panel howto"><h2><span class="hdrwrap"><span class="pill">Optional</span>Sync your phone and computer</span>\n      <button class="btn sm" data-go="settings">Go to Settings</button></h2><div class="pbody">\n    <p class="muted">Sync keeps your phone and your computer showing the same log. It is free. You need an email address, a password, and a passphrase that scrambles your log before it leaves your device, so nobody else can read it.</p>\n    <p><b>1. On the device that already has your data (do this one first)</b></p>\n    <ol>\n      <li>Tap <b>Settings</b> and scroll down to <b>Sync between devices</b>.</li>\n      <li>Tick <b>Turn sync on</b>. More boxes appear underneath.</li>\n      <li>Type your <b>Email</b> and choose a <b>Password</b> (6 characters or more). Leave <b>Stay signed in on this device</b> ticked unless this is a shared or borrowed device.</li>\n      <li>Choose a <b>Passphrase</b> (8 characters or more) and type it again under <b>Repeat passphrase</b>. <b>Write it down somewhere safe.</b> Nobody can recover it for you.</li>\n      <li>Tap <b>Create account</b>. When the tag at the top of the panel says <b>Signed in as</b> and your email, you are set up.</li>\n    </ol>\n    <p><b>2. On your other device (phone or computer)</b></p>\n    <ol>\n      <li>Open this same site address. On a phone, first add it to your home screen so it opens like an app. <b>iPhone:</b> open it in Safari, tap the Share button, then <b>Add to Home Screen</b>. <b>Android:</b> in Chrome tap the menu (three dots), then <b>Install app</b> or <b>Add to Home screen</b>. Then open it from the new icon on your home screen.</li>\n      <li>Tap <b>Settings</b>, scroll to <b>Sync between devices</b> and tick <b>Turn sync on</b>.</li>\n      <li>Type the same email, the same password and the same passphrase.</li>\n      <li>Tap <b>Sign in</b>. Do not tap Create account. Your compounds, stock, protocols and shots appear within a few seconds.</li>\n    </ol>\n    <div class="note warn"><span>⚠</span><span><b>iPhone:</b> Safari and the home-screen app keep separate data. If you have been logging in Safari, set up sync there first (step 1), then sign in from the home-screen app (step 2). If you are starting fresh, do everything inside the home-screen app.</span></div>\n    <p><b>After that</b></p>\n    <ul>\n      <li>Changes sync on their own a few seconds after you save them, and again whenever you reopen the app. Tap <b>Sync now</b> in the same panel to do it straight away.</li>\n      <li>Log on either device. If both changed the same thing, the newer edit wins.</li>\n      <li>If you had already entered things on the second device before signing in, both sets are combined and you may see doubles. Delete the extras.</li>\n      <li>Sync is not a backup. A deletion syncs too, so keep using <b>Export a backup</b> now and then.</li>\n    </ul>\n    <p><b>If something goes wrong</b></p>\n    <ul>\n      <li><b>&ldquo;That passphrase does not open this log&rdquo;:</b> the passphrase must match exactly on every device, capital letters included.</li>\n      <li><b>Forgot your password:</b> type your email and tap <b>Forgot password</b>. A reset link arrives by email. Check your spam or junk folder if you do not see it. It does not change your passphrase.</li>\n      <li><b>Lost your passphrase:</b> on a device that still has your data, type a new passphrase in the <b>Passphrase</b> box, then tap <b>Replace the cloud copy with this device</b> at the bottom of the sync panel. The old synced copy is deleted for good. Then use the new passphrase on your other devices.</li>\n      <li><b>Shared or borrowed device:</b> untick <b>Stay signed in on this device</b>, and tap <b>Sign out</b> when you are done. Sign out also forgets the passphrase on that device.</li>\n    </ul>\n  </div></div>',
        ),
      ),
    e.appendChild(
      Bt(
        '<div class="panel howto"><h2><span class="hdrwrap"><span class="pill">Step 1</span>Add your stock</span>\n      <button class="btn sm" data-go="stock">Go to Stock</button></h2><div class="pbody">\n    <ol>\n      <li>Tap <b>Stock</b>, then <b>Add stock</b>.</li>\n      <li><b>Compound</b>: type the name or pick it from the list. Anything not on the list is added as your own.</li>\n      <li><b>Strength per vial</b>: the amount printed on the vial label, before it is mixed. Choose IU instead of mg for anything labelled in IU.</li>\n      <li><b>Sealed vials</b>: how many vials you have in this batch, counting any you have already opened.</li>\n      <li>Already have a mixed vial in use? Tick <b>I have a vial already open</b>. One vial moves from Sealed to the open vial. Then fill in how much is left in it, the water you mixed it with (mL) and the date you mixed it.</li>\n      <li>Another strength of the same compound? Tap <b>+ Add another strength</b>.</li>\n      <li>Source, lot, use-by date and a CoA link are optional, under <b>Batch details</b>.</li>\n      <li>Tap <b>Add to stock</b>. Repeat for each compound.</li>\n    </ol>\n    <p class="tiny muted">Optional: on the same page, <b>Add solution</b> under Solutions tracks your bacteriostatic water, so it counts down as you mix vials.</p>\n  </div></div>',
      ),
    ),
    e.appendChild(
      Bt(
        '<div class="panel howto"><h2><span class="hdrwrap"><span class="pill">Step 2</span>Set up your protocols</span>\n      <button class="btn sm" data-go="protocols">Go to Protocols</button></h2><div class="pbody">\n    <p class="muted">A protocol is one compound, one dose and one schedule.</p>\n    <ol>\n      <li>Tap <b>Protocols</b>, then <b>New protocol</b>.</li>\n      <li><b>Compound</b>: pick one you added to stock in Step 1.</li>\n      <li><b>Dose</b>: the amount per shot and its unit (mcg, mg or IU). Choose the route (SubQ, IM and so on). Time of day is optional and puts your list on Today in order.</li>\n      <li><b>Vial mix</b>: enter the bacteriostatic water in the vial (mL). The line underneath shows how many units to draw on the syringe for your dose. This box stays greyed out until the compound is in stock.</li>\n      <li><b>Schedule</b>: choose how often (every day, certain days, every N days, or days on and off), the start date, and the length in weeks if it has an end.</li>\n      <li>The switches for Blend (several peptides in one vial), Phases (change the dose or schedule partway through, for example daily for 5 weeks then Mon, Wed and Fri) and On/off cycling are optional.</li>\n      <li>Tap <b>Add protocol</b>. Repeat for each compound.</li>\n    </ol>\n  </div></div>',
      ),
    ),
    e.appendChild(
      Bt(
        '<div class="panel howto"><h2>Why stock comes first</h2><div class="pbody">\n    <p>The draw (how many units to pull on the syringe) is worked out from the vial strength and the water in it, and the stock countdown needs vials to count. A protocol with no vial in stock shows no draw until you add one.</p>\n    <p>Once both steps are done, Today lists what is due. Tap <b>Log</b> when you take a shot and the dose comes off your open vial.</p>\n  </div></div>',
      ),
    ),
    e.appendChild(
      Bt(
        '<div class="panel howto"><h2><span class="hdrwrap"><span class="pill">Optional</span>Your bloodwork</span>\n      <button class="btn sm" data-labhelp="1">Show me how</button></h2><div class="pbody">\n    <p>The <b>Labs</b> page keeps every blood test in one place, flags results outside the lab\u2019s range and charts each test over time, with your start and stop dates from the shot log marked on it.</p>\n    <p>You don\u2019t have to type it all in. An AI chat app such as Claude, ChatGPT or Gemini can read your lab reports and give you text to paste into the Labs page. <b>Show me how</b> walks you through it.</p>\n  </div></div>',
      ),
    ),
    e.appendChild(
      Bt(
        `<div class="panel howto"><h2><span class="hdrwrap">Back up your data</span>\n      <button class="btn sm" data-go="settings">Go to Settings</button></h2><div class="pbody">\n    <p class="muted">Your data is saved on this device${jn ? ", and copied to your sync account if you turn sync on" : " only"}. A backup is one file you can keep elsewhere and load back in.</p>\n    <ol>\n      <li>Tap <b>Settings</b> and scroll down to the <b>Backup</b> panel.</li>\n      <li>Tap <b>Export a backup</b>. Your browser downloads one file named <span class="mono">protocol-backup-</span> followed by today&rsquo;s date, ending in <span class="mono">.json</span>. It holds every compound, protocol, batch, shot and reading, plus your settings.</li>\n      <li>Find the file where your browser saves downloads (usually the Downloads folder) and copy it somewhere that is not this device, such as a cloud drive, or email it to yourself.</li>\n    </ol>\n    <p><b>Do this before</b> you switch device, clear your browser data, or tap Erase everything.</p>\n    <p><b>To restore:</b> open Settings, tap <b>Import a backup</b> and pick the <span class="mono">.json</span> file. It replaces everything currently in the app, so only do it when you want what is in the file to win.</p>\n    <p class="tiny muted"><b>Export shots as CSV</b>, in the same panel, makes a shot list for a spreadsheet. It is not a backup and cannot be imported back.</p>\n  </div></div>`,
      ),
    ),
    e
  );
}
function Ea(e, t) {
  const n = document.createElement("a");
  ((n.href = URL.createObjectURL(t)),
    (n.download = e),
    document.body.appendChild(n),
    n.click(),
    n.remove(),
    setTimeout(() => URL.revokeObjectURL(n.href), 2e3));
}
function Ta() {
  const e = [
    [
      "datetime",
      "dose_slot",
      "compound",
      "dose_mg",
      "units",
      "purge_units",
      "site",
      "vial_mg",
      "water_ml",
      "lot",
      "status",
      "notes",
    ],
  ];
  for (const t of d.logs.slice().sort((e, t) => ((e.at || e.date) < (t.at || t.date) ? -1 : 1))) {
    const n = Ce(t.compoundId),
      a = qe(t.batchId);
    e.push([
      t.at || t.date,
      SLN(t.slot),
      n ? n.name : "",
      t.doseMg,
      t.units,
      t.purgeUnits || 0,
      t.site ? Z(t) : "",
      t.vialMg || (a ? a.vialMg : ""),
      t.bacMl || "",
      a ? a.lot : "",
      t.status,
      (t.notes || "").replace(/"/g, '""'),
    ]);
  }
  (Ea(
    `shot-log-${te()}.csv`,
    new Blob([e.map((e) => e.map((e) => `"${null == e ? "" : e}"`).join(",")).join("\n")], {
      type: "text/csv",
    }),
  ),
    Ft("CSV downloaded."));
}
function Pa(e) {
  const t = e.target.files[0];
  if (!t) return;
  const n = new FileReader();
  ((n.onload = () => {
    try {
      const e = JSON.parse(n.result);
      if (!e || !Array.isArray(e.compounds)) throw 0;
      ((d = Object.assign(l(), e)),
        (d.settings = Object.assign(l().settings, e.settings || {})),
        na(),
        s(),
        Ba(),
        Ua(),
        Ft("Backup restored."));
    } catch (e) {
      Ft("That file is not a backup from this app.");
    }
  }),
    n.readAsText(t),
    (e.target.value = ""));
}
function Oa(e, t, n, sl) {
  const a = Le(e);
  if (!a) return;
  sl = a.split ? sl || "am" : "";
  const o = st(e, t, sl);
  o && mn(o.id, !0);
  const i = Ue(a, t),
    l = new Date(t + "T" + (SLT(a, sl) || ("pm" === sl ? "20:00" : "am" === sl ? "08:00" : "12:00")));
  d.logs.push({
    id: ve(),
    protocolId: e,
    compoundId: a.compoundId,
    date: t,
    at: l.toISOString(),
    status: n,
    doseMg: "taken" === n ? ye(i.doseMg, 6) : 0,
    units: "taken" === n ? ye(i.units, 2) : 0,
    volMl: ye(i.volMl, 4),
    purgeUnits: 0,
    purgeMg: 0,
    batchId: "taken" === n && i.batch ? i.batch.id : "",
    site: "",
    notes: "",
    ...(sl ? { slot: sl } : {}),
  });
  const r = d.logs[d.logs.length - 1];
  let c = null;
  return (
    r.batchId && (vn(r), (c = It(r.batchId, r.doseMg)), c && (r.opened = c)),
    s(),
    yn(a, r, n) || (c ? bn(r) : "")
  );
}
function Ba() {
  const e = d.settings.theme,
    t =
      "dark" === e ||
      ("system" === e && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", t ? "dark" : "light");
}
(document.addEventListener("click", (e) => {
  const t = e.target.closest(
    "[data-close],[data-go],[data-logp],[data-missp],[data-undop],[data-logfor],[data-newproto],[data-editproto],[data-pauseproto],[data-newbatch],[data-editbatch],[data-newsol],[data-editsol],[data-newsup],[data-editsup],[data-calday],[data-mark],[data-clear],[data-newcomp],[data-editcomp],[data-addlib],[data-newmetric],[data-editmetric]",
  );
  if (!t) return;
  const n = t.dataset;
  if (n.hasOwnProperty("close")) Rt();
  else if ((e.preventDefault(), n.go)) ((r.tab = n.go), "log" === n.go && (r.logDraft = null), Ua());
  else if (n.logp) {
    const e = gn(n.logp, "taken", n.slot);
    (Ua(), Ft(e || "Logged."));
  } else if (n.missp) (gn(n.missp, "missed", n.slot), Ua(), Ft("Marked as missed."));
  else if (n.undop) {
    const e = st(n.undop, te(), n.slot);
    (e && mn(e.id), Ua(), Ft("Cleared."));
  } else if (n.logfor) ((r.logDraft = un(n.logfor, n.slot)), (r.tab = "log"), Ua());
  else if (n.hasOwnProperty("newproto")) Mn();
  else if (n.editproto) Mn(n.editproto);
  else if (n.pauseproto) {
    const e = Le(n.pauseproto);
    e &&
      ((e.active = !e.active),
      s(),
      Ua(),
      Ft(
        e.active
          ? `${pt(e.compoundId)} resumed.`
          : `${pt(e.compoundId)} paused. It is off Today until you resume it.`,
      ));
  } else if (n.hasOwnProperty("newbatch")) An();
  else if (n.editbatch) An(n.editbatch);
  else if (n.hasOwnProperty("newsol")) In();
  else if (n.editsol) In(n.editsol);
  else if (n.hasOwnProperty("newsup")) Cn();
  else if (n.editsup) Cn(n.editsup);
  else if (n.calday) ((r.calDay = n.calday), Ua());
  else if (n.mark) {
    const e = Oa(n.p, n.d, n.mark, n.slot);
    (Ua(), e && Ft(e));
  } else
    n.clear
      ? (mn(n.clear), Ua())
      : n.hasOwnProperty("newcomp")
        ? $a()
        : n.editcomp
          ? $a(n.editcomp)
          : n.addlib
            ? (Pe(n.addlib), s(), Ua(), Ft(`${n.addlib} added.`))
            : n.hasOwnProperty("newmetric")
              ? La()
              : n.editmetric && La(n.editmetric);
}),
  window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      "system" === d.settings.theme && (Ba(), Ua());
    }));
const Ha = {
  instructions: Da,
  today: rn,
  log: pn,
  protocols: kn,
  stock: xn,
  history: Ln,
  labels: Bn,
  tools: Nn,
  library: Aa,
  weight: Ca,
  labs: labView,
  insights: insView,
  settings: qa,
};
function Ua(k) {
  const y0 = window.scrollY;
  if (k) {
    const a0 = document.activeElement;
    if (a0 && /^(INPUT|SELECT|TEXTAREA)$/.test(a0.tagName) && Ot("#view").contains(a0)) return;
  }
  ("weight" !== r.tab || d.settings.trackWeight || (r.tab = "today"), dn());
  const e = Ot("#view");
  ((e.innerHTML = ""), e.appendChild((Ha[r.tab] || rn)()), window.scrollTo({ top: k ? y0 : 0 }));
}
!(async function () {
  try {
    const e = await t.get();
    if (e) {
      const t = JSON.parse(e);
      ((d = Object.assign(l(), t)), (d.settings = Object.assign(l().settings, t.settings || {})));
    }
  } catch (e) {}
  const e = j();
  (na(),
    Ba(),
    Ua(),
    e && s(),
    xa(),
    "memory" === t.kind && Ft("This copy cannot save. Export a backup before you close it."));
})();
