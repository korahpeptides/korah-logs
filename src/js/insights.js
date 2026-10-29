/* Korah Logs — Insights tab: AI-written protocol and lab reviews, sent through the owner's own Cloudflare Worker. */
var INS_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M11 3.5l1.9 4.9 4.9 1.9-4.9 1.9L11 17.1l-1.9-4.9L4.2 10.3l4.9-1.9z"/><path d="M18.3 14.6l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>';
var INS_RATING = {
  excellent: ["Excellent", "done"],
  good: ["Good", "done"],
  fair: ["Fair", "due"],
  needs_work: ["Needs work", "due"],
  low: ["Low", "late"],
  watch: ["Watch", "due"],
  needs_attention: ["Needs attention", "late"],
};
var INS_STAGE = {
  early: "Early",
  building: "Building",
  established: "Established",
  maintenance: "Maintenance",
  resting: "Resting",
};
var INS_STATUS = {
  high: ["High", "late"],
  low: ["Low", "late"],
  off_target: ["Off target", "due"],
  borderline: ["Borderline", "due"],
  in_range: ["In range", "done"],
  improved: ["Improved", "done"],
};

var INS_MODELS = [
  ["claude-haiku-5-5", "Haiku: cheaper and faster (recommended)"],
  ["claude-sonnet-5-5", "Sonnet: more thorough, costs more"],
];
function insCfg() {
  d.settings.ai = d.settings.ai || { url: "", key: "", context: "" };
  return d.settings.ai;
}
function insModel() {
  var m = insCfg().model;
  return INS_MODELS.some(function (x) {
    return x[0] === m;
  })
    ? m
    : INS_MODELS[0][0];
}
function insReady() {
  var c = insCfg();
  return !!(String(c.url || "").trim() && String(c.key || "").trim());
}
function insList(kind) {
  return (d.insights || [])
    .filter(function (x) {
      return x && x.kind === kind;
    })
    .sort(function (a, b) {
      return a.end < b.end ? 1 : a.end > b.end ? -1 : (b.created || 0) - (a.created || 0);
    });
}
function insUnit(u) {
  return u === "iu" ? "IU" : u;
}
function insLogDate(l) {
  return l.date || String(l.at || "").slice(0, 10);
}
function insDow(dt) {
  return me[ee(dt).getDay()] + " " + dt;
}

/* First day of the run the compound is on now: shots with gaps of 21 days or less count as one run. */
function insRunStart(cid, end) {
  var ds = Array.from(
    new Set(
      (d.logs || [])
        .filter(function (l) {
          return l.compoundId === cid && l.status === "taken";
        })
        .map(insLogDate)
        .filter(function (x) {
          return x && x <= end;
        }),
    ),
  ).sort();
  if (!ds.length) return null;
  var i = ds.length - 1;
  if (ae(ds[i], end) > 21) return null;
  while (i > 0 && ae(ds[i - 1], ds[i]) <= 21) i--;
  return ds[i];
}

/* Everything the app can count by itself. The AI is told to use these numbers as they are. */
function insStats(start, end) {
  var today = te(),
    days = [];
  for (var x = start; x <= end; x = ne(x, 1)) days.push(x);
  var inPer = function (l) {
    var dt = insLogDate(l);
    return dt >= start && dt <= end;
  };
  var protos = gt(
    (d.protocols || []).filter(function (p) {
      return (
        p.active ||
        (d.logs || []).some(function (l) {
          return l.protocolId === p.id && inPer(l);
        })
      );
    }),
  );
  var rows = [],
    tot = { sched: 0, taken: 0 },
    seen = {};
  protos.forEach(function (p) {
    var c = Ce(p.compoundId);
    if (!c) return;
    var sched = 0,
      taken = 0,
      missed = [];
    days.forEach(function (dy) {
      if (!Ye(p, dy)) return;
      SL(p).forEach(function (sl) {
        var g = st(p.id, dy, sl),
          ok = g && g.status === "taken";
        if (dy === today && !g) return; // still to come today
        sched++;
        if (ok) taken++;
        else missed.push(insDow(dy) + (sl ? " " + sl.toUpperCase() : ""));
      });
    });
    var extra = (d.logs || []).filter(function (l) {
      return l.protocolId === p.id && l.status === "taken" && inPer(l) && !Ye(p, insLogDate(l));
    }).length;
    var g = Ge(p, end),
      run = insRunStart(c.id, end),
      from = run || p.startDate || null;
    var name = c.name;
    if (seen[name.toLowerCase()]) name = c.name + " (" + fe(be(g.dose), 3) + " " + insUnit(g.unit) + ")";
    seen[name.toLowerCase()] = 1;
    tot.sched += sched;
    tot.taken += taken;
    rows.push({
      pid: p.id,
      cid: c.id,
      name: name,
      route: p.route || c.route || "SubQ",
      active: !!p.active,
      dose: fe(be(g.dose), 3) + " " + insUnit(g.unit) + (p.split ? " per shot, AM + PM" : ""),
      schedule: _e(p),
      phase: g.of ? "phase " + g.phase + " of " + g.of + (g.holding ? ", held" : "") : "",
      blend: Sn(p, g.dose, g.unit) || "",
      resting: !!(p.cycling && !Re(p, end).on),
      runStart: from,
      week: from && from <= end ? Math.floor(ae(from, end) / 7) + 1 : null,
      sched: sched,
      taken: taken,
      extra: extra,
      pct: sched ? Math.round((taken / sched) * 100) : null,
      missed: missed,
      notes: p.notes || "",
    });
  });
  return {
    start: start,
    end: end,
    days: days.length,
    rows: rows,
    sched: tot.sched,
    taken: tot.taken,
    pct: tot.sched ? Math.round((tot.taken / tot.sched) * 100) : null,
    inPer: inPer,
  };
}

/* Latest result of each lab test up to a date. */
function insLabSnap(end, flaggedOnly) {
  var out = [];
  labTests().forEach(function (t) {
    var s = labSeries(t.id).filter(function (x) {
      return x.draw.date <= end;
    });
    if (!s.length) return;
    var last = s[s.length - 1],
      stt = labStatus(t, last.raw);
    if (flaggedOnly && !(stt === "hi" || stt === "lo" || stt === "tgt")) return;
    out.push({
      test: t.name,
      value: last.raw,
      unit: labUnit(t),
      lab_range: t.range || "",
      your_target: labTargetText(t),
      status: LAB_STATUS_TEXT[stt] || "no range",
      date: last.draw.date,
    });
  });
  return out;
}

/* ---------- flags and ratings: worked out by the app, never by the AI ----------
   Every report for the same data now gets the same flags in the same order and the same rating.
   Claude only explains them. */
var INS_SEV_RANK = { high: 0, medium: 1, low: 2 };
var INS_SEV = { high: ["Act on", "late"], medium: ["Check", "due"], low: ["Note", ""] };
var INS_TIERS = ["excellent", "good", "fair", "needs_work", "low"];
function insAvg(a) {
  return (
    a.reduce(function (x, y) {
      return x + y.v;
    }, 0) / a.length
  );
}
function insSortFlags(f) {
  return f
    .map(function (x, i) {
      x._i = i;
      return x;
    })
    .sort(function (a, b) {
      return INS_SEV_RANK[a.sev] - INS_SEV_RANK[b.sev] || a._i - b._i;
    })
    .map(function (x, i) {
      delete x._i;
      x.id = "F" + (i + 1);
      return x;
    });
}
/* Lab results outside the lab range (high priority) or off your own target (check). */
function insLabFlags(list) {
  return list.map(function (x) {
    var bad = x.status === LAB_STATUS_TEXT.hi || x.status === LAB_STATUS_TEXT.lo;
    var why = bad
      ? x.status.toLowerCase() + (x.lab_range ? " (" + x.lab_range + ")" : "")
      : "off your target" + (x.your_target ? " (" + x.your_target + ")" : "");
    return {
      sev: bad ? "high" : "medium",
      kind: "lab",
      title: x.test,
      text: x.test + " " + x.value + (x.unit ? " " + x.unit : "") + " on " + de(x.date) + ": " + why + ".",
    };
  });
}
/* Home readings over the 90 days to the end date. Only rises are flagged. */
function insHomeFlags(end) {
  var out = [],
    ms = (d.metrics || [])
      .filter(function (m) {
        return m.date <= end && m.date >= ne(end, -90);
      })
      .sort(function (a, b) {
        return a.date < b.date ? -1 : 1;
      });
  if (!ms.length) return out;
  // [field, name, unit, rise that counts, level that counts (average of last 3), who sets that level]
  [
    [
      "glucose",
      "Fasting glucose",
      "mmol/L",
      0.4,
      5.6,
      "the level the American Diabetes Association counts as raised fasting glucose; Diabetes Canada uses 6.1",
    ],
    ["weight", "Weight", "lb", 4, null, ""],
    ["sbp", "Blood pressure, top number", "mmHg", 8, 135, "the home-reading limit Hypertension Canada uses"],
    [
      "dbp",
      "Blood pressure, bottom number",
      "mmHg",
      5,
      85,
      "the home-reading limit Hypertension Canada uses",
    ],
    ["hr", "Resting pulse", "bpm", 8, null, ""],
  ].forEach(function (rl) {
    var pts = ms
      .filter(function (m) {
        return m[rl[0]] !== "" && m[rl[0]] != null && isFinite(parseFloat(m[rl[0]]));
      })
      .map(function (m) {
        return { date: m.date, v: parseFloat(m[rl[0]]) };
      });
    if (!pts.length) return;
    var k = Math.min(3, Math.max(1, Math.floor(pts.length / 2))),
      last = pts.slice(-k),
      first = pts.slice(0, k);
    var la = insAvg(last),
      parts = [];
    if (pts.length >= 4) {
      var fa = insAvg(first);
      if (la - fa >= rl[3])
        parts.push(
          "up from about " +
            fe(fa, 1) +
            " to " +
            fe(la, 1) +
            " " +
            rl[2] +
            " between " +
            de(first[0].date) +
            " and " +
            de(last[last.length - 1].date),
        );
    }
    if (rl[4] !== null && la >= rl[4])
      parts.push("recent average " + fe(la, 1) + " " + rl[2] + " is at or above " + rl[4] + ", " + rl[5]);
    if (parts.length)
      out.push({ sev: "medium", kind: "home", title: rl[1], text: rl[1] + ": " + parts.join("; ") + "." });
  });
  var lastDate = ms[ms.length - 1].date;
  if (ae(lastDate, end) > 7)
    out.push({
      sev: "low",
      kind: "data",
      title: "Home readings",
      text: "No home readings logged since " + de(lastDate) + ", so recent trends cannot be checked.",
      note: "Log weight and fasting glucose at least once a week so these reports can spot changes early.",
    });
  return out;
}
/* Fixed wording for missed doses, with the pattern if there is one. */
function insMissNote(missed) {
  var am = missed.filter(function (x) {
      return / AM$/.test(x);
    }).length,
    pm = missed.filter(function (x) {
      return / PM$/.test(x);
    }).length,
    days = missed.map(function (x) {
      return x.slice(0, 3);
    }),
    pat = "";
  if (missed.length > 1 && pm === missed.length) pat = "All were evening doses. ";
  else if (missed.length > 1 && am === missed.length) pat = "All were morning doses. ";
  else if (
    missed.length > 1 &&
    days.every(function (x) {
      return x === days[0];
    })
  )
    pat = "All fell on a " + days[0] + ". ";
  return (
    pat +
    "If any were taken but not logged, log them on the right day. Otherwise nothing to do unless it keeps happening."
  );
}
/* Everything the protocol report must cover. */
function insProtoFlags(S, labSnap) {
  var f = insLabFlags(labSnap).concat(insHomeFlags(S.end));
  S.rows.forEach(function (r0) {
    if (r0.extra)
      f.push({
        sev: "medium",
        kind: "dose",
        title: r0.name,
        text:
          r0.name +
          ": " +
          r0.extra +
          " dose" +
          (r0.extra === 1 ? "" : "s") +
          " logged on a day it is not scheduled.",
        note: "If it was a real extra shot, your weekly total was higher than planned. If it was logged on the wrong day, move it in History so adherence and stock stay right.",
      });
    if (r0.missed.length)
      f.push({
        sev: "low",
        kind: "dose",
        title: r0.name,
        text: r0.name + ": missed " + r0.missed.join(", ") + ".",
        note: insMissNote(r0.missed),
      });
  });
  // Compounds taken in the 21 days before the end date that have no protocol in this report.
  var inRows = {};
  S.rows.forEach(function (r0) {
    inRows[r0.cid] = 1;
  });
  var loose = {};
  (d.logs || []).forEach(function (l) {
    var dt = insLogDate(l);
    if (l.status === "taken" && l.compoundId && !inRows[l.compoundId] && dt <= S.end && dt > ne(S.end, -21))
      loose[l.compoundId] = 1;
  });
  var names = Object.keys(loose).map(pt).filter(Boolean).sort();
  if (names.length)
    f.push({
      sev: "low",
      kind: "data",
      title: "Not on a protocol",
      text:
        names.join(", ") +
        (names.length === 1 ? " was" : " were") +
        " logged in the last 3 weeks but " +
        (names.length === 1 ? "is" : "are") +
        " not on a running protocol, so " +
        (names.length === 1 ? "it is" : "they are") +
        " not reviewed here.",
      note:
        "Add a protocol for " +
        (names.length === 1 ? "it" : "each") +
        " if you want it covered in these reports.",
    });
  return insSortFlags(f);
}
function insProtoRating(pct, flags) {
  var base = pct === null ? 1 : pct >= 90 ? 0 : pct >= 80 ? 1 : pct >= 65 ? 2 : pct >= 50 ? 3 : 4;
  var high = flags.filter(function (x) {
    return x.sev === "high";
  }).length;
  var idx = Math.min(4, base + (high ? 1 : 0)),
    lbl = function (i) {
      return INS_RATING[INS_TIERS[i]][0];
    };
  var why =
    (pct === null ? "No doses were scheduled in this period" : pct + "% of doses logged rates " + lbl(base)) +
    (high
      ? "; lowered one step for " + high + " result" + (high === 1 ? "" : "s") + " outside the lab range"
      : "") +
    ".";
  return { rating: INS_TIERS[idx], why: why };
}
function insLabRating(flags) {
  var high = flags.filter(function (x) {
      return x.sev === "high";
    }).length,
    med = flags.filter(function (x) {
      return x.sev === "medium";
    }).length;
  return high
    ? {
        rating: "needs_attention",
        why: high + " result" + (high === 1 ? "" : "s") + " outside the lab range on this draw.",
      }
    : med
      ? {
          rating: "watch",
          why: med + " result" + (med === 1 ? "" : "s") + " off your own target on this draw.",
        }
      : { rating: "good", why: "Every result on this draw is in range." };
}

/* ---------- saved compound write-ups ----------
   "What to expect" and "watch for" depend on the compound, dose and stage, not on this week's log,
   so each is written once and reused. Stage is worked out by the app. */
function insStage(r0) {
  if (r0.resting) return "resting";
  if (!r0.week || r0.week <= 2) return "early";
  if (r0.week <= 8) return "building";
  if (r0.week <= 20) return "established";
  return "maintenance";
}
function insGuideKey(r0) {
  return [pt(r0.cid).toLowerCase(), r0.dose, r0.route, r0.blend || "", insStage(r0)].join("|");
}
function insGuideId(key) {
  var h = 0;
  for (var i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return "g-" + (h >>> 0).toString(36);
}
function insGuideFor(r0) {
  var key = insGuideKey(r0);
  return (
    (d.insGuides || []).find(function (g) {
      return g.key === key;
    }) || null
  );
}

/* ---------- prompts ---------- */
var INS_STYLE = [
  "The reader is an informed layperson, not a doctor. Plain language comes first: the first time you use a medical term or abbreviation, explain it in a few words in brackets.",
  'Be direct, specific and short. No pep talk, no filler, no general disclaimers, no "everyone is different".',
  "Use only the data you are given. Never invent doses, dates, symptoms, readings, lab values or study figures. If you cite a study result, it must be one you are sure of.",
  'Read "about_me" before judging anything. A result that is expected for this person (for example very low LH and FSH, the pituitary signals to the testes, while on prescribed testosterone) is not a problem: say once that it is expected and why, then move on.',
  "Only suggest raising something with a clinician when there is a specific finding to raise, and then say exactly what to raise.",
].join("\n");

var INS_PROTO_SYS =
  "You write a review of one person's self-directed peptide and hormone protocol from the log their tracking app sends you.\n\n" +
  INS_STYLE +
  "\n\n" +
  [
    "Rules for this review:",
    "- Adherence percentages, dose counts and week numbers are already calculated by the app. Use them exactly. Do not recalculate.",
    '- "shot_notes" are the person\'s own notes on their shots. Treat them as their symptom and effect reports.',
    '- "compound_guides_needed" lists compounds that have no saved write-up yet. Write one compound_guides entry for each, using its ref: what is typically reported at that stage and dose, and what to watch for. These are saved and reused for weeks, so keep them general to the compound, dose and stage, not to this week. Most research peptides have little human data: when that is so, say it in one clause and still give what is known from animal studies or common use, labelled as such. Never write "no information is available". If the list is empty, return an empty compound_guides.',
    "- Advice tied to this person's data belongs in the recommendations. If nothing logged could show whether a compound is working, a recommendation can name the one measurement that would.",
    "- Interactions: flag only real overlaps among the active compounds (same receptor or pathway, stacked side effects, effects on the lab values given). Do not invent interactions.",
    "- Lab notes: say how the lab snapshot bears on the current stack, and how old the labs are relative to compounds started since.",
    "- If a previous report is included, say whether its recommendations were followed where the data shows it.",
    "- Recommendations: at most five, most important first, each concrete.",
    '- "must_cover_flags" is the list of findings the app has already picked out that need your explanation, most important first. Write exactly one flag_notes entry for every one, using its id. Do not drop, merge or reorder them. Routine findings (missed or extra doses, gaps in logging) are explained by the app and are not in this list.',
    '- The headline must lead with the first flag in must_cover_flags if there is one. The summary must mention every flag marked "high".',
    '- The rating is already set by the app and given in "rating". Do not change it or work out your own.',
  ].join("\n");

var INS_LAB_SYS =
  "You analyse one person's blood test history, sent by their tracking app, in the context of the compounds they take.\n\n" +
  INS_STYLE +
  "\n\n" +
  [
    "Rules for this analysis:",
    "- Focus on the focus draw, compared with earlier draws. Say which way each important marker moved and by roughly how much.",
    "- Use the status given for each result (above or below the lab range, off the person's own target, in range). Do not re-flag a value the data marks in range, but do note an in-range value that is moving steadily toward a limit.",
    "- Link changes to the start and stop dates and current protocols only where the timing and the known mechanism fit. Say how sure you are in plain words.",
    "- Note draw conditions that change a result (not fasted, worked out before, time of day for testosterone or cortisol, a statin).",
    "- Watch for the same test under two names or in two units, and say so instead of treating it as a real change.",
    "- Recommendations: at most five, most important first, each concrete. Retest suggestions must say which tests and roughly when.",
    '- "must_cover_flags" is the list of results the app has already picked out on the focus draw, most important first. Write exactly one flag_notes entry for every flag, using its id. Do not drop, merge or reorder them. Each flagged test must also appear in "findings".',
    "- The headline must lead with the first flag in must_cover_flags if there is one.",
    '- The rating is already set by the app and given in "rating". Do not change it or work out your own.',
  ].join("\n");

var INS_REC = {
  type: "object",
  required: ["title", "why", "action", "priority"],
  properties: {
    title: { type: "string", description: "Short and imperative, under 9 words." },
    why: {
      type: "string",
      description: "One or two sentences: the finding in this person's data that prompts it.",
    },
    action: { type: "string", description: "Exactly what to do." },
    priority: { type: "string", enum: ["high", "medium", "low"] },
  },
};
var INS_FLAGNOTES = {
  type: "array",
  description: "Exactly one entry per flag in must_cover_flags, same ids, same order.",
  items: {
    type: "object",
    required: ["id", "explanation"],
    properties: {
      id: { type: "string", description: "The flag id, for example F1." },
      explanation: {
        type: "string",
        description:
          "Two or three plain sentences: what it means for this person, the likely reason from their data, and what to do.",
      },
    },
  },
};
var INS_PROTO_TOOL = {
  name: "protocol_report",
  description: "Return the protocol review.",
  input_schema: {
    type: "object",
    required: [
      "headline",
      "summary",
      "flag_notes",
      "compound_guides",
      "interactions",
      "lab_notes",
      "recommendations",
    ],
    properties: {
      headline: {
        type: "string",
        description: "One sentence. Leads with the first flag in must_cover_flags if there is one.",
      },
      summary: { type: "string", description: "Three to five sentences." },
      flag_notes: INS_FLAGNOTES,
      compound_guides: {
        type: "array",
        description: "One entry per item in compound_guides_needed. Empty if none are needed.",
        items: {
          type: "object",
          required: ["ref", "expect", "watch"],
          properties: {
            ref: { type: "string", description: "The ref from compound_guides_needed, for example C1." },
            expect: {
              type: "string",
              description: "What is typically reported at this stage and dose, two or three sentences.",
            },
            watch: {
              type: "array",
              items: { type: "string" },
              description: "Two to five short side effects or signs to watch, in plain words.",
            },
          },
        },
      },
      interactions: {
        type: "array",
        description: "Real overlaps only. Empty if none.",
        items: {
          type: "object",
          required: ["title", "detail"],
          properties: { title: { type: "string" }, detail: { type: "string" } },
        },
      },
      lab_notes: {
        type: "array",
        items: { type: "string" },
        description: "Short notes on the lab snapshot as it bears on the stack. Empty if no labs.",
      },
      recommendations: { type: "array", items: INS_REC, description: "At most five, most important first." },
    },
  },
};
var INS_LAB_TOOL = {
  name: "lab_report",
  description: "Return the lab analysis.",
  input_schema: {
    type: "object",
    required: [
      "headline",
      "summary",
      "flag_notes",
      "findings",
      "observations",
      "recommendations",
      "clinician_questions",
    ],
    properties: {
      headline: { type: "string", description: "One sentence. Leads with flag F1 if there is one." },
      summary: { type: "string", description: "Three to five sentences." },
      flag_notes: INS_FLAGNOTES,
      findings: {
        type: "array",
        description: "Flagged results and noteworthy changes only, most important first.",
        items: {
          type: "object",
          required: ["test", "status", "detail"],
          properties: {
            test: { type: "string", description: "Test name as given." },
            status: {
              type: "string",
              enum: ["high", "low", "off_target", "borderline", "in_range", "improved"],
            },
            detail: {
              type: "string",
              description:
                "Value, the change from earlier draws, the likely reason, plain words. Two or three sentences.",
            },
          },
        },
      },
      observations: {
        type: "array",
        description:
          "Patterns across several tests, links to compounds, draw-condition and data-quality issues.",
        items: {
          type: "object",
          required: ["title", "detail"],
          properties: { title: { type: "string" }, detail: { type: "string" } },
        },
      },
      recommendations: { type: "array", items: INS_REC, description: "At most five, most important first." },
      clinician_questions: {
        type: "array",
        items: { type: "string" },
        description: "Specific questions to bring to the clinician who ordered the labs. Empty if none.",
      },
    },
  },
};
var INS_PING_TOOL = {
  name: "ping",
  description: "Confirm the connection works.",
  input_schema: { type: "object", properties: { ok: { type: "boolean" } }, required: ["ok"] },
};

/* ---------- the call ---------- */
var insNoTemp = false; // set if the service refuses the temperature setting, so it is not sent again
async function insCall(system, user, tool, maxTok) {
  try {
    return await insCall0(system, user, tool, maxTok, !insNoTemp);
  } catch (e) {
    if (!insNoTemp && /temperature/i.test((e && e.message) || "")) {
      insNoTemp = true;
      return insCall0(system, user, tool, maxTok, false);
    }
    throw e;
  }
}
async function insCall0(system, user, tool, maxTok, useTemp) {
  var c = insCfg(),
    ctl = new AbortController(),
    tm = setTimeout(function () {
      ctl.abort();
    }, 240000);
  try {
    var res = await fetch(String(c.url).trim(), {
      method: "POST",
      signal: ctl.signal,
      headers: { "Content-Type": "application/json", "X-App-Key": String(c.key).trim() },
      body: JSON.stringify({
        model: insModel(),
        max_tokens: maxTok || 8000,
        temperature: useTemp ? 0 : undefined,
        system: system,
        messages: [{ role: "user", content: user }],
        tools: [tool],
        tool_choice: { type: "tool", name: tool.name },
      }),
    });
    var txt = await res.text(),
      j = null;
    try {
      j = JSON.parse(txt);
    } catch (x) {}
    if (!res.ok) {
      if (res.status === 401)
        throw new Error("The access key does not match the APP_KEY saved in your Worker.");
      var m = j && j.error ? j.error.message || j.error : "";
      throw new Error(
        m ? "The AI service said: " + m : "The AI service answered with error " + res.status + ".",
      );
    }
    if (j && j.stop_reason === "max_tokens")
      throw new Error("The report ran too long and was cut off. Try a shorter period.");
    var b =
      j &&
      (j.content || []).find(function (x) {
        return x.type === "tool_use";
      });
    if (!b || !b.input) throw new Error("The AI reply came back empty. Try again.");
    return { out: b.input, model: j.model || "", usage: j.usage || null };
  } catch (e) {
    if (e && e.name === "AbortError") throw new Error("No answer after 4 minutes. Try again.");
    if (e instanceof TypeError)
      throw new Error(
        "Could not reach your Worker. Check the Worker address under AI connection, and that you are online.",
      );
    throw e;
  } finally {
    clearTimeout(tm);
  }
}

/* ---------- building and saving reports ---------- */
async function insRunProtocol(start, end, id) {
  var S = insStats(start, end);
  if (!S.rows.length) throw new Error("No protocols ran in that period.");
  var prev = insList("protocol").filter(function (x) {
    return x.id !== id && x.end < end;
  })[0];
  var logs = (d.logs || []).filter(S.inPer);
  var labSnap = insLabSnap(end, true),
    flags = insProtoFlags(S, labSnap),
    R = insProtoRating(S.pct, flags);
  var need = [];
  S.rows.forEach(function (r0) {
    if (
      !insGuideFor(r0) &&
      !need.some(function (x) {
        return insGuideKey(x.r0) === insGuideKey(r0);
      })
    )
      need.push({ ref: "C" + (need.length + 1), r0: r0 });
  });
  var payload = {
    about_me: insCfg().context || "(not given)",
    period: { from: start, to: end, days: S.days, today: te() },
    must_cover_flags: flags
      .filter(function (f) {
        return !f.note;
      })
      .map(function (f) {
        return { id: f.id, priority: f.sev, finding: f.text };
      }),
    rating: { value: INS_RATING[R.rating][0], reason: R.why },
    compound_guides_needed: need.map(function (x) {
      return {
        ref: x.ref,
        compound: pt(x.r0.cid),
        dose: x.r0.dose,
        route: x.r0.route,
        blend_per_shot: x.r0.blend || undefined,
        stage: insStage(x.r0),
        week_on_compound: x.r0.week,
      };
    }),
    overall_adherence: { doses_scheduled: S.sched, doses_taken: S.taken, percent: S.pct },
    protocols: S.rows.map(function (r0) {
      return {
        compound: r0.name,
        route: r0.route,
        dose_now: r0.dose,
        schedule: r0.schedule,
        phase: r0.phase || undefined,
        blend_per_shot: r0.blend || undefined,
        resting_in_cycle: r0.resting || undefined,
        paused: r0.active ? undefined : true,
        current_run_started: r0.runStart,
        week_on_compound: r0.week,
        doses_scheduled: r0.sched,
        doses_taken: r0.taken,
        adherence_percent: r0.pct,
        extra_doses_off_schedule: r0.extra || undefined,
        missed: r0.missed.length ? r0.missed : undefined,
        protocol_notes: r0.notes || undefined,
      };
    }),
    one_off_shots: logs
      .filter(function (l) {
        return !l.protocolId && l.status === "taken";
      })
      .map(function (l) {
        return { date: insLogDate(l), compound: pt(l.compoundId), dose: $e(be(l.doseMg), Ce(l.compoundId)) };
      }),
    shot_notes: logs
      .filter(function (l) {
        return l.notes;
      })
      .map(function (l) {
        return { date: insLogDate(l), compound: pt(l.compoundId), note: l.notes };
      }),
    home_readings: (d.metrics || [])
      .filter(function (m) {
        return m.date <= end && m.date >= ne(end, -90);
      })
      .sort(function (a, b) {
        return a.date < b.date ? -1 : 1;
      })
      .map(function (m) {
        var o = { date: m.date };
        Ia.forEach(function (f) {
          if (m[f[0]] !== "" && m[f[0]] != null) o[f[1] + " (" + f[2] + ")"] = m[f[0]];
        });
        if (m.notes) o.notes = m.notes;
        return o;
      }),
    lab_snapshot: labSnap,
    latest_lab_draw:
      (
        labDraws()
          .filter(function (x) {
            return x.date <= end;
          })
          .slice(-1)[0] || {}
      ).date || "none",
    starts_and_stops_last_120_days: labEvents().filter(function (e) {
      return e.date <= end && e.date >= ne(end, -120);
    }),
    previous_report: prev
      ? {
          period: prev.start + " to " + prev.end,
          rating: prev.rating || prev.ai.rating,
          headline: prev.ai.headline,
          recommendations: insFix(prev.ai).recommendations.map(function (x) {
            return x.title;
          }),
        }
      : undefined,
  };
  var res = await insCall(
    INS_PROTO_SYS,
    "Review my protocol for " +
      de(start) +
      " to " +
      de(end) +
      ". My log:\n\n" +
      JSON.stringify(payload, null, 1),
    INS_PROTO_TOOL,
    8000,
  );
  // Save the new write-ups, then copy each compound's write-up into the report so it never changes later.
  d.insGuides = d.insGuides || [];
  insArr(res.out.compound_guides).forEach(function (g) {
    var x = need.find(function (n) {
      return (
        n.ref ===
        String(g && g.ref)
          .trim()
          .toUpperCase()
      );
    });
    if (!x || !g.expect) return;
    var key = insGuideKey(x.r0);
    if (insGuideFor(x.r0)) return;
    d.insGuides.push({
      id: insGuideId(key),
      key: key,
      compound: pt(x.r0.cid),
      dose: x.r0.dose,
      stage: insStage(x.r0),
      expect: String(g.expect),
      watch: insArr(g.watch).map(String),
      created: Date.now(),
      model: res.model,
    });
  });
  var guides = S.rows.map(function (r0) {
    var g = insGuideFor(r0);
    return { name: r0.name, stage: insStage(r0), expect: g ? g.expect : "", watch: g ? g.watch : [] };
  });
  return insSave({
    id: id || "ins-" + ve(),
    kind: "protocol",
    guides: guides,
    start: start,
    end: end,
    created: Date.now(),
    model: res.model,
    ai: res.out,
    rating: R.rating,
    ratingWhy: R.why,
    flags: flags,
    stats: {
      sched: S.sched,
      taken: S.taken,
      pct: S.pct,
      rows: S.rows.map(function (r0) {
        return {
          name: r0.name,
          week: r0.week,
          dose: r0.dose,
          schedule: r0.schedule,
          sched: r0.sched,
          taken: r0.taken,
          pct: r0.pct,
        };
      }),
    },
  });
}

async function insRunLabs(drawId, id) {
  var draws = labDraws(),
    focus =
      draws.find(function (x) {
        return x.id === drawId;
      }) || draws[draws.length - 1];
  if (!focus) throw new Error("No lab draws yet. Add your labs on the Labs page first.");
  var upto = draws
    .filter(function (x) {
      return x.date <= focus.date;
    })
    .slice(-8);
  var tests = labTests()
    .map(function (t) {
      var s = labSeries(t.id)
        .filter(function (x) {
          return x.draw.date <= focus.date;
        })
        .slice(-8);
      if (!s.length) return null;
      return {
        name: t.name,
        section: t.group,
        unit: t.unit,
        lab_range: t.range || "",
        your_target: labTargetText(t) || undefined,
        calculated: t.calc || undefined,
        what_it_measures: t.desc || undefined,
        results: s.map(function (x) {
          return {
            date: x.draw.date,
            value: x.raw,
            status: LAB_STATUS_TEXT[labStatus(t, x.raw)] || "no range",
          };
        }),
      };
    })
    .filter(Boolean);
  var S = insStats(ne(te(), -13), te());
  var payload = {
    about_me: insCfg().context || "(not given)",
    focus_draw: focus.date,
    today: te(),
    draws: upto.map(function (x) {
      return {
        date: x.date,
        conditions: labCond(x) || undefined,
        statin: x.statin || undefined,
        panel: x.label || undefined,
        notes: x.notes || undefined,
      };
    }),
    tests: tests,
    current_protocols: S.rows.map(function (r0) {
      return { compound: r0.name, dose: r0.dose, schedule: r0.schedule, current_run_started: r0.runStart };
    }),
    starts_and_stops: labEvents(),
  };
  var focusTests = tests.filter(function (t) {
    return t.results[t.results.length - 1].date === focus.date;
  });
  var flagged = focusTests.filter(function (t) {
    var v = t.results[t.results.length - 1].status;
    return v === LAB_STATUS_TEXT.hi || v === LAB_STATUS_TEXT.lo || v === LAB_STATUS_TEXT.tgt;
  }).length;
  var lflags = insSortFlags(
    insLabFlags(
      focusTests
        .map(function (t) {
          var x = t.results[t.results.length - 1];
          return {
            test: t.name,
            value: x.value,
            unit: labUnit({ unit: t.unit }),
            lab_range: t.lab_range,
            your_target: t.your_target || "",
            status: x.status,
            date: x.date,
          };
        })
        .filter(function (x) {
          return (
            x.status === LAB_STATUS_TEXT.hi ||
            x.status === LAB_STATUS_TEXT.lo ||
            x.status === LAB_STATUS_TEXT.tgt
          );
        }),
    ),
  );
  var LR = insLabRating(lflags);
  payload.must_cover_flags = lflags.map(function (f) {
    return { id: f.id, priority: f.sev, finding: f.text };
  });
  payload.rating = { value: INS_RATING[LR.rating][0], reason: LR.why };
  var res = await insCall(
    INS_LAB_SYS,
    "Analyse my labs, focusing on the draw of " +
      de(focus.date) +
      ". My data:\n\n" +
      JSON.stringify(payload, null, 1),
    INS_LAB_TOOL,
    8000,
  );
  return insSave({
    id: id || "ins-" + ve(),
    kind: "lab",
    start: upto[0].date,
    end: focus.date,
    drawId: focus.id,
    created: Date.now(),
    model: res.model,
    ai: res.out,
    rating: LR.rating,
    ratingWhy: LR.why,
    flags: lflags,
    stats: { markers: focusTests.length, flagged: flagged, draws: upto.length },
  });
}

function insSave(rep) {
  d.insights = d.insights || [];
  var ix = d.insights.findIndex(function (x) {
    return x.id === rep.id;
  });
  ix >= 0 ? (d.insights[ix] = rep) : d.insights.push(rep);
  s();
  return rep;
}

/* Runs a generator from a modal button, with a busy state. */
async function insGo(btn, fn) {
  var lbl = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Writing… about a minute";
  try {
    var rep = await fn();
    Rt();
    r.tab = "insights";
    r.insOpen = rep.id;
    Ua();
    Ft("Report ready.");
  } catch (e) {
    btn.disabled = false;
    btn.textContent = lbl;
    Ft(e.message || String(e));
  }
}

/* ---------- views ---------- */
function insPill(kind, map) {
  var x = map[kind];
  return x ? '<span class="pill ' + x[1] + '">' + Ht(x[0]) + "</span>" : "";
}
function insRange(a, b) {
  var A = ee(a),
    B = ee(b);
  return (
    le[A.getMonth()] +
    " " +
    A.getDate() +
    (A.getFullYear() !== B.getFullYear() ? ", " + A.getFullYear() : "") +
    " – " +
    (A.getMonth() === B.getMonth() && A.getFullYear() === B.getFullYear() ? "" : le[B.getMonth()] + " ") +
    B.getDate() +
    ", " +
    B.getFullYear()
  );
}
function insBarCls(p) {
  return p === null ? "" : p >= 90 ? "good" : p >= 65 ? "warn" : "bad";
}

function insView() {
  r.insView = r.insView || "protocol";
  if (r.insOpen) {
    var rep = (d.insights || []).find(function (x) {
      return x.id === r.insOpen;
    });
    if (rep) return insDetail(rep);
    r.insOpen = null;
  }
  var el = Bt('<div class="stack"></div>'),
    v = r.insView,
    ready = insReady();
  el.appendChild(
    Bt(
      '<div class="head"><div><h1>Insights</h1><p>Reviews of your log and your labs, written by Claude from what you have logged here.</p></div>' +
        (ready
          ? '<button class="btn" id="ins-new">' + (v === "lab" ? "Analyse labs" : "New report") + "</button>"
          : "") +
        "</div>",
    ),
  );
  if (!ready) {
    el.appendChild(insSetup(true));
    return el;
  }
  el.querySelector("#ins-new").addEventListener("click", function () {
    v === "lab" ? insLabForm() : insProtoForm();
  });
  var seg = Bt(
    '<div class="seg"><button data-iv="protocol" aria-pressed="' +
      (v === "protocol") +
      '">Protocol reports</button><button data-iv="lab" aria-pressed="' +
      (v === "lab") +
      '">Lab analysis</button></div>',
  );
  seg.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () {
      r.insView = b.dataset.iv;
      Ua();
    });
  });
  el.appendChild(seg);
  var list = insList(v);
  if (!list.length) {
    el.appendChild(
      Bt(
        '<div class="panel"><div class="empty"><b>' +
          (v === "lab" ? "No lab analyses yet" : "No reports yet") +
          "</b>" +
          (v === "lab"
            ? "Claude reads every draw on your Labs page, compares them and links changes to what you started or stopped."
            : "Each report covers a stretch of your log: adherence, where you are on each compound, overlaps in the stack and what to do next.") +
          '<br><br><button class="btn" id="ins-first">' +
          (v === "lab" ? "Analyse labs" : "Write my first report") +
          "</button></div></div>",
      ),
    );
    el.querySelector("#ins-first").addEventListener("click", function () {
      v === "lab" ? insLabForm() : insProtoForm();
    });
  } else {
    var wrap = Bt('<div class="stack" style="gap:12px"></div>');
    list.forEach(function (rep) {
      var a = insFix(rep.ai),
        n = a.recommendations.length;
      var foot =
        rep.kind === "lab"
          ? rep.stats.markers +
            ' markers · <span style="color:' +
            (rep.stats.flagged ? "var(--alert)" : "inherit") +
            '">' +
            rep.stats.flagged +
            " flagged</span>"
          : (rep.stats.pct === null ? "" : rep.stats.pct + "% adherence · ") +
            n +
            " recommendation" +
            (n === 1 ? "" : "s");
      wrap.appendChild(
        Bt(
          '<button class="ins-card" data-insopen="' +
            Ht(rep.id) +
            '"><div class="ins-top"><div><div class="ins-per">' +
            Ht(rep.kind === "lab" ? "Draw of " + de(rep.end) : insRange(rep.start, rep.end)) +
            '</div><div class="tiny muted">Written ' +
            Ht(de(_(new Date(rep.created)))) +
            "</div></div>" +
            insPill(rep.rating || a.rating, INS_RATING) +
            '</div><div class="ins-hl">' +
            Ht(a.headline || "") +
            '</div><div class="ins-foot">' +
            foot +
            "</div></button>",
        ),
      );
    });
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-insopen]");
      if (b) {
        r.insOpen = b.dataset.insopen;
        Ua();
      }
    });
    el.appendChild(wrap);
  }
  el.appendChild(insSetup(false));
  return el;
}

function insSetup(open) {
  var c = insCfg();
  var p = Bt(
    '<details class="panel ins-setup"' +
      (open ? " open" : "") +
      '><summary>AI connection and about me</summary><div class="pbody">' +
      (open
        ? '<p class="tiny muted" style="margin:0 0 12px">One-time setup. Your log goes to your own Cloudflare Worker, which passes it to Claude and sends the report back. The setup syncs to your other devices.</p>'
        : "") +
      '<div class="field"><label for="ins-url">Worker address</label><input id="ins-url" type="url" placeholder="https://protocol-ai.yourname.workers.dev" value="' +
      Ht(c.url) +
      '"></div>' +
      '<div class="field"><label for="ins-key">Access key</label><input id="ins-key" type="password" autocomplete="off" value="' +
      Ht(c.key) +
      '"><span class="hint">The APP_KEY you saved in the Worker.</span></div>' +
      '<div class="field"><label for="ins-ctx">About me</label><textarea id="ins-ctx" rows="5" placeholder="What Claude should always know: prescriptions, conditions, goals, anything that changes what counts as normal for you.">' +
      Ht(c.context) +
      "</textarea>" +
      '<span class="hint">Sent with every report. Example: "On prescribed TRT, so low LH and FSH are expected. Goals: fat loss, joint repair."</span></div>' +
      '<div class="field"><label for="ins-model">AI model</label><select id="ins-model">' +
      INS_MODELS.map(function (m) {
        return (
          '<option value="' +
          m[0] +
          '"' +
          (m[0] === insModel() ? " selected" : "") +
          ">" +
          Ht(m[1]) +
          "</option>"
        );
      }).join("") +
      '</select><span class="hint">The app already picks the flags and the rating, so the cheaper model is enough for the wording.</span></div>' +
      '<div class="field"><label>Saved compound write-ups</label><div class="row"><span class="tiny muted" id="ins-gcount"></span><button class="btn ghost sm" id="ins-gclear">Clear them</button></div>' +
      '<span class="hint">Each compound\'s "what to expect" text is written once per dose and stage, then reused. Clear them to have them written fresh.</span></div>' +
      '<div class="row"><button class="btn" id="ins-save">Save</button><button class="btn ghost" id="ins-test">Test connection</button></div></div></details>',
  );
  var save = function () {
    c.url = p.querySelector("#ins-url").value.trim();
    c.key = p.querySelector("#ins-key").value.trim();
    c.context = p.querySelector("#ins-ctx").value.trim();
    c.model = p.querySelector("#ins-model").value;
    s();
  };
  var gc = function () {
    var n = (d.insGuides || []).length;
    p.querySelector("#ins-gcount").textContent = n + " saved";
    p.querySelector("#ins-gclear").disabled = !n;
  };
  gc();
  p.querySelector("#ins-gclear").addEventListener("click", function () {
    d.insGuides = [];
    s();
    gc();
    Ft("Saved write-ups cleared. The next report writes them fresh.");
  });
  p.querySelector("#ins-save").addEventListener("click", function () {
    save();
    Ft("Saved.");
    Ua();
  });
  p.querySelector("#ins-test").addEventListener("click", async function (e) {
    var b = e.currentTarget;
    save();
    if (!insReady()) {
      Ft("Enter the Worker address and access key first.");
      return;
    }
    b.disabled = true;
    b.textContent = "Testing…";
    try {
      await insCall("Call the ping tool with ok true.", "Ping.", INS_PING_TOOL, 50);
      Ft("Connected. Claude answered.");
    } catch (x) {
      Ft(x.message || String(x));
    }
    b.disabled = false;
    b.textContent = "Test connection";
  });
  return p;
}

function insProtoForm(prefill) {
  var end = (prefill && prefill.end) || te(),
    len = prefill && prefill.start ? ae(prefill.start, prefill.end) + 1 : 14;
  Vt(
    "New protocol report",
    '<div class="fgrid"><div class="field"><label for="ip-len">Covers</label><select id="ip-len">' +
      [
        [7, "One week"],
        [14, "Two weeks"],
        [28, "Four weeks"],
      ]
        .map(function (o) {
          return (
            '<option value="' + o[0] + '"' + (o[0] === len ? " selected" : "") + ">" + o[1] + "</option>"
          );
        })
        .join("") +
      "</select></div>" +
      '<div class="field"><label for="ip-end">Ending on</label><input id="ip-end" type="date" max="' +
      te() +
      '" value="' +
      Ht(end) +
      '"></div></div>' +
      '<p class="tiny muted" id="ip-prev" style="margin:0"></p>',
    '<button class="btn ghost" data-close>Cancel</button><button class="btn" id="ip-go">' +
      (prefill ? "Write it again" : "Write report") +
      "</button>",
  );
  var m = Ot("#modal");
  var per = function () {
    var e2 = m.querySelector("#ip-end").value || te();
    if (e2 > te()) e2 = te();
    return { start: ne(e2, -(+m.querySelector("#ip-len").value - 1)), end: e2 };
  };
  var show = function () {
    var p = per(),
      S = insStats(p.start, p.end);
    m.querySelector("#ip-prev").textContent =
      insRange(p.start, p.end) +
      " · " +
      S.rows.length +
      " protocol" +
      (S.rows.length === 1 ? "" : "s") +
      (S.pct === null ? "" : " · " + S.pct + "% of doses logged so far");
  };
  m.querySelectorAll("select,input").forEach(function (x) {
    x.addEventListener("input", show);
  });
  show();
  m.querySelector("#ip-go").addEventListener("click", function (e) {
    var p = per();
    insGo(e.currentTarget, function () {
      return insRunProtocol(p.start, p.end, prefill && prefill.id);
    });
  });
}

function insLabForm(prefill) {
  var draws = labDraws();
  if (!draws.length) {
    Ft("No lab draws yet. Add your labs on the Labs page first.");
    return;
  }
  var cur = (prefill && prefill.drawId) || draws[draws.length - 1].id;
  Vt(
    "Lab analysis",
    '<div class="field"><label for="il-draw">Focus on the draw of</label><select id="il-draw">' +
      draws
        .slice()
        .reverse()
        .map(function (x) {
          return (
            '<option value="' +
            Ht(x.id) +
            '"' +
            (x.id === cur ? " selected" : "") +
            ">" +
            Ht(de(x.date)) +
            (x.label ? " · " + Ht(x.label) : "") +
            "</option>"
          );
        })
        .join("") +
      "</select>" +
      '<span class="hint">Claude compares it with up to seven earlier draws and your start and stop dates.</span></div>',
    '<button class="btn ghost" data-close>Cancel</button><button class="btn" id="il-go">' +
      (prefill ? "Analyse again" : "Analyse") +
      "</button>",
  );
  var m = Ot("#modal");
  m.querySelector("#il-go").addEventListener("click", function (e) {
    var id = m.querySelector("#il-draw").value;
    insGo(e.currentTarget, function () {
      return insRunLabs(id, prefill && prefill.id);
    });
  });
}

function insRecs(list) {
  if (!list || !list.length) return "";
  return (
    '<div class="panel"><h2>Recommendations</h2><div class="pbody stack" style="gap:10px">' +
    list
      .map(function (x) {
        return (
          '<div class="ins-rec" data-p="' +
          Ht(x.priority || "") +
          '"><div class="spread"><b>' +
          Ht(x.title) +
          "</b>" +
          (x.priority === "high" ? '<span class="pill late">Priority</span>' : "") +
          "</div>" +
          '<p class="muted" style="margin:4px 0 6px">' +
          Ht(x.why) +
          '</p><p style="margin:0">' +
          Ht(x.action) +
          "</p></div>"
        );
      })
      .join("") +
    "</div></div>"
  );
}
function insNotes(title, list) {
  if (!list || !list.length) return "";
  return (
    '<div class="panel"><h2>' +
    Ht(title) +
    '</h2><div class="pbody stack" style="gap:10px">' +
    list
      .map(function (x) {
        return typeof x === "string"
          ? '<p style="margin:0">' + Ht(x) + "</p>"
          : "<div><b>" +
              Ht(x.title) +
              '</b><p class="muted" style="margin:3px 0 0">' +
              Ht(x.detail) +
              "</p></div>";
      })
      .join("") +
    "</div></div>"
  );
}

/* Claude sometimes sends a list as text. Turn every list field back into a real list. */
function insArr(x) {
  if (typeof x === "string") {
    var t = x.trim();
    if (!t) return [];
    try {
      x = JSON.parse(t);
    } catch (e) {
      return [t];
    }
  }
  if (x && !Array.isArray(x) && typeof x === "object") return [x];
  return Array.isArray(x) ? x : [];
}
function insFix(a) {
  if (typeof a === "string") {
    try {
      a = JSON.parse(a);
    } catch (e) {
      a = { summary: a };
    }
  }
  a = Object.assign({}, a || {});
  [
    "flag_notes",
    "compounds",
    "compound_guides",
    "interactions",
    "lab_notes",
    "recommendations",
    "findings",
    "observations",
    "clinician_questions",
  ].forEach(function (k) {
    a[k] = insArr(a[k]);
  });
  a.compounds = a.compounds.map(function (c) {
    c = typeof c === "object" && c ? Object.assign({}, c) : { name: String(c) };
    c.watch = insArr(c.watch);
    return c;
  });
  ["recommendations", "findings", "observations", "interactions"].forEach(function (k) {
    a[k] = a[k].map(function (x) {
      return typeof x === "object" && x
        ? x
        : { title: String(x), detail: "", why: "", action: String(x), test: String(x) };
    });
  });
  ["headline", "summary"].forEach(function (k) {
    if (a[k] != null && typeof a[k] !== "string") a[k] = String(a[k]);
  });
  return a;
}
function insFlagPanel(flags, notes) {
  var by = {};
  (notes || []).forEach(function (n) {
    if (n && n.id) by[String(n.id).trim().toUpperCase()] = n.explanation;
  });
  if (!flags.length)
    return Bt(
      '<div class="panel"><h2>Flagged</h2><div class="pbody"><p class="muted" style="margin:0">Nothing flagged: labs in range, no rising home readings, no off-schedule doses.</p></div></div>',
    );
  return Bt(
    '<div class="panel"><h2>Flagged<span class="tiny muted">picked by the app from your data, explained by Claude</span></h2><div class="pbody stack" style="gap:12px">' +
      flags
        .map(function (f) {
          var x = f.note || by[f.id],
            s = INS_SEV[f.sev] || INS_SEV.low;
          return (
            '<div class="ins-rec" data-p="' +
            (f.sev === "high" ? "high" : f.sev === "low" ? "low" : "medium") +
            '"><div class="spread"><b>' +
            Ht(f.text) +
            '</b><span class="pill ' +
            s[1] +
            '">' +
            s[0] +
            "</span></div>" +
            (x
              ? '<p class="muted" style="margin:4px 0 0">' + Ht(x) + "</p>"
              : '<p class="tiny" style="margin:4px 0 0;color:var(--due)">Claude did not explain this one. Press Write again.</p>') +
            "</div>"
          );
        })
        .join("") +
      "</div></div>",
  );
}
function insDetail(rep) {
  try {
    return insDetail0(rep);
  } catch (e) {
    console.error(e);
    var el = Bt(
      '<div class="stack"><div class="head"><div><button class="btn ghost sm" id="ind-back">‹ All reports</button><h1>Could not show this report</h1>' +
        "<p>" +
        Ht(e.message || String(e)) +
        '</p></div></div><div class="panel"><div class="pbody"><p class="tiny muted" style="margin:0 0 8px">What Claude sent:</p>' +
        '<pre style="white-space:pre-wrap;font-size:12px;margin:0">' +
        Ht(JSON.stringify(rep.ai, null, 2)) +
        "</pre></div></div></div>",
    );
    el.querySelector("#ind-back").addEventListener("click", function () {
      r.insOpen = null;
      Ua();
    });
    return el;
  }
}
function insDetail0(rep) {
  var a = insFix(rep.ai),
    el = Bt('<div class="stack ins-detail"></div>');
  el.appendChild(
    Bt(
      '<div class="head"><div><button class="btn ghost sm" id="ind-back" style="margin-bottom:8px">‹ All reports</button>' +
        "<h1>" +
        Ht(rep.kind === "lab" ? "Labs: draw of " + de(rep.end) : insRange(rep.start, rep.end)) +
        "</h1>" +
        "<p>Written " +
        Ht(de(_(new Date(rep.created)))) +
        (rep.model ? " by " + Ht(rep.model) : "") +
        "</p></div>" +
        '<div class="row"><button class="btn ghost" id="ind-again">Write again</button><button class="btn danger" id="ind-del">Delete</button></div></div>',
    ),
  );
  el.querySelector("#ind-back").addEventListener("click", function () {
    r.insOpen = null;
    Ua();
  });
  el.querySelector("#ind-again").addEventListener("click", function () {
    rep.kind === "lab" ? insLabForm(rep) : insProtoForm(rep);
  });
  var del = el.querySelector("#ind-del");
  del.addEventListener("click", function () {
    if (del.dataset.sure !== "1") {
      del.dataset.sure = "1";
      del.textContent = "Press again to delete";
      return;
    }
    d.insights = d.insights.filter(function (x) {
      return x.id !== rep.id;
    });
    r.insOpen = null;
    s();
    Ua();
    Ft("Report deleted.");
  });
  el.appendChild(
    Bt(
      '<div class="panel"><div class="pbody"><div class="spread" style="align-items:flex-start;margin-bottom:8px"><b class="ins-head">' +
        Ht(a.headline || "") +
        "</b>" +
        insPill(rep.rating || a.rating, INS_RATING) +
        "</div>" +
        '<p style="margin:0">' +
        Ht(a.summary || "") +
        "</p>" +
        (rep.kind === "protocol" && rep.stats.pct !== null
          ? '<div style="margin-top:14px"><div class="big-read">' +
            rep.stats.pct +
            "%<small> of scheduled doses logged · " +
            rep.stats.taken +
            " of " +
            rep.stats.sched +
            "</small></div>" +
            '<div class="bar ' +
            insBarCls(rep.stats.pct) +
            '" style="margin-top:8px"><i style="width:' +
            rep.stats.pct +
            '%"></i></div></div>'
          : "") +
        (rep.kind === "lab"
          ? '<p class="tiny muted" style="margin:10px 0 0">' +
            rep.stats.markers +
            " markers on this draw · " +
            rep.stats.flagged +
            " flagged · compared with " +
            (rep.stats.draws - 1) +
            " earlier draw" +
            (rep.stats.draws === 2 ? "" : "s") +
            "</p>"
          : "") +
        (rep.ratingWhy
          ? '<p class="tiny muted" style="margin:10px 0 0">Rating set by the app: ' +
            Ht(rep.ratingWhy) +
            "</p>"
          : "") +
        "</div></div>",
    ),
  );
  if (rep.flags) el.appendChild(insFlagPanel(rep.flags, a.flag_notes));

  if (rep.kind === "protocol") {
    var byName = {};
    (rep.stats.rows || []).forEach(function (x) {
      byName[x.name.toLowerCase()] = x;
    });
    var grid = Bt('<div class="grid2"></div>');
    (rep.guides || a.compounds || []).forEach(function (cmp) {
      var st0 = byName[String(cmp.name).toLowerCase()] || null;
      grid.appendChild(
        Bt(
          '<div class="panel"><div class="pbody">' +
            '<div class="spread" style="margin-bottom:2px"><b style="font-size:17px">' +
            Ht(cmp.name) +
            '</b><span class="pill ins-st-' +
            Ht(cmp.stage) +
            '">' +
            Ht(INS_STAGE[cmp.stage] || cmp.stage) +
            "</span></div>" +
            (st0
              ? '<div class="tiny muted" style="margin-bottom:10px">' +
                (st0.week ? "Week " + st0.week + " · " : "") +
                Ht(st0.dose) +
                " · " +
                Ht(st0.schedule) +
                "</div>" +
                (st0.sched
                  ? '<div class="spread tiny" style="margin-bottom:4px"><span class="muted">Logged</span><b class="mono">' +
                    st0.taken +
                    " of " +
                    st0.sched +
                    " · " +
                    st0.pct +
                    '%</b></div><div class="bar ' +
                    insBarCls(st0.pct) +
                    '" style="margin-bottom:12px"><i style="width:' +
                    st0.pct +
                    '%"></i></div>'
                  : "")
              : "") +
            (cmp.expect
              ? '<p style="margin:0 0 10px">' + Ht(cmp.expect) + "</p>"
              : '<p class="tiny" style="margin:0 0 10px;color:var(--due)">No write-up for this compound yet. Press Write again.</p>') +
            ((cmp.watch || []).length
              ? '<div class="eyebrow" style="margin:0 0 6px">Watch for</div><div class="ins-watch">' +
                cmp.watch
                  .map(function (w) {
                    return '<span class="pill">' + Ht(w) + "</span>";
                  })
                  .join("") +
                "</div>"
              : "") +
            (cmp.tip ? '<div class="ins-tip"><span>✦</span><span>' + Ht(cmp.tip) + "</span></div>" : "") +
            "</div></div>",
        ),
      );
    });
    if (grid.children.length) {
      el.appendChild(Bt('<div class="eyebrow" style="margin:4px 0 -6px">Each compound</div>'));
      el.appendChild(grid);
    }
    if ((a.interactions || []).length) el.appendChild(Bt(insNotes("Overlaps in the stack", a.interactions)));
    if ((a.lab_notes || []).length) el.appendChild(Bt(insNotes("Your labs and this stack", a.lab_notes)));
    if ((a.recommendations || []).length) el.appendChild(Bt(insRecs(a.recommendations)));
  } else {
    if ((a.findings || []).length)
      el.appendChild(
        Bt(
          '<div class="panel"><h2>Findings</h2><div class="pbody stack" style="gap:12px">' +
            a.findings
              .map(function (f) {
                return (
                  '<div><div class="spread"><b>' +
                  Ht(f.test) +
                  "</b>" +
                  insPill(f.status, INS_STATUS) +
                  '</div><p class="muted" style="margin:3px 0 0">' +
                  Ht(f.detail) +
                  "</p></div>"
                );
              })
              .join("") +
            "</div></div>",
        ),
      );
    if ((a.observations || []).length) el.appendChild(Bt(insNotes("Observations", a.observations)));
    if ((a.recommendations || []).length) el.appendChild(Bt(insRecs(a.recommendations)));
    if ((a.clinician_questions || []).length)
      el.appendChild(
        Bt(
          '<div class="panel"><h2>Questions for your clinician</h2><div class="pbody"><ol style="margin:0;padding-left:20px">' +
            a.clinician_questions
              .map(function (q) {
                return '<li style="padding:3px 0">' + Ht(q) + "</li>";
              })
              .join("") +
            "</ol></div></div>",
        ),
      );
  }
  el.appendChild(
    Bt(
      '<p class="tiny muted" style="margin:0">Written by AI from your own log. It can misread or miss things, so check anything surprising against your records. A log, not medical advice.</p>',
    ),
  );
  return el;
}
