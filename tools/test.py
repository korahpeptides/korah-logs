"""Headless checks for both builds. Run after `node build.mjs`:

    python3 tools/test.py

Needs Python Playwright with Chromium. Uses fake data and a fake AI service; nothing leaves the machine.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []


def check(name, ok, extra=""):
    print(("PASS " if ok else "FAIL ") + name + (("  " + str(extra)) if extra and not ok else ""))
    if not ok:
        fails.append(name)


SETUP = r"""
() => {
  const T = te();
  d.compounds = [{id:'c1',name:'HGH / Somatropin',base:'iu',route:'SubQ',color:'#27567F'},{id:'c2',name:'Retatrutide',route:'SubQ',color:'#2C6349'},{id:'c3',name:'DSIP',route:'SubQ',color:'#A8690F'}];
  d.protocols = [
    {id:'p1',compoundId:'c1',dose:2,unit:'iu',route:'SubQ',sched:'daily',split:true,startDate:ne(T,-60),active:true,phases:[]},
    {id:'p2',compoundId:'c2',dose:2,unit:'mg',route:'SubQ',sched:'weekdays',days:[1],startDate:ne(T,-60),active:true,phases:[]}];
  d.batches = [{id:'b1',compoundId:'c2',vialMg:10,sealed:2,startVials:3,openMg:6,bacMl:'2',lot:'KP-0007',status:'open'}];
  d.logs = [];
  for (let i=1;i<=7;i++){ const dt=ne(T,-i);
    d.logs.push({id:'a'+i,protocolId:'p1',compoundId:'c1',date:dt,status:'taken',slot:'am',doseMg:2});
    if (i!==3 && i!==5) d.logs.push({id:'b'+i,protocolId:'p1',compoundId:'c1',date:dt,status:'taken',slot:'pm',doseMg:2});
    if (ee(dt).getDay()===1) d.logs.push({id:'r'+i,protocolId:'p2',compoundId:'c2',date:dt,status:'taken',doseMg:2});
  }
  d.logs.push({id:'x1',protocolId:'p2',compoundId:'c2',date:ne(T,-2),status:'taken',doseMg:2});
  d.logs.push({id:'x2',compoundId:'c3',date:ne(T,-4),status:'taken',doseMg:0.1});
  d.metrics = [[-60,208,5.0],[-45,210,5.2],[-30,212,5.4],[-15,215,5.8],[-13,217,5.8],[-12,219,6.0]].map((x,i)=>({id:'m'+i,date:ne(T,x[0]),weight:x[1],glucose:x[2]}));
  d.settings.trackWeight = true;
  d.labTests = [
    {id:'lab-igf',name:'IGF-1',group:'Hormones',unit:'ug/L',range:'Z -2 to +2',lo:null,hi:250,order:1},
    {id:'lab-t',name:'Testosterone',group:'Hormones',unit:'nmol/L',range:'8.6-29',lo:8.6,hi:29,order:2},
    {id:'lab-a1c',name:'Hemoglobin A1c',group:'Sugar',unit:'%',range:'<6.0',lo:null,hi:6.0,thi:5.6,order:3},
    {id:'lab-alt',name:'ALT',group:'Liver',unit:'U/L',range:'<50',lo:null,hi:50,order:4},
    {id:'lab-glucose-fasting',name:'Glucose, Fasting',group:'Sugar',unit:'mmol/L – mg/dL',range:'3.6-6.0',lo:3.6,hi:6.0,order:5}];
  d.labDraws = [{id:'dr1',date:ne(T,-13),statin:'none',results:{'lab-igf':'292','lab-t':'41','lab-a1c':'5.7','lab-alt':'22','lab-glucose-fasting':'4.6/83'}}];
  d.insights = []; d.insGuides = [];
  d.settings.ai = {url:'https://example.workers.dev',key:'k',context:'On prescribed TRT.'};
  window.__calls = [];
  window.fetch = async (url, opt) => {
    const b = JSON.parse(opt.body); window.__calls.push(b);
    const p = JSON.parse(b.messages[0].content.split('\n\n').slice(1).join('\n\n'));
    const flags = p.must_cover_flags;
    const notes = flags.slice(0, Math.max(0, flags.length-1)).map(f=>({id:f.id, explanation:'Explains '+f.id}));
    const out = b.tools[0].name==='protocol_report'
      ? {rating:'excellent', headline:'H', summary:'S', flag_notes:notes,
         compound_guides:(p.compound_guides_needed||[]).map(g=>({ref:g.ref, expect:'Guide for '+g.compound+' '+g.stage, watch:['w1','w2']})),
         interactions:[], lab_notes:[], recommendations:[]}
      : {rating:'good', headline:'H', summary:'S', flag_notes:notes, findings:[], observations:[], recommendations:[], clinician_questions:[]};
    return new Response(JSON.stringify({model:b.model,stop_reason:'tool_use',content:[{type:'tool_use',input:out}]}),{status:200});
  };
}
"""

TABS = ["instructions", "today", "log", "protocols", "stock", "history", "labs", "insights", "labels", "tools", "library", "weight", "settings"]

with sync_playwright() as pw:
    br = pw.chromium.launch()
    for variant in ["personal", "community"]:
        print("\n== " + variant)
        for width, theme in [(1280, "light"), (390, "dark")]:
            pg = br.new_page(viewport={"width": width, "height": 900}, color_scheme=theme)
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.route("**/*", lambda r: r.abort() if not r.request.url.startswith("file:") else r.continue_())
            pg.goto("file://" + os.path.join(ROOT, "dist", variant, "index.html"))
            pg.wait_for_timeout(400)
            pg.evaluate(SETUP)
            tag = f"{variant} {width}"
            stamp = pg.evaluate("o")
            check(f"{tag}: stamp says {variant}", stamp.endswith(variant), stamp)
            nav = pg.evaluate("ln().map(x=>x[0])")
            check(f"{tag}: Insights tab only in personal", ("insights" in nav) == (variant == "personal"), nav)
            check(f"{tag}: write-ups are synced and in the empty state", pg.evaluate("Fn.includes('insGuides') && Array.isArray(l().insGuides)"))
            for tab in TABS:
                pg.evaluate(f"r.tab='{tab}'; r.labelId=null; Ua()")
                sw = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
                check(f"{tag}: {tab} opens with no sideways scroll", not sw)
            # labels: CoA and lot only in personal
            pg.evaluate("r.tab='labels'; Ua()")
            has_coa = pg.evaluate("!!document.querySelector('#lf-coa')")
            has_lot = pg.evaluate("!!document.querySelector('#lf-lot')")
            check(f"{tag}: label CoA/lot fields only in personal", (has_coa and has_lot) == (variant == "personal") and (has_coa or has_lot) == (variant == "personal"))
            # Excel for Niimbot: a real .xlsx, headers row + one row per vial, CoA column only in personal
            if width == 1280:
                with pg.expect_download() as dl:
                    pg.click("#lb-xlsx")
                path = "/tmp/nb-test.xlsx"
                dl.value.save_as(path)
                import openpyxl
                wb = openpyxl.load_workbook(path)
                rows = [[c.value for c in r] for r in wb.active.iter_rows()]
                hdr = rows[0]
                check(f"{tag}: Niimbot xlsx opens, header + 1 vial row", len(rows) == 2 and hdr[0] == "Compound", rows)
                check(f"{tag}: Niimbot xlsx CoA/Lot columns only in personal", ("CoA QR" in hdr and "Lot" in hdr) == (variant == "personal"), hdr)
                row = dict(zip(hdr, rows[1]))
                check(f"{tag}: Niimbot xlsx row carries the label text", row["Compound"] == "Retatrutide" and row["Strength"] == "10MG/2ML", row)
                if variant == "personal":
                    check(f"{tag}: Niimbot xlsx CoA link from lot", row["CoA QR"] == "https://coa.korahpeptides.com/KP-0007.pdf", row.get("CoA QR"))
            # Layout panel: personal only; changes save to settings and redraw the label; reset restores
            has_lay = pg.evaluate("!!document.querySelector('#lb-lay')")
            check(f"{tag}: label Layout panel only in personal", has_lay == (variant == "personal"))
            if variant == "personal":
                before = pg.evaluate("document.querySelector('#limg').src")
                check(f"{tag}: layout starts collapsed", pg.evaluate("document.querySelector('#lb-lay').hidden"))
                pg.click("#lb-laytog")
                pg.click("#lb-lay [data-a=bold][data-k=name]")
                pg.click("#lb-lay [data-a=md][data-k=name]")
                pg.click("#lb-lay [data-a=up][data-k=bottom]")
                pg.click("#lb-lay [data-a=hide][data-k='s:small']")
                pg.click("#lb-lay [data-a=qp][data-v=top]")
                pg.wait_for_timeout(50)
                L = pg.evaluate("d.settings.labelLayout")
                ok = L["order"][:2] == ["under", "name"] and L["m"]["name"]["b"] is False and L["m"]["bottom"]["sc"] == 110 and L["sd"]["small"]["h"] and L["qr"]["pos"] == "top"
                check(f"{tag}: layout changes saved", ok, L)
                check(f"{tag}: layout changes redraw the label", pg.evaluate("document.querySelector('#limg').src") != before)
                for _ in range(20): pg.evaluate("(()=>{const b=document.querySelector('#lb-lay [data-a=up][data-k=strength]'); b && !b.disabled && b.click()})()")
                check(f"{tag}: size capped at 160%", pg.evaluate("d.settings.labelLayout.m.strength.sc") == 160)
                # 2 lines on the bottom bar changes the drawing
                b2 = pg.evaluate("document.querySelector('#limg').src")
                pg.click("#lb-lay [data-a=two][data-k=bottom]")
                pg.wait_for_timeout(50)
                check(f"{tag}: 2 lines saved and redraws", pg.evaluate("d.settings.labelLayout.m.bottom.two") is True and pg.evaluate("document.querySelector('#limg').src") != b2)
                # typed wording survives a background redraw (sync) while focus is elsewhere
                pg.fill("#lf-bottom", "Research Use Only")
                pg.evaluate("document.activeElement.blur(); Ua(1)")
                check(f"{tag}: unsaved label wording survives a sync redraw", pg.evaluate("document.querySelector('#lf-bottom').value") == "Research Use Only")
                pg.click("#lb-savebatch")
                check(f"{tag}: saving clears the draft", pg.evaluate("!(r.lbDraft||{})[r.labelId] && d.batches[0].label.bottom") == "Research Use Only")
                pg.click("#lb-reset")
                pg.wait_for_timeout(50)
                pg.click("#lb-laytog") if pg.evaluate("document.querySelector('#lb-lay').hidden") else None
                pg.click("#lb-lay [data-a=reset]")
                pg.wait_for_timeout(50)
                check(f"{tag}: reset layout", pg.evaluate("d.settings.labelLayout") is None and pg.evaluate("document.querySelector('#limg').src") == before)
            pg.evaluate("r.tab='labs'; Ua(); labDrawForm('dr1')")
            lbl = pg.evaluate("document.querySelector('label[for=ld-st]').textContent")
            check(f"{tag}: draw form medication label", lbl == ("Statin / ezetimibe" if variant == "personal" else "Medications at the time"), lbl)
            pg.evaluate("Rt()")
            if variant == "personal" and width == 1280:
                res = pg.evaluate("""async () => {
                  const T = te(), start = ne(T,-7), end = ne(T,-1);
                  const r1 = await insRunProtocol(start, end);
                  const c1 = window.__calls.length - 1;
                  const r2 = await insRunProtocol(start, end, r1.id);
                  const p1 = JSON.parse(window.__calls[c1].messages[0].content.split('\\n\\n').slice(1).join('\\n\\n'));
                  const p2 = JSON.parse(window.__calls.at(-1).messages[0].content.split('\\n\\n').slice(1).join('\\n\\n'));
                  const L = await insRunLabs('dr1');
                  r.tab='insights'; r.insOpen=r1.id; Ua();
                  const txt = document.querySelector('#view').innerText;
                  return {same: JSON.stringify(r1.flags)===JSON.stringify(r2.flags) && r1.rating===r2.rating,
                    need1: p1.compound_guides_needed.length, need2: p2.compound_guides_needed.length,
                    saved: d.insGuides.length, model: window.__calls[c1].model, temp: window.__calls[c1].temperature,
                    sent: p1.must_cover_flags.map(f=>f.id), all: r1.flags.map(f=>f.id+(f.note?'*':'')),
                    guideShown: txt.includes('Guide for HGH / Somatropin early'),
                    fixedShown: txt.includes('All were evening doses.'),
                    missingShown: txt.includes('Claude did not explain this one'),
                    glu: r1.flags.find(f=>f.title==='Home-meter fasting glucose') || null,
                    rating: r1.rating, labRating: L.rating, txt: txt.slice(0, 300)};
                }""")
                check("report twice: same flags and rating", res["same"])
                check("first report asks for 2 write-ups, second for none", res["need1"] == 2 and res["need2"] == 0, res)
                check("write-ups saved once", res["saved"] == 2, res["saved"])
                check("model defaults to Haiku", res["model"] == "claude-haiku-5-5", res["model"])
                check("randomness set to zero", res["temp"] == 0)
                check("routine flags not sent to the AI", all(f.rstrip("*") not in res["sent"] for f in res["all"] if f.endswith("*")) and len(res["sent"]) < len(res["all"]), res)
                check("saved write-up shown on the report", res["guideShown"])
                check("fixed wording shown (evening-dose pattern)", res["fixedShown"])
                check("an unexplained flag is still listed", res["missingShown"])
                check("protocol rating set by the app", res["rating"] == "fair", res["rating"])
                g = res["glu"] or {}
                check("home glucose labelled as home meter and set against the lab result",
                      g.get("sev") == "low" and "lab fasting glucose was 4.6 mmol/L" in g.get("text", "") and "Diabetes" not in g.get("text", "") and g.get("note"), g)
                check("lab rating set by the app", res["labRating"] == "needs_attention", res["labRating"])
            if variant == "personal" and width == 1280:
                sp = pg.evaluate("""() => {
                  const T = te(), F = ne(T, -3);
                  d.protocols = [{id:'ps',compoundId:'c1',dose:1,unit:'iu',route:'SubQ',sched:'daily',split:true,splitFrom:F,startDate:ne(T,-10),active:true,phases:[]}];
                  d.logs = [];
                  for (let i=1;i<=10;i++){ const dt=ne(T,-i);
                    if (dt < F) d.logs.push({id:'o'+i,protocolId:'ps',compoundId:'c1',date:dt,status:'taken',doseMg:1});
                    else { d.logs.push({id:'a'+i,protocolId:'ps',compoundId:'c1',date:dt,status:'taken',slot:'am',doseMg:1});
                           d.logs.push({id:'p'+i,protocolId:'ps',compoundId:'c1',date:dt,status:'taken',slot:'pm',doseMg:1}); } }
                  const S = insStats(ne(T,-10), ne(T,-1));
                  const before = SL(d.protocols[0], ne(F,-1)), after = SL(d.protocols[0], F);
                  r.tab='history'; r.histView='calendar'; r.calDay=ne(F,-1); r.calMonth=null; Ua();
                  const dots = document.querySelector('[data-calday="'+ne(F,-1)+'"]').querySelectorAll('.cdot').length;
                  Mn('ps'); const m = Ot('#modal');
                  const shown = m.querySelector('#p-sf').style.display !== 'none' && m.querySelector('#p-splitfrom').value === F;
                  m.querySelector('#p-splitfrom').value = ne(F,-1); m.querySelector('#p-save').click();
                  const saved = d.protocols[0].splitFrom;
                  return {missed: S.rows[0].missed, pct: S.pct, adh: dt(10).pct, before, after, dots, shown, saved, F1: ne(F,-1)};
                }""")
                check("AM + PM start date: no missed PM before it", sp["missed"] == [] and sp["pct"] == 100, sp)
                check("AM + PM start date: one dose before, two from it", sp["before"] == [""] and sp["after"] == ["am", "pm"], sp)
                check("AM + PM start date: calendar shows one dot before it", sp["dots"] == 1, sp)
                check("AM + PM start date: shown and saved in the form", sp["shown"] and sp["saved"] == sp["F1"], sp)
            if variant == "personal" and width == 1280:
                cg = pg.evaluate("""() => {
                  const S0 = '2026-09-01', D = '2026-10-20', E = '2026-10-28';
                  d.compounds.push({id:'ct',name:'Testosterone',route:'SubQ',color:'#93362A'});
                  d.protocols = [{id:'pt',compoundId:'ct',dose:50,unit:'mg',route:'SubQ',sched:'weekdays',days:[2,5],startDate:S0,active:true,phases:[]}];
                  d.logs = [];
                  for (let x = S0; x <= E; x = ne(x, 1)) { const w = ee(x).getDay();
                    if (x < D ? w === 2 : (w === 2 || w === 5)) d.logs.push({id:'t'+x,protocolId:'pt',compoundId:'ct',date:x,status:'taken',doseMg:x < D ? 100 : 50}); }
                  Mn('pt'); const m = Ot('#modal');
                  const esc = m.querySelector('#p-esc'); esc.checked = true; esc.dispatchEvent(new Event('change'));
                  m.querySelector('[data-esc="date"]').click();
                  m.querySelector('#p-chgdate').value = D; m.querySelector('#p-chgok').click();
                  const rows = m.querySelectorAll('#p-escbox .phrow');
                  rows[0].querySelector('.ph-d').value = '100'; rows[0].querySelector('.ph-d').dispatchEvent(new Event('input'));
                  rows[0].querySelector('[data-pd="0,5"]').click();
                  m.querySelector('#p-save').click();
                  const p = d.protocols[0], S = insStats(S0, E);
                  return {n: rows.length, ph: p.phases.map(x=>[x.dose, x.dur, x.durUnit, x.ps, (x.pdays||[]).join('')]),
                    missed: S.rows[0].missed, pct: S.pct, before: Ge(p,'2026-10-13').dose, after: Ge(p,'2026-10-23').dose,
                    friBefore: Ye(p,'2026-10-16'), friAfter: Ye(p,'2026-10-23'), tueBefore: Ye(p,'2026-10-13'), open: !Ot('#scrim').hidden};
                }""")
                check("Change on a date: two phases split at the date", cg["n"] == 2 and cg["ph"][0][1] == 49 and cg["ph"][0][2] == "days", cg)
                check("Change on a date: old dose before, new dose after", cg["before"] == 100 and cg["after"] == 50, cg)
                check("Change on a date: no missed Fridays before the change", cg["missed"] == [] and cg["pct"] == 100 and not cg["friBefore"] and cg["friAfter"] and cg["tueBefore"], cg)
                check("Change on a date: form saved and closed", not cg["open"], cg)
            check(f"{tag}: no page errors", not errs, errs)
            pg.close()
    br.close()

html = {v: open(os.path.join(ROOT, "dist", v, "index.html"), encoding="utf-8").read() for v in ["personal", "community"]}
check("QR library only in personal", ("qrcode-generator" in html["personal"]) and ("qrcode-generator" not in html["community"]))
check("analytics tag only in community", ("cloudflareinsights" in html["community"]) and ("cloudflareinsights" not in html["personal"]))
check("copyright notice kept in both", all(h.count("© 2026 Korah Peptides") >= 3 for h in html.values()))
print("\n" + ("ALL PASSED" if not fails else f"{len(fails)} FAILED: " + ", ".join(fails)))
sys.exit(1 if fails else 0)
