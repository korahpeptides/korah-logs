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
            check(f"{tag}: no page errors", not errs, errs)
            pg.close()
    br.close()

html = {v: open(os.path.join(ROOT, "dist", v, "index.html"), encoding="utf-8").read() for v in ["personal", "community"]}
check("QR library only in personal", ("qrcode-generator" in html["personal"]) and ("qrcode-generator" not in html["community"]))
check("analytics tag only in community", ("cloudflareinsights" in html["community"]) and ("cloudflareinsights" not in html["personal"]))
check("copyright notice kept in both", all(h.count("© 2026 Korah Peptides") >= 3 for h in html.values()))
print("\n" + ("ALL PASSED" if not fails else f"{len(fails)} FAILED: " + ", ".join(fails)))
sys.exit(1 if fails else 0)
