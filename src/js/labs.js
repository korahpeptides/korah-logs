/* Korah Logs — Labs tab (personal build). Uses the app's shared helpers at call time. */
var LAB_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 3h6M10 3v5.5L5.2 17.2A2.6 2.6 0 0 0 7.5 21h9a2.6 2.6 0 0 0 2.3-3.8L14 8.5V3"/><circle cx="10" cy="15.5" r="1"/><circle cx="14" cy="17.5" r=".8"/></svg>';
var LAB_STATUS_TEXT = {
  hi: "Above lab range",
  lo: "Below lab range",
  tgt: "Off your target",
  ok: "In range",
  "": "",
};

function labTests() {
  return (d.labTests || []).slice().sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });
}
function labDraws() {
  return (d.labDraws || []).slice().sort(function (a, b) {
    return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.time || "") < (b.time || "") ? -1 : 1;
  });
}
function labUnit(t) {
  return String(t.unit || "")
    .split(" – ")[0]
    .trim();
}
function labNum(v) {
  var s = String(v == null ? "" : v)
    .replace(/−/g, "-")
    .trim();
  var m = s.match(/^([<>≤≥]?)\s*([-+]?\d*\.?\d+)/);
  if (!m) return null;
  return { n: parseFloat(m[2]), q: m[1] };
}
function labNumOk(x) {
  return x !== null && x !== undefined && x !== "" && isFinite(x);
}
function labStatus(t, v) {
  var p = labNum(v);
  if (!p) return "";
  var n = p.n,
    lo = t.lo,
    hi = t.hi,
    tlo = t.tlo,
    thi = t.thi;
  var hasLo = labNumOk(lo),
    hasHi = labNumOk(hi);
  if (p.q === "<" || p.q === "≤") {
    // "<0.1": the true value is at or below n
    if (hasLo && n <= +lo) return "lo";
    if (hasHi && n <= +hi) return labNumOk(tlo) && n <= +tlo ? "tgt" : "ok";
  }
  if (hasLo && n < +lo) return "lo";
  if (hasHi && n > +hi) return "hi";
  if (labNumOk(tlo) && n < +tlo) return "tgt";
  if (labNumOk(thi) && n > +thi) return "tgt";
  if (hasLo || hasHi || labNumOk(tlo) || labNumOk(thi)) return "ok";
  return "";
}
function labCls(st) {
  return st === "hi" || st === "lo" ? "lab-bad" : st === "tgt" ? "lab-tgt" : st === "ok" ? "lab-ok" : "";
}
function labSeries(id) {
  var out = [];
  labDraws().forEach(function (dr) {
    var v = dr.results && dr.results[id];
    if (v === undefined || v === null || String(v).trim() === "") return;
    out.push({ draw: dr, raw: String(v), p: labNum(v) });
  });
  return out;
}
function labTargetText(t) {
  var a = [];
  if (labNumOk(t.tlo)) a.push("at least " + t.tlo);
  if (labNumOk(t.thi)) a.push("under " + t.thi);
  return a.length ? a.join(" and ") + " " + labUnit(t) : "";
}
function labFmtDate(iso) {
  return de(iso);
}
function labShortDate(iso) {
  var x = ee(iso);
  return le[x.getMonth()] + " " + x.getDate() + " '" + String(x.getFullYear()).slice(2);
}
function labTime(tm) {
  var u = ue(tm);
  return u ? u.t + (u.ap ? " " + u.ap : "") : "";
}
function labCond(dr) {
  var a = [];
  if (dr.time) a.push(labTime(dr.time));
  if (dr.fasted) a.push(dr.fasted === "yes" ? "fasted" : "not fasted");
  if (dr.workout) a.push(dr.workout === "yes" ? "worked out before" : "no workout before");
  if (dr.weight) a.push(dr.weight + " lb");
  return a.join(" · ");
}

/* Start / stop dates from the shot log: a gap of more than 21 days counts as a stop. */
function labEvents() {
  var by = {};
  (d.logs || []).forEach(function (l) {
    if (!l || l.status !== "taken" || !l.compoundId) return;
    var dt = l.date || String(l.at || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dt)) return;
    (by[l.compoundId] = by[l.compoundId] || []).push(dt);
  });
  var ev = [],
    today = te();
  Object.keys(by).forEach(function (cid) {
    var name = pt(cid) || "Compound";
    var ds = Array.from(new Set(by[cid])).sort();
    var start = ds[0],
      prev = ds[0];
    for (var i = 1; i <= ds.length; i++) {
      var cur = ds[i];
      if (cur === undefined || ae(prev, cur) > 21) {
        ev.push({ date: start, kind: "start", name: name });
        if (cur !== undefined || ae(prev, today) > 21) ev.push({ date: prev, kind: "stop", name: name });
        start = cur;
      }
      prev = cur;
    }
  });
  return ev.sort(function (a, b) {
    return a.date < b.date ? -1 : 1;
  });
}

/* ---------- charts ---------- */
function labSpark(t, ser) {
  var pts = ser.filter(function (x) {
    return x.p;
  });
  if (pts.length < 2)
    return '<div class="lab-spark lab-spark-none tiny muted">' + (pts.length ? "1 result" : "") + "</div>";
  var W = 120,
    H = 30,
    vals = pts.map(function (x) {
      return x.p.n;
    });
  var lo = Math.min.apply(null, vals),
    hi = Math.max.apply(null, vals);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  var y = function (v) {
    return H - 4 - ((v - lo) / (hi - lo)) * (H - 8);
  };
  var x = function (i) {
    return 4 + (i / (pts.length - 1)) * (W - 8);
  };
  var path = pts
    .map(function (p, i) {
      return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.p.n).toFixed(1);
    })
    .join(" ");
  var dots = pts
    .map(function (p, i) {
      return (
        '<circle cx="' +
        x(i).toFixed(1) +
        '" cy="' +
        y(p.p.n).toFixed(1) +
        '" r="2.4" class="lab-dot ' +
        labCls(labStatus(t, p.raw)) +
        '"/>'
      );
    })
    .join("");
  return (
    '<svg class="lab-spark" viewBox="0 0 ' +
    W +
    " " +
    H +
    '" width="' +
    W +
    '" height="' +
    H +
    '" aria-hidden="true"><path d="' +
    path +
    '" fill="none" stroke="var(--ink-3)" stroke-width="1.2"/>' +
    dots +
    "</svg>"
  );
}
function labChart(t, ser, events) {
  var pts = ser.filter(function (x) {
    return x.p;
  });
  if (!pts.length) return '<p class="tiny muted" style="margin:0">No numeric results to chart.</p>';
  var narrow = window.innerWidth < 600,
    W = narrow ? 380 : 720,
    H = narrow ? 250 : 240,
    L = narrow ? 40 : 46,
    R = 10,
    T = 26,
    B = 30;
  var t0 = ee(pts[0].draw.date).getTime(),
    t1 = ee(pts[pts.length - 1].draw.date).getTime();
  var pad = Math.max((t1 - t0) * 0.04, 20 * 864e5);
  t0 -= pad;
  t1 += pad;
  var vals = pts.map(function (x) {
    return x.p.n;
  });
  [t.lo, t.hi, t.tlo, t.thi].forEach(function (v) {
    if (labNumOk(v)) vals.push(+v);
  });
  var vmin = Math.min.apply(null, vals),
    vmax = Math.max.apply(null, vals);
  var span = vmax - vmin || Math.abs(vmax) || 1;
  vmin -= span * 0.12;
  vmax += span * 0.12;
  if (
    Math.min.apply(
      null,
      pts.map(function (x) {
        return x.p.n;
      }),
    ) >= 0 &&
    vmin < 0
  )
    vmin = 0;
  var X = function (ms) {
    return L + ((ms - t0) / (t1 - t0)) * (W - L - R);
  };
  var Y = function (v) {
    return T + ((vmax - v) / (vmax - vmin)) * (H - T - B);
  };
  var g = "";
  // lab range band
  var bandTop = labNumOk(t.hi) ? Y(+t.hi) : T,
    bandBot = labNumOk(t.lo) ? Y(+t.lo) : H - B;
  if (labNumOk(t.hi) || labNumOk(t.lo))
    g +=
      '<rect x="' +
      L +
      '" y="' +
      Math.max(T, bandTop).toFixed(1) +
      '" width="' +
      (W - L - R) +
      '" height="' +
      Math.max(0, Math.min(H - B, bandBot) - Math.max(T, bandTop)).toFixed(1) +
      '" fill="var(--done-soft)"/>';
  [
    ["lo", t.lo],
    ["hi", t.hi],
  ].forEach(function (a) {
    if (labNumOk(a[1]))
      g +=
        '<line x1="' +
        L +
        '" x2="' +
        (W - R) +
        '" y1="' +
        Y(+a[1]).toFixed(1) +
        '" y2="' +
        Y(+a[1]).toFixed(1) +
        '" stroke="var(--done)" stroke-width="1" opacity=".6"/>';
  });
  [t.tlo, t.thi].forEach(function (v) {
    if (labNumOk(v))
      g +=
        '<line x1="' +
        L +
        '" x2="' +
        (W - R) +
        '" y1="' +
        Y(+v).toFixed(1) +
        '" y2="' +
        Y(+v).toFixed(1) +
        '" stroke="var(--due)" stroke-width="1.2" stroke-dasharray="5 4"/>';
  });
  // y ticks
  for (var k = 0; k <= 4; k++) {
    var v = vmin + ((vmax - vmin) * k) / 4,
      yy = Y(v);
    g +=
      '<line x1="' +
      L +
      '" x2="' +
      (W - R) +
      '" y1="' +
      yy.toFixed(1) +
      '" y2="' +
      yy.toFixed(1) +
      '" stroke="var(--rule-soft)" stroke-width=".6"/>';
    g +=
      '<text x="' +
      (L - 6) +
      '" y="' +
      (yy + 3.5).toFixed(1) +
      '" text-anchor="end" font-size="10" style="font-family:var(--mono)" fill="var(--ink-3)">' +
      fe(v, Math.abs(vmax - vmin) < 2 ? 2 : Math.abs(vmax - vmin) < 20 ? 1 : 0) +
      "</text>";
  }
  // x ticks: each year/half-year boundary
  var d0 = new Date(t0),
    d1 = new Date(t1),
    cur = new Date(d0.getFullYear(), d0.getMonth() + 1, 1);
  var months = (d1.getFullYear() - d0.getFullYear()) * 12 + d1.getMonth() - d0.getMonth();
  var step = months > 30 ? 6 : months > 12 ? 3 : months > 5 ? 2 : 1;
  while (cur.getMonth() % step) cur.setMonth(cur.getMonth() + 1);
  while (cur.getTime() < t1) {
    var xx = X(cur.getTime());
    g +=
      '<line x1="' +
      xx.toFixed(1) +
      '" x2="' +
      xx.toFixed(1) +
      '" y1="' +
      (H - B) +
      '" y2="' +
      (H - B + 4) +
      '" stroke="var(--ink-3)"/>';
    g +=
      '<text x="' +
      xx.toFixed(1) +
      '" y="' +
      (H - B + 16) +
      '" text-anchor="middle" font-size="10" style="font-family:var(--mono)" fill="var(--ink-3)">' +
      le[cur.getMonth()] +
      (cur.getMonth() === 0 || step >= 3 ? " '" + String(cur.getFullYear()).slice(2) : "") +
      "</text>";
    cur.setMonth(cur.getMonth() + step);
  }
  g +=
    '<line x1="' +
    L +
    '" x2="' +
    (W - R) +
    '" y1="' +
    (H - B) +
    '" y2="' +
    (H - B) +
    '" stroke="var(--rule)"/>';
  // dose markers
  var shown = (events || []).filter(function (e) {
    var ms = ee(e.date).getTime();
    return ms >= t0 && ms <= t1;
  });
  shown.forEach(function (e, i) {
    var xx = X(ee(e.date).getTime()).toFixed(1),
      yTop = 6 + (i % 2) * 11;
    g +=
      '<line x1="' +
      xx +
      '" x2="' +
      xx +
      '" y1="' +
      (yTop + 6) +
      '" y2="' +
      (H - B) +
      '" stroke="var(--signal)" stroke-width="1" stroke-dasharray="2 3" opacity=".7"/>';
    g +=
      '<text x="' +
      xx +
      '" y="' +
      (yTop + 4) +
      '" text-anchor="middle" font-size="9.5" font-weight="600" style="font-family:var(--mono)" fill="var(--signal)">' +
      (i + 1) +
      "</text>";
  });
  // line + points
  g +=
    '<path d="' +
    pts
      .map(function (p, i) {
        return (i ? "L" : "M") + X(ee(p.draw.date).getTime()).toFixed(1) + " " + Y(p.p.n).toFixed(1);
      })
      .join(" ") +
    '" fill="none" stroke="var(--ink-2)" stroke-width="1.6" stroke-linejoin="round"/>';
  pts.forEach(function (p) {
    var st = labStatus(t, p.raw);
    g +=
      '<circle cx="' +
      X(ee(p.draw.date).getTime()).toFixed(1) +
      '" cy="' +
      Y(p.p.n).toFixed(1) +
      '" r="4.6" class="lab-dot ' +
      labCls(st) +
      '" stroke="var(--surface)" stroke-width="1.5"><title>' +
      Ht(labFmtDate(p.draw.date) + ": " + p.raw + " " + labUnit(t)) +
      "</title></circle>";
  });
  var leg = shown.length
    ? '<ol class="lab-evlist">' +
      shown
        .map(function (e) {
          return (
            "<li><b>" +
            (e.kind === "start" ? "Started" : "Stopped") +
            "</b> " +
            Ht(e.name) +
            ' <span class="muted">' +
            Ht(labFmtDate(e.date)) +
            "</span></li>"
          );
        })
        .join("") +
      "</ol>"
    : "";
  return (
    '<svg viewBox="0 0 ' +
    W +
    " " +
    H +
    '" width="100%" role="img" aria-label="' +
    Ht(t.name) +
    ' over time">' +
    g +
    "</svg>" +
    leg
  );
}

/* ---------- views ---------- */
function labView() {
  r.labView = r.labView || "tests";
  if (r.labHelp) return labHelpView();
  if (
    r.labTest &&
    (d.labTests || []).some(function (t) {
      return t.id === r.labTest;
    })
  )
    return labDetail(r.labTest);
  r.labTest = null;
  var el = Bt('<div class="stack lab-root"></div>');
  var tests = labTests(),
    draws = labDraws();
  el.appendChild(
    Bt(
      '<div class="head"><div><h1>Labs</h1><p>Every blood draw in one place, checked against the lab range and your own targets. Start and stop dates from your shot log show on each chart.</p></div>' +
        '<div class="row" style="flex-wrap:wrap;gap:8px"><button class="btn" id="lab-paste">Paste from AI</button><button class="btn ghost" id="lab-imp">Import file</button><button class="btn ghost" id="lab-newdraw">Add a draw</button></div></div>',
    ),
  );
  el.appendChild(
    Bt(
      '<p class="tiny" style="margin:-8px 0 0"><a href="#" data-labhelp="1">How to fill this in with an AI app</a></p>',
    ),
  );
  var file = Bt('<input type="file" accept=".json,application/json" hidden id="lab-file">');
  el.appendChild(file);
  file.addEventListener("change", labImport);
  el.querySelector("#lab-imp").addEventListener("click", function () {
    file.click();
  });
  el.querySelector("#lab-newdraw").addEventListener("click", function () {
    labDrawForm();
  });
  el.querySelector("#lab-paste").addEventListener("click", labPasteForm);
  if (!tests.length) {
    var em = Bt(
      '<div class="panel"><div class="empty"><b>No lab results yet</b>The quick way in: an AI chat app reads your lab reports and you paste its answer here.<br><br>' +
        '<button class="btn" data-labhelp="1">Show me how</button><br><br><span class="tiny">Or type them in: press <a href="#" id="lab-emtest">Add a test</a> for each test, then Add a draw.</span></div></div>',
    );
    em.querySelector("#lab-emtest").addEventListener("click", function (e) {
      e.preventDefault();
      labTestForm();
    });
    el.appendChild(em);
    return el;
  }
  // summary of latest values
  var cnt = { bad: 0, tgt: 0, ok: 0 },
    flagged = [];
  tests.forEach(function (t) {
    var s = labSeries(t.id);
    if (!s.length) return;
    var nn = s.filter(function (x) {
        return x.p;
      }),
      last = nn.length ? nn[nn.length - 1] : s[s.length - 1],
      st = labStatus(t, last.raw);
    if (st === "hi" || st === "lo") {
      cnt.bad++;
      flagged.push([t, last, st]);
    } else if (st === "tgt") {
      cnt.tgt++;
      flagged.push([t, last, st]);
    } else if (st === "ok") cnt.ok++;
  });
  var hasTgt = tests.some(function (t) {
    return labNumOk(t.tlo) || labNumOk(t.thi);
  });
  var lastDraw = draws[draws.length - 1];
  el.appendChild(
    Bt(
      '<div class="lab-sum">' +
        '<div class="panel lab-tile"><div class="tiny muted">Latest draw</div><div class="lab-big">' +
        (lastDraw ? Ht(labFmtDate(lastDraw.date)) : "—") +
        '</div><div class="tiny muted">' +
        draws.length +
        " draws · " +
        tests.length +
        " tests</div></div>" +
        '<div class="panel lab-tile"><div class="tiny muted">Most recent result of each test</div><div class="lab-counts"><span class="lab-bad"><b>' +
        cnt.bad +
        "</b> out of lab range</span>" +
        (hasTgt ? '<span class="lab-tgt"><b>' + cnt.tgt + "</b> off your target</span>" : "") +
        '<span class="lab-ok"><b>' +
        cnt.ok +
        "</b> in range</span></div></div></div>",
    ),
  );
  // controls
  var v = r.labView;
  var ctl = Bt(
    '<div class="lab-ctl"><div class="seg" id="lab-seg"><button data-lv="tests" aria-pressed="' +
      (v === "tests") +
      '">By test</button><button data-lv="table" aria-pressed="' +
      (v === "table") +
      '">Table</button><button data-lv="draws" aria-pressed="' +
      (v === "draws") +
      '">Draws</button></div>' +
      (v !== "draws"
        ? '<label class="check" style="margin:0"><input type="checkbox" id="lab-flag" ' +
          (r.labFlag ? "checked" : "") +
          '><span>Flagged only</span></label><input id="lab-q" class="lab-q" type="search" placeholder="Find a test" value="' +
          Ht(r.labQ || "") +
          '">'
        : "") +
      '<span class="lab-legend tiny"><span class="lab-bad">● Out of lab range</span>' +
      (hasTgt ? '<span class="lab-tgt">● Off your target</span>' : "") +
      '<span class="lab-ok">● In range</span></span></div>',
  );
  ctl.querySelectorAll("[data-lv]").forEach(function (b) {
    b.addEventListener("click", function () {
      r.labView = b.dataset.lv;
      Ua();
    });
  });
  var fl = ctl.querySelector("#lab-flag");
  if (fl)
    fl.addEventListener("change", function () {
      r.labFlag = fl.checked;
      Ua();
    });
  el.appendChild(ctl);
  var body =
    v === "table" ? labTable(tests, draws) : v === "draws" ? labDrawList(draws, tests) : labByTest(tests);
  el.appendChild(body);
  var q = ctl.querySelector("#lab-q");
  if (q) {
    var apply = function () {
      r.labQ = q.value;
      var s = q.value.trim().toLowerCase();
      body.querySelectorAll("[data-lname]").forEach(function (n) {
        n.hidden = !!s && n.dataset.lname.indexOf(s) < 0;
      });
      body.querySelectorAll("[data-lgroup]").forEach(function (g) {
        g.hidden = !g.querySelector("[data-lname]:not([hidden])");
      });
    };
    q.addEventListener("input", apply);
    if (q.value) apply();
  }
  el.appendChild(
    Bt(
      '<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn ghost sm" id="lab-newtest">Add a test</button><button class="btn ghost sm" id="lab-csv">Download as spreadsheet (CSV)</button></div>',
    ),
  );
  el.querySelector("#lab-newtest").addEventListener("click", function () {
    labTestForm();
  });
  el.querySelector("#lab-csv").addEventListener("click", labCsv);
  el.appendChild(
    Bt(
      '<p class="tiny muted" style="margin:0">A log, not medical advice. Ranges are the ones on your lab reports; your ordering clinicians interpret them.</p>',
    ),
  );
  return el;
}
function labGroups(tests) {
  var gs = [],
    idx = {};
  tests.forEach(function (t) {
    var g = t.group || "Other";
    if (!(g in idx)) {
      idx[g] = gs.length;
      gs.push([g, []]);
    }
    gs[idx[g]][1].push(t);
  });
  return gs;
}
function labByTest(tests) {
  var wrap = Bt('<div class="stack"></div>');
  labGroups(tests).forEach(function (gr) {
    var rows = "";
    gr[1].forEach(function (t) {
      var s = labSeries(t.id);
      if (!s.length) return;
      var num = s.filter(function (x) {
          return x.p;
        }),
        last = num.length ? num[num.length - 1] : s[s.length - 1],
        prev = num.length > 1 ? num[num.length - 2] : null,
        st = labStatus(t, last.raw);
      if (r.labFlag && !(st === "hi" || st === "lo" || st === "tgt")) return;
      var delta = "";
      if (prev && prev.p && last.p) {
        var dv = last.p.n - prev.p.n,
          pst = labStatus(t, prev.raw);
        var fixed = (pst === "hi" || pst === "lo" || pst === "tgt") && st === "ok";
        delta =
          (dv ? (dv > 0 ? "▲ " : "▼ ") + fe(Math.abs(dv), 3) : "no change") +
          " since " +
          labShortDate(prev.draw.date) +
          (fixed ? ' · <span class="lab-ok"><b>back in range</b></span>' : "");
      }
      rows +=
        '<button class="lab-row" data-ltest="' +
        t.id +
        '" data-lname="' +
        Ht(t.name.toLowerCase()) +
        '">' +
        '<span class="lab-name"><b>' +
        Ht(t.name) +
        '</b><span class="tiny muted">' +
        Ht(t.range || "") +
        (t.calc ? " · calculated" : "") +
        "</span></span>" +
        labSpark(t, s) +
        '<span class="lab-val"><span><span class="lab-num ' +
        labCls(st) +
        '">' +
        Ht(last.p ? last.raw.split("/")[0] : last.raw) +
        '</span> <span class="tiny muted">' +
        Ht(last.p ? labUnit(t) : "") +
        "</span></span>" +
        '<span class="tiny muted lab-when">' +
        Ht(labShortDate(last.draw.date)) +
        (delta ? " · " + delta : "") +
        "</span></span></button>";
    });
    if (!rows) return;
    var p = Bt(
      '<div class="panel" data-lgroup="1"><h2>' +
        Ht(gr[0]) +
        '</h2><div class="lab-rows">' +
        rows +
        "</div></div>",
    );
    wrap.appendChild(p);
  });
  if (!wrap.children.length)
    wrap.appendChild(
      Bt(
        '<div class="panel"><div class="empty"><b>Nothing flagged</b>Every test\'s most recent result is in range.</div></div>',
      ),
    );
  wrap.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ltest]");
    if (b) {
      r.labTest = b.dataset.ltest;
      Ua();
    }
  });
  return wrap;
}
function labTable(tests, draws) {
  var head =
    '<tr><th class="lab-stick">Test</th>' +
    draws
      .map(function (dr) {
        return (
          '<th class="num"><button class="lab-dh" data-ldraw="' +
          dr.id +
          '">' +
          Ht(labShortDate(dr.date)) +
          '</button><div class="tiny muted" style="font-weight:400">' +
          Ht(
            [dr.time ? labTime(dr.time) : "", dr.workout === "yes" ? "workout" : ""]
              .filter(Boolean)
              .join(" · "),
          ) +
          "</div></th>"
        );
      })
      .join("") +
    "</tr>";
  var body = "";
  labGroups(tests).forEach(function (gr) {
    var rows = "";
    gr[1].forEach(function (t) {
      var s = labSeries(t.id);
      if (!s.length) return;
      if (
        r.labFlag &&
        !s.some(function (x) {
          var st = labStatus(t, x.raw);
          return st === "hi" || st === "lo" || st === "tgt";
        })
      )
        return;
      rows +=
        '<tr data-lname="' +
        Ht(t.name.toLowerCase()) +
        '"><td class="lab-stick"><button class="lab-tn" data-ltest="' +
        t.id +
        '">' +
        Ht(t.name) +
        '</button><div class="tiny muted">' +
        Ht(labUnit(t)) +
        " · " +
        Ht(t.range || "") +
        "</div></td>" +
        draws
          .map(function (dr) {
            var v = dr.results && dr.results[t.id];
            return '<td class="num ' + labCls(v ? labStatus(t, v) : "") + '">' + (v ? Ht(v) : "") + "</td>";
          })
          .join("") +
        "</tr>";
    });
    if (rows)
      body +=
        '<tbody data-lgroup="1"><tr class="lab-grp"><td class="lab-stick" colspan="1">' +
        Ht(gr[0]) +
        '</td><td colspan="' +
        draws.length +
        '"></td></tr>' +
        rows +
        "</tbody>";
  });
  var p = Bt(
    '<div class="panel lab-tablewrap"><table class="lab-table"><thead>' +
      head +
      "</thead>" +
      body +
      "</table></div>",
  );
  p.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ltest]");
    if (b) {
      r.labTest = b.dataset.ltest;
      Ua();
      return;
    }
    var dd = e.target.closest("[data-ldraw]");
    if (dd) labDrawForm(dd.dataset.ldraw);
  });
  return p;
}
function labDrawList(draws, tests) {
  var byId = {};
  tests.forEach(function (t) {
    byId[t.id] = t;
  });
  var wrap = Bt(
    '<div class="panel" style="overflow:auto"><table><thead><tr><th>Date</th><th>Conditions</th><th class="num">Results</th><th class="num">Flagged</th><th>Notes</th><th></th></tr></thead><tbody></tbody></table></div>',
  );
  var tb = wrap.querySelector("tbody");
  draws
    .slice()
    .reverse()
    .forEach(function (dr) {
      var ids = Object.keys(dr.results || {}),
        fl = 0;
      ids.forEach(function (id) {
        var t = byId[id];
        if (t) {
          var st = labStatus(t, dr.results[id]);
          if (st === "hi" || st === "lo") fl++;
        }
      });
      tb.appendChild(
        Bt(
          "<tr><td><b>" +
            Ht(labFmtDate(dr.date)) +
            '</b></td><td class="tiny">' +
            Ht(labCond(dr)) +
            (dr.statin ? '<div class="muted">' + Ht(dr.statin) + "</div>" : "") +
            '</td><td class="num">' +
            ids.length +
            '</td><td class="num ' +
            (fl ? "lab-bad" : "") +
            '">' +
            (fl || "—") +
            '</td><td class="tiny">' +
            Ht([dr.label, dr.notes].filter(Boolean).join(" — ")) +
            '</td><td class="num"><button class="btn ghost sm" data-ldraw="' +
            dr.id +
            '">Edit</button></td></tr>',
        ),
      );
    });
  wrap.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ldraw]");
    if (b) labDrawForm(b.dataset.ldraw);
  });
  return wrap;
}
function labDetail(id) {
  var t = d.labTests.find(function (x) {
    return x.id === id;
  });
  var s = labSeries(id),
    ev = labEvents();
  var el = Bt('<div class="stack lab-root"></div>');
  el.appendChild(
    Bt(
      '<div class="head"><div><button class="btn ghost sm" id="lab-back" style="margin-bottom:8px">‹ All labs</button><h1>' +
        Ht(t.name) +
        '</h1></div><button class="btn ghost" id="lab-edit">Edit test</button></div>',
    ),
  );
  el.querySelector("#lab-back").addEventListener("click", function () {
    r.labTest = null;
    Ua();
  });
  el.querySelector("#lab-edit").addEventListener("click", function () {
    labTestForm(id);
  });
  var tgt = labTargetText(t);
  el.appendChild(
    Bt(
      '<div class="panel"><div class="pbody lab-facts">' +
        '<div><div class="tiny muted">Lab range</div><b>' +
        Ht(t.range || "—") +
        "</b></div>" +
        '<div><div class="tiny muted">Units</div><b>' +
        Ht(t.unit || "—") +
        "</b></div>" +
        (tgt
          ? '<div><div class="tiny muted">Your target</div><b class="lab-tgt">' + Ht(tgt) + "</b></div>"
          : "") +
        (t.calc ? '<div><div class="tiny muted">Source</div><b>Calculated, not lab-reported</b></div>' : "") +
        (t.desc
          ? '<div class="lab-what"><div class="tiny muted">What it measures</div><b>' +
            Ht(t.desc) +
            "</b></div>"
          : "") +
        "</div></div>",
    ),
  );
  el.appendChild(
    Bt(
      '<div class="panel"><h2>Over time<span class="tiny lab-legend"><span class="lab-band">▮ lab range</span>' +
        (tgt ? '<span class="lab-tgt">- - your target</span>' : "") +
        '<span style="color:var(--signal)">┆ start/stop</span></span></h2><div class="pbody">' +
        labChart(t, s, ev) +
        "</div></div>",
    ),
  );
  // results table with what changed between draws
  var rows = "";
  for (var i = s.length - 1; i >= 0; i--) {
    var x = s[i],
      st = labStatus(t, x.raw),
      from = i > 0 ? s[i - 1].draw.date : null;
    var ch = from
      ? ev.filter(function (e) {
          return e.date > from && e.date <= x.draw.date;
        })
      : [];
    var chs = ch
      .map(function (e) {
        return (e.kind === "start" ? "Started " : "Stopped ") + Ht(e.name);
      })
      .join("<br>");
    rows +=
      "<tr><td><b>" +
      Ht(labFmtDate(x.draw.date)) +
      '</b><div class="tiny muted">' +
      Ht(labCond(x.draw)) +
      "</div>" +
      (chs ? '<div class="tiny lab-chm">' + chs + "</div>" : "") +
      "</td>" +
      '<td class="num"><span class="lab-num ' +
      labCls(st) +
      '">' +
      Ht(x.raw) +
      '</span></td><td class="tiny ' +
      labCls(st) +
      '">' +
      Ht(LAB_STATUS_TEXT[st] || "") +
      "</td>" +
      '<td class="tiny lab-chc">' +
      (chs || '<span class="muted">—</span>') +
      "</td></tr>";
  }
  el.appendChild(
    Bt(
      '<div class="panel" style="overflow:auto"><h2>Results<span class="tiny muted">value as reported' +
        (String(t.unit).indexOf(" – ") > 0 ? " · Canada / US" : "") +
        '</span></h2><table class="lab-res"><thead><tr><th>Draw</th><th class="num">Result</th><th></th><th class="lab-chc">Changes in your log since the draw before</th></tr></thead><tbody>' +
        rows +
        "</tbody></table></div>",
    ),
  );
  if (t.notes)
    el.appendChild(
      Bt('<div class="panel"><h2>Notes</h2><div class="pbody lab-notes">' + Ht(t.notes) + "</div></div>"),
    );
  return el;
}

/* ---------- forms ---------- */
function labOpt(v, cur) {
  return ["", "yes", "no"]
    .map(function (o) {
      return (
        '<option value="' +
        o +
        '"' +
        (o === (cur || "") ? " selected" : "") +
        ">" +
        (o ? o[0].toUpperCase() + o.slice(1) : "—") +
        "</option>"
      );
    })
    .join("");
}
function labDrawForm(id) {
  var dr = id
    ? JSON.parse(
        JSON.stringify(
          d.labDraws.find(function (x) {
            return x.id === id;
          }),
        ),
      )
    : {
        id: "draw-" + ve(),
        date: te(),
        time: "",
        label: "",
        workout: "",
        fasted: "",
        weight: "",
        statin: "",
        notes: "",
        results: {},
      };
  var tests = labTests();
  var fields = labGroups(tests)
    .map(function (gr) {
      return (
        '<fieldset class="lab-fs"><legend>' +
        Ht(gr[0]) +
        '</legend><div class="lab-fgrid">' +
        gr[1]
          .map(function (t) {
            return (
              '<div class="field"><label for="lr-' +
              t.id +
              '">' +
              Ht(t.name) +
              ' <span class="muted">(' +
              Ht(labUnit(t)) +
              ')</span></label><input id="lr-' +
              t.id +
              '" data-lr="' +
              t.id +
              '" value="' +
              Ht((dr.results || {})[t.id] || "") +
              '" placeholder="' +
              Ht(t.range || "") +
              '"></div>'
            );
          })
          .join("") +
        "</div></fieldset>"
      );
    })
    .join("");
  Vt(
    id ? "Edit draw" : "Add a draw",
    '<div class="fgrid3"><div class="field"><label for="ld-date">Date</label><input id="ld-date" type="date" value="' +
      Ht(dr.date) +
      '"></div>' +
      '<div class="field"><label for="ld-time">Time drawn</label><input id="ld-time" type="time" value="' +
      Ht(dr.time) +
      '"></div>' +
      '<div class="field"><label for="ld-wt">Body weight <span class="muted">(lb)</span></label><input id="ld-wt" type="number" step="any" value="' +
      Ht(dr.weight) +
      '"></div>' +
      '<div class="field"><label for="ld-fast">Fasted</label><select id="ld-fast">' +
      labOpt("", dr.fasted) +
      "</select></div>" +
      '<div class="field"><label for="ld-wo">Worked out before</label><select id="ld-wo">' +
      labOpt("", dr.workout) +
      "</select></div>" +
      '<div class="field"><label for="ld-st">' + (COMMUNITY ? "Medications at the time" : "Statin / ezetimibe") + '</label><input id="ld-st" value="' +
      Ht(dr.statin) +
      '"></div></div>' +
      '<div class="field"><label for="ld-lab">Ordered by / panel</label><input id="ld-lab" value="' +
      Ht(dr.label) +
      '"></div>' +
      '<div class="field"><label for="ld-n">Notes</label><textarea id="ld-n">' +
      Ht(dr.notes) +
      "</textarea></div>" +
      '<p class="tiny muted" style="margin:4px 0 12px">Type results as the lab prints them. For a second unit use a slash (4.9/88). Leave blank anything not drawn. A value like &lt;0.1 is fine.</p>' +
      fields,
    (id ? '<button class="btn danger" id="ld-del">Delete draw</button>' : "") +
      '<button class="btn ghost" data-close>Cancel</button><button class="btn" id="ld-save">Save draw</button>',
  );
  var m = Ot("#modal");
  m.querySelector("#ld-save").addEventListener("click", function () {
    dr.date = m.querySelector("#ld-date").value || te();
    dr.time = m.querySelector("#ld-time").value;
    dr.weight = m.querySelector("#ld-wt").value;
    dr.fasted = m.querySelector("#ld-fast").value;
    dr.workout = m.querySelector("#ld-wo").value;
    dr.statin = m.querySelector("#ld-st").value.trim();
    dr.label = m.querySelector("#ld-lab").value.trim();
    dr.notes = m.querySelector("#ld-n").value;
    var res = {};
    m.querySelectorAll("[data-lr]").forEach(function (i) {
      var v = i.value.trim();
      if (v) res[i.dataset.lr] = v;
    });
    // keep results for tests that no longer exist rather than silently dropping them
    Object.keys(dr.results || {}).forEach(function (k) {
      if (
        !tests.some(function (t) {
          return t.id === k;
        })
      )
        res[k] = dr.results[k];
    });
    dr.results = res;
    d.labDraws = d.labDraws || [];
    var ix = d.labDraws.findIndex(function (x) {
      return x.id === dr.id;
    });
    ix >= 0 ? (d.labDraws[ix] = dr) : d.labDraws.push(dr);
    s();
    Rt();
    Ua();
    Ft("Draw saved.");
  });
  var del = m.querySelector("#ld-del");
  if (del)
    del.addEventListener("click", function () {
      if (del.dataset.sure !== "1") {
        del.dataset.sure = "1";
        del.textContent = "Press again to delete";
        return;
      }
      d.labDraws = d.labDraws.filter(function (x) {
        return x.id !== dr.id;
      });
      s();
      Rt();
      Ua();
      Ft("Draw deleted.");
    });
}
function labTestForm(id) {
  var t = id
    ? Object.assign(
        {},
        d.labTests.find(function (x) {
          return x.id === id;
        }),
      )
    : {
        id: "lab-" + ve(),
        name: "",
        group: "",
        desc: "",
        unit: "",
        range: "",
        lo: null,
        hi: null,
        tlo: null,
        thi: null,
        calc: false,
        notes: "",
        order:
          (d.labTests || []).reduce(function (a, x) {
            return Math.max(a, x.order || 0);
          }, 0) + 1,
      };
  var groups = Array.from(
    new Set(
      labTests()
        .map(function (x) {
          return x.group;
        })
        .filter(Boolean),
    ),
  );
  var nv = function (v) {
    return labNumOk(v) ? v : "";
  };
  Vt(
    id ? "Edit test" : "Add a test",
    '<div class="field"><label for="lt-name">Name</label><input id="lt-name" value="' +
      Ht(t.name) +
      '"></div>' +
      '<div class="fgrid3"><div class="field"><label for="lt-grp">Section</label><input id="lt-grp" list="lt-grps" value="' +
      Ht(t.group) +
      '"><datalist id="lt-grps">' +
      groups
        .map(function (g) {
          return '<option value="' + Ht(g) + '">';
        })
        .join("") +
      "</datalist></div>" +
      '<div class="field"><label for="lt-unit">Units</label><input id="lt-unit" value="' +
      Ht(t.unit) +
      '"></div>' +
      '<div class="field"><label for="lt-range">Range as printed</label><input id="lt-range" value="' +
      Ht(t.range) +
      '"></div></div>' +
      '<p class="tiny muted" style="margin:0 0 8px">The numbers below drive the colours, in the first unit listed. Leave a box blank if there is no limit on that side.</p>' +
      '<div class="fgrid3"><div class="field"><label for="lt-lo">Lab low limit</label><input id="lt-lo" type="number" step="any" value="' +
      nv(t.lo) +
      '"></div>' +
      '<div class="field"><label for="lt-hi">Lab high limit</label><input id="lt-hi" type="number" step="any" value="' +
      nv(t.hi) +
      '"></div><div></div>' +
      '<div class="field"><label for="lt-tlo">Your target: at least</label><input id="lt-tlo" type="number" step="any" value="' +
      nv(t.tlo) +
      '"></div>' +
      '<div class="field"><label for="lt-thi">Your target: under</label><input id="lt-thi" type="number" step="any" value="' +
      nv(t.thi) +
      '"></div></div>' +
      '<div class="field"><label for="lt-desc">What it measures</label><input id="lt-desc" value="' +
      Ht(t.desc) +
      '"></div>' +
      '<label class="check"><input type="checkbox" id="lt-calc" ' +
      (t.calc ? "checked" : "") +
      "><span>Calculated, not lab-reported</span></label>" +
      '<div class="field"><label for="lt-notes">Notes</label><textarea id="lt-notes" rows="5">' +
      Ht(t.notes) +
      "</textarea></div>",
    (id ? '<button class="btn danger" id="lt-del">Delete test</button>' : "") +
      '<button class="btn ghost" data-close>Cancel</button><button class="btn" id="lt-save">Save test</button>',
  );
  var m = Ot("#modal");
  var num = function (sel) {
    var v = m.querySelector(sel).value.trim();
    return v === "" ? null : parseFloat(v);
  };
  m.querySelector("#lt-save").addEventListener("click", function () {
    var name = m.querySelector("#lt-name").value.trim();
    if (!name) {
      m.querySelector("#lt-name").focus();
      return;
    }
    t.name = name;
    t.group = m.querySelector("#lt-grp").value.trim() || "Other";
    t.unit = m.querySelector("#lt-unit").value.trim();
    t.range = m.querySelector("#lt-range").value.trim();
    t.lo = num("#lt-lo");
    t.hi = num("#lt-hi");
    t.tlo = num("#lt-tlo");
    t.thi = num("#lt-thi");
    t.desc = m.querySelector("#lt-desc").value.trim();
    t.calc = m.querySelector("#lt-calc").checked;
    t.notes = m.querySelector("#lt-notes").value;
    d.labTests = d.labTests || [];
    var ix = d.labTests.findIndex(function (x) {
      return x.id === t.id;
    });
    ix >= 0 ? (d.labTests[ix] = t) : d.labTests.push(t);
    s();
    Rt();
    Ua();
    Ft("Test saved.");
  });
  var del = m.querySelector("#lt-del");
  if (del)
    del.addEventListener("click", function () {
      if (del.dataset.sure !== "1") {
        del.dataset.sure = "1";
        del.textContent = "Press again — removes its results too";
        return;
      }
      d.labTests = d.labTests.filter(function (x) {
        return x.id !== t.id;
      });
      (d.labDraws || []).forEach(function (dr) {
        if (dr.results && t.id in dr.results) {
          delete dr.results[t.id];
        }
      });
      r.labTest = null;
      s();
      Rt();
      Ua();
      Ft("Test deleted.");
    });
}

/* ---------- import / export ---------- */
/* ---------- import: file, paste from AI, how-to page ---------- */
var LAB_AI_PROMPT = [
  "I am attaching my blood test reports. Turn every result into JSON for my lab tracker app. Follow these rules exactly.",
  "",
  "Reply with the JSON only, in one code block, with nothing before or after it. Do not shorten it or leave tests out because it is long.",
  "",
  "Use this shape:",
  "{",
  '  "format": "korah-labs",',
  '  "version": 1,',
  '  "tests": [',
  '    {"id": "lab-ldl-cholesterol", "name": "LDL Cholesterol", "group": "Lipids", "unit": "mmol/L", "range": "<3.5", "lo": null, "hi": 3.5, "tlo": null, "thi": null, "desc": "Cholesterol carried in LDL particles.", "calc": true, "notes": "", "order": 1}',
  "  ],",
  '  "draws": [',
  '    {"id": "draw-2026-05-14", "date": "2026-05-14", "time": "08:30", "label": "", "fasted": "", "workout": "", "weight": "", "statin": "", "notes": "", "results": {"lab-ldl-cholesterol": "2.9"}}',
  "  ],",
  '  "unreadable": []',
  "}",
  "",
  "Rules:",
  '1. One entry in "tests" for each different test across all the reports. Use the test name exactly as the report prints it. A test that appears on several reports is still one entry.',
  '2. Test "id": "lab-" followed by the name in lower case, letters and numbers only, words joined by single hyphens. "Hemoglobin A1c" becomes "lab-hemoglobin-a1c".',
  '3. "group": the section heading the test sits under on the report (for example Lipids, Liver, Kidney, Hormones). If there is none, use "Other".',
  '4. "unit" and "range": exactly as printed. Do not convert units.',
  '5. "lo" and "hi": the low and high numbers of the reference range, as plain numbers. Use null for a side with no limit ("<3.5" means lo null, hi 3.5). If no range is printed, both are null.',
  '6. "tlo" and "thi": always null. Do not make up target values.',
  '7. "desc": one short plain-language sentence on what the test measures. No advice and no comment on my results.',
  '8. "calc": true only if the report marks the value as calculated (for example calculated LDL, eGFR, ratios). Otherwise false.',
  '9. "order": 1, 2, 3 and so on, in the order the tests appear on the most recent report.',
  '10. One entry in "draws" for each date blood was collected. "date" as YYYY-MM-DD. "time" as 24-hour HH:MM if the collection time is printed, otherwise "". Draw "id": "draw-" followed by the date; if two draws share a date, add "-2", "-3".',
  '11. "results": the keys are test ids and the values are the result exactly as printed, as text ("5.4", "<0.1", ">90"). Leave out any test not done that day. Never guess a value.',
  '12. "fasted": "yes" or "no" only if the report says so, otherwise "". Leave "workout", "weight", "statin" and "notes" as "".',
  '13. "label": the panel name or ordering clinic if printed, otherwise "". Do not put my name, health card number, date of birth or address anywhere.',
  '14. If you cannot read a value clearly, leave it out of "results" and add a line to "unreadable", such as "2026-05-14 Ferritin".',
  '15. Before you answer, check every value in "results" against the report a second time.',
].join("\n");

function labStr(v) {
  return v === null || v === undefined ? "" : String(v).trim();
}
function labNumOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  var n = parseFloat(String(v).replace(/[<>≤≥\s]/g, ""));
  return isFinite(n) ? n : null;
}
function labSlug(name) {
  return (
    "lab-" +
    String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

/* Pull the JSON out of whatever was pasted: code fences, a sentence before or after, all fine. */
function labParse(txt) {
  var s = String(txt || ""),
    a = s.indexOf("{"),
    b = s.lastIndexOf("}");
  if (a < 0)
    return { err: "No lab data found. Copy the whole reply from the AI app, starting at the first {." };
  var j;
  try {
    if (b <= a) throw 0;
    j = JSON.parse(s.slice(a, b + 1));
  } catch (x) {
    return {
      err: "That text could not be read. It may have been cut off. Copy the whole reply again, or ask the AI to send it again.",
    };
  }
  if (!j || !Array.isArray(j.tests))
    return {
      err: "That is not a labs import. Make sure the AI was given the instructions from the Labs how-to page.",
    };
  return { j: j };
}

/* Merge an import into the log. Nothing already here is deleted. On a test you already have,
   the lab's own facts (name, section, units, range) are updated, but your description, notes and
   targets are kept. On a draw you already have, results are added or updated one by one. */
function labApply(j) {
  d.labTests = d.labTests || [];
  d.labDraws = d.labDraws || [];
  d.metrics = d.metrics || [];
  var nt = 0,
    ut = 0,
    nd = 0,
    ud = 0,
    nr = 0,
    nm = 0,
    skipped = 0,
    bad = 0;
  var maxOrder = d.labTests.reduce(function (a, x) {
    return Math.max(a, x.order || 0);
  }, 0);
  j.tests.forEach(function (t0) {
    if (!t0) {
      bad++;
      return;
    }
    var name = labStr(t0.name),
      id = labStr(t0.id) || (name ? labSlug(name) : "");
    if (!id || !name) {
      bad++;
      return;
    }
    var inc = {
      id: id,
      name: name,
      group: labStr(t0.group) || "Other",
      unit: labStr(t0.unit),
      range: labStr(t0.range),
      lo: labNumOrNull(t0.lo),
      hi: labNumOrNull(t0.hi),
      tlo: labNumOrNull(t0.tlo),
      thi: labNumOrNull(t0.thi),
      desc: labStr(t0.desc),
      calc: t0.calc === true || t0.calc === "true",
      notes: labStr(t0.notes),
      order: labNumOrNull(t0.order),
    };
    var ix = d.labTests.findIndex(function (x) {
      return x.id === id;
    });
    if (ix < 0) {
      inc.order = maxOrder + (inc.order === null ? nt + 1 : inc.order);
      d.labTests.push(inc);
      nt++;
    } else {
      var ex = d.labTests[ix],
        mg = Object.assign({}, ex);
      ["name", "group", "unit", "range"].forEach(function (k) {
        if (inc[k]) mg[k] = inc[k];
      });
      ["lo", "hi"].forEach(function (k) {
        if (inc[k] !== null) mg[k] = inc[k];
      });
      if (inc.calc) mg.calc = true;
      if (!labStr(ex.desc) && inc.desc) mg.desc = inc.desc;
      if (!labStr(ex.notes) && inc.notes) mg.notes = inc.notes;
      ["tlo", "thi"].forEach(function (k) {
        if (!labNumOk(ex[k]) && inc[k] !== null) mg[k] = inc[k];
      });
      d.labTests[ix] = mg;
      ut++;
    }
  });
  var known = {};
  d.labTests.forEach(function (t) {
    known[t.id] = 1;
  });
  var orphan = 0;
  (j.draws || []).forEach(function (r0) {
    if (!r0) {
      bad++;
      return;
    }
    var date = labStr(r0.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      bad++;
      return;
    }
    var id = labStr(r0.id) || "draw-" + date;
    var res = {};
    Object.keys(r0.results || {}).forEach(function (k) {
      var v = labStr(r0.results[k]);
      if (!v) return;
      res[k] = v;
      nr++;
      if (!known[k]) orphan++;
    });
    var flds = {
      date: date,
      time: labStr(r0.time),
      label: labStr(r0.label),
      fasted: /^(yes|no)$/.test(labStr(r0.fasted)) ? labStr(r0.fasted) : "",
      workout: /^(yes|no)$/.test(labStr(r0.workout)) ? labStr(r0.workout) : "",
      weight: labStr(r0.weight),
      statin: labStr(r0.statin),
      notes: labStr(r0.notes),
    };
    var ix = d.labDraws.findIndex(function (x) {
      return x.id === id;
    });
    if (ix < 0) {
      d.labDraws.push(Object.assign({ id: id }, flds, { results: res }));
      nd++;
    } else {
      var ex = d.labDraws[ix],
        mg = Object.assign({}, ex);
      Object.keys(flds).forEach(function (k) {
        if (flds[k]) mg[k] = flds[k];
      });
      mg.results = Object.assign({}, ex.results || {}, res);
      d.labDraws[ix] = mg;
      ud++;
    }
  });
  var haveDates = {},
    haveIds = {};
  d.metrics.forEach(function (m) {
    if (!/^home-/.test(m.id || "")) haveDates[m.date] = 1;
    haveIds[m.id] = 1;
  });
  (j.metrics || []).forEach(function (m) {
    if (!m || !m.id) return;
    if (haveIds[m.id] || haveDates[m.date]) {
      skipped++;
      return;
    }
    d.metrics.push(m);
    nm++;
  });
  if (nm) d.settings.trackWeight = true;
  s();
  r.labTest = null;
  r.labHelp = false;
  Ua();
  var msg =
    "Imported " +
    nr +
    " result" +
    (nr === 1 ? "" : "s") +
    ". " +
    (nt ? nt + " new test" + (nt === 1 ? "" : "s") + ", " : "") +
    (ut ? ut + " updated, " : "") +
    nd +
    " new draw" +
    (nd === 1 ? "" : "s") +
    (ud ? ", " + ud + " updated" : "") +
    "." +
    (nm ? " " + nm + " home readings added to the Weight page." : "") +
    (skipped ? " " + skipped + " home readings skipped (already logged that day)." : "");
  var unread = (Array.isArray(j.unreadable) ? j.unreadable : []).map(labStr).filter(Boolean);
  var warn = [];
  if (bad)
    warn.push(
      bad + " entr" + (bad === 1 ? "y was" : "ies were") + " skipped because a name or date was missing.",
    );
  if (orphan)
    warn.push(
      orphan +
        " result" +
        (orphan === 1 ? " points" : "s point") +
        " to a test that is not in the list, so " +
        (orphan === 1 ? "it does" : "they do") +
        " not show. Ask the AI to send the whole answer again.",
    );
  if (unread.length || warn.length) {
    Vt(
      "Imported, with a few things to check",
      '<p style="margin:0 0 12px">' +
        Ht(msg) +
        "</p>" +
        (unread.length
          ? '<p style="margin:0 0 6px"><b>The AI could not read these clearly, so they were left out.</b> Type them in yourself with <b>Edit</b> on that draw (Draws view):</p><ul style="margin:0 0 12px;padding-left:20px">' +
            unread
              .map(function (x) {
                return "<li>" + Ht(x) + "</li>";
              })
              .join("") +
            "</ul>"
          : "") +
        warn
          .map(function (x) {
            return '<p class="tiny" style="margin:0 0 8px;color:var(--due)">' + Ht(x) + "</p>";
          })
          .join(""),
      '<button class="btn" data-close>OK</button>',
    );
  } else Ft(msg + " Check a few against your reports.");
}

function labImport(e) {
  var f = e.target.files[0];
  if (!f) return;
  var rd = new FileReader();
  rd.onload = function () {
    var p = labParse(rd.result);
    if (p.err) {
      Ft(p.err);
      return;
    }
    labApply(p.j);
  };
  rd.readAsText(f);
  e.target.value = "";
}

function labPasteForm() {
  Vt(
    "Paste from AI",
    '<p class="tiny muted" style="margin:0 0 10px">Paste the whole reply from the AI app, then press Import. It is fine if the paste includes the AI\'s own words before or after the data.</p>' +
      '<div class="field"><label for="lp-t">AI reply</label><textarea id="lp-t" spellcheck="false" autocapitalize="off" autocomplete="off" style="min-height:220px;font-family:var(--mono);font-size:12px" placeholder="{ &quot;format&quot;: &quot;korah-labs&quot;, …"></textarea></div>' +
      '<p class="tiny muted" style="margin:0">Importing adds to what is here. It never deletes a test or a draw, and it keeps your own targets and notes.</p>',
    '<button class="btn ghost" data-close>Cancel</button><button class="btn" id="lp-go">Import</button>',
  );
  var m = Ot("#modal");
  m.querySelector("#lp-go").addEventListener("click", function () {
    var p = labParse(m.querySelector("#lp-t").value);
    if (p.err) {
      Ft(p.err);
      return;
    }
    Rt();
    labApply(p.j);
  });
}

async function labCopyPrompt(btn) {
  var ok = false;
  try {
    await navigator.clipboard.writeText(LAB_AI_PROMPT);
    ok = true;
  } catch (x) {}
  if (!ok) {
    var ta = document.createElement("textarea");
    ta.value = LAB_AI_PROMPT;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    try {
      ok = document.execCommand("copy");
    } catch (x) {}
    ta.remove();
  }
  if (ok) {
    if (btn) {
      btn.textContent = "Copied ✓";
      setTimeout(function () {
        btn.textContent = "Copy the instructions";
      }, 2500);
    }
    Ft("Instructions copied. Paste them into the AI chat.");
  } else {
    Ft('Could not copy. Open "See the instructions" below and copy the text by hand.');
  }
}

function labHelpView() {
  var synced = typeof jn !== "undefined" && jn;
  var el = Bt('<div class="stack lab-root howto-wrap"></div>');
  el.appendChild(
    Bt(
      '<div class="head"><div><button class="btn ghost sm" id="lh-back" style="margin-bottom:8px">‹ Labs</button><h1>Fill in your labs with AI</h1>' +
        "<p>An AI chat app can read your lab reports and turn every result into text this page understands. You paste it in once and your whole history appears, charted. It saves typing in every number.</p></div></div>",
    ),
  );
  el.querySelector("#lh-back").addEventListener("click", function () {
    r.labHelp = false;
    Ua();
  });

  el.appendChild(
    Bt(
      '<div class="panel howto"><h2>What you need</h2><div class="pbody"><ul>' +
        "<li><b>Your lab reports.</b> PDFs from your lab's patient portal work best. Clear, flat photos of paper reports also work.</li>" +
        "<li><b>An AI chat app that can read files</b>, such as Claude, ChatGPT or Gemini, on your phone or computer. The free versions handle a few reports at a time.</li>" +
        "</ul></div></div>",
    ),
  );

  var steps = Bt(
    '<div class="panel howto"><h2>Step by step</h2><div class="pbody">' +
      "<p><b>1. Copy the instructions.</b> They tell the AI exactly how to lay out your results so this page can read them.</p>" +
      '<p><button class="btn" id="lh-copy">Copy the instructions</button></p>' +
      '<details class="batch" style="margin:0 0 14px"><summary>See the instructions</summary><div><pre class="lab-pre" id="lh-pre"></pre></div></details>' +
      "<p><b>2. Start a new chat in the AI app.</b> Attach your reports with the paperclip or <b>+</b> button. Then paste the instructions into the message box and send.</p>" +
      '<p><b>3. Copy the AI\'s reply.</b> It is a block of text that starts with <span class="mono">{</span>. Most apps put a <b>Copy</b> button on the block. If yours does not, press and hold (or select) the whole block and copy it.</p>' +
      "<p><b>4. Paste it here.</b> Come back to <b>Labs</b>, tap <b>Paste from AI</b>, paste, and tap <b>Import</b>.</p>" +
      "<p><b>5. Check it.</b> Open a few tests and compare them with your reports. AI can misread a number, especially from a photo. Fix a wrong value with <b>Edit</b> on that draw (Draws view).</p>" +
      '<div class="note"><span>ⓘ</span><span>If the AI gives you a file called <span class="mono">labs-import.json</span> instead of text, save it and use <b>Import file</b> on the Labs page.</span></div>' +
      "</div></div>",
  );
  steps.querySelector("#lh-pre").textContent = LAB_AI_PROMPT;
  steps.querySelector("#lh-copy").addEventListener("click", function (e) {
    labCopyPrompt(e.currentTarget);
  });
  el.appendChild(steps);

  el.appendChild(
    Bt(
      '<div class="panel howto"><h2>Adding results later</h2><div class="pbody"><ul>' +
        "<li>When new bloodwork comes back, start a <b>new</b> chat, paste the same instructions and attach only the new report. Then Paste from AI as before.</li>" +
        "<li>Importing adds to what is here. It never deletes anything, and it keeps the targets and notes you set yourself.</li>" +
        "<li>New results line up with the tests you already have because the test names are the same. If a test ever shows up twice because a lab spelled it differently, type the result into the original with <b>Edit</b> on the draw, then delete the extra test.</li>" +
        "</ul></div></div>",
    ),
  );

  el.appendChild(
    Bt(
      '<div class="panel howto"><h2>If something goes wrong</h2><div class="pbody"><ul>' +
        "<li><b>The AI stops partway or says the answer is too long:</b> send fewer reports at a time and import each answer. They add together.</li>" +
        '<li><b>"That text could not be read":</b> part of the reply was not copied. Copy the whole block again, or ask the AI to send it again.</li>' +
        "<li><b>The AI says it could not read some values:</b> after importing, a list shows which ones. Type them in yourself.</li>" +
        '<li><b>The AI answers in words, not data:</b> paste the instructions again and say "Reply with the JSON only."</li>' +
        "</ul></div></div>",
    ),
  );

  el.appendChild(
    Bt(
      '<div class="panel howto"><h2>Your privacy</h2><div class="pbody">' +
        "<p>Your reports go to the company that runs the AI app you choose. Before you upload, you can cover or crop out your name, health card number and address; the AI does not need them. Check that app's settings for whether your chats are used to train it.</p>" +
        "<p>Inside this app your labs are stored on this device with the rest of your log" +
        (synced
          ? ", and if you turn on sync they are scrambled with your passphrase before they leave it"
          : "") +
        ".</p>" +
        '<p class="tiny muted">This page is a log, not medical advice. The ranges come from your own lab reports; your doctor interprets them.</p>' +
        "</div></div>",
    ),
  );
  return el;
}

document.addEventListener("click", function (e) {
  var b = e.target.closest && e.target.closest("[data-labhelp]");
  if (b) {
    e.preventDefault();
    r.tab = "labs";
    r.labTest = null;
    r.labHelp = true;
    Ua();
  }
});

function labCsv() {
  var draws = labDraws(),
    tests = labTests();
  var rows = [
    ["Section", "Test", "Units", "Range"].concat(
      draws.map(function (x) {
        return x.date + (x.time ? " " + x.time : "");
      }),
    ),
  ];
  rows.push(
    ["", "Worked out before", "", ""].concat(
      draws.map(function (x) {
        return x.workout;
      }),
    ),
  );
  rows.push(
    ["", "Fasted", "", ""].concat(
      draws.map(function (x) {
        return x.fasted;
      }),
    ),
  );
  rows.push(
    ["", "Body weight", "lb", ""].concat(
      draws.map(function (x) {
        return x.weight;
      }),
    ),
  );
  rows.push(
    ["", COMMUNITY ? "Medications at the time" : "Statin / ezetimibe", "", ""].concat(
      draws.map(function (x) {
        return x.statin;
      }),
    ),
  );
  tests.forEach(function (t) {
    rows.push(
      [t.group, t.name, t.unit, t.range].concat(
        draws.map(function (x) {
          return (x.results || {})[t.id] || "";
        }),
      ),
    );
  });
  var csv =
    "﻿" +
    rows
      .map(function (r0) {
        return r0
          .map(function (c) {
            return '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"';
          })
          .join(",");
      })
      .join("\n");
  Ea("labs-" + te() + ".csv", new Blob([csv], { type: "text/csv" }));
  Ft("Spreadsheet downloaded.");
}

/* ---------- History → List: filter to one compound ---------- */
function histListBar() {
  var ids = Array.from(
    new Set(
      (d.logs || [])
        .map(function (l) {
          return l.compoundId;
        })
        .filter(Boolean),
    ),
  );
  var comps = ids
    .map(function (id) {
      return { id: id, name: pt(id) || "Deleted compound" };
    })
    .sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  if (r.histComp && ids.indexOf(r.histComp) < 0) r.histComp = null;
  var el = Bt('<div class="stack" style="gap:12px"></div>');
  var bar = Bt(
    '<div class="lab-ctl"><label class="tiny muted" for="h-comp">Show</label><select id="h-comp" class="lab-q" style="width:auto;min-width:200px"><option value="">All compounds</option>' +
      comps
        .map(function (c) {
          return (
            '<option value="' +
            Ht(c.id) +
            '"' +
            (c.id === r.histComp ? " selected" : "") +
            ">" +
            Ht(c.name) +
            "</option>"
          );
        })
        .join("") +
      "</select>" +
      (r.histComp
        ? '<button class="btn ghost sm" id="h-all">Show all</button>'
        : '<span class="tiny muted">Tip: tap a compound name in the list to see only its shots.</span>') +
      "</div>",
  );
  bar.querySelector("#h-comp").addEventListener("change", function (e) {
    r.histComp = e.target.value || null;
    Ua();
  });
  var all = bar.querySelector("#h-all");
  if (all)
    all.addEventListener("click", function () {
      r.histComp = null;
      Ua();
    });
  el.appendChild(bar);
  if (r.histComp) {
    var L = d.logs.filter(function (l) {
      return l.compoundId === r.histComp;
    });
    var tk = L.filter(function (l) {
      return l.status === "taken";
    })
      .map(function (l) {
        return l.date || String(l.at || "").slice(0, 10);
      })
      .filter(Boolean)
      .sort();
    var other = L.length - tk.length;
    var runs = 0,
      prev = null;
    Array.from(new Set(tk)).forEach(function (dt) {
      if (!prev || ae(prev, dt) > 21) runs++;
      prev = dt;
    });
    var c = Ce(r.histComp),
      mg = L.filter(function (l) {
        return l.status === "taken";
      }).reduce(function (a, l) {
        return a + be(l.doseMg);
      }, 0);
    el.appendChild(
      Bt(
        '<div class="panel lab-tile"><div class="lab-counts" style="margin:0">' +
          "<span><b>" +
          tk.length +
          "</b> taken</span>" +
          (other ? '<span class="muted"><b>' + other + "</b> missed or skipped</span>" : "") +
          (tk.length
            ? '<span>First <b style="font-size:15px">' +
              Ht(de(tk[0])) +
              '</b></span><span>Last <b style="font-size:15px">' +
              Ht(de(tk[tk.length - 1])) +
              "</b></span>"
            : "") +
          (mg ? '<span>Total <b style="font-size:15px">' + Ht($e(mg, c)) + "</b></span>" : "") +
          (runs > 1 ? '<span class="muted">' + runs + " separate runs (gaps over 21 days)</span>" : "") +
          "</div></div>",
      ),
    );
  }
  return el;
}
document.addEventListener("click", function (e) {
  var b = e.target.closest && e.target.closest("[data-hcomp]");
  if (b) {
    r.histComp = b.dataset.hcomp;
    Ua();
  }
});
